/**
 * @packageDocumentation
 * @category Resolvers
 * @description
 * This module provides GraphQL resolvers for author-related operations.
 * It handles author creation, retrieval, update, and deletion.
 */

import {
    Arg,
    Authorized,
    Ctx,
    ID,
    Mutation,
    Query,
    Resolver,
} from "type-graphql"
import { AppError } from "../../../middlewares/error-handler"
import { Context, Roles } from "../../../types/types"
import { Brackets } from "typeorm"
import { Author } from "../../../database/entities/author/author"
import { CreateAuthorInput } from "../../inputs/create/author/create-author-input"
import { UpdateAuthorInput } from "../../inputs/update/author/update-author-input"
import { isOwnerOrAdmin } from "../../../utils/authorizations"
import { AuthorsResult } from "../../../database/filteredResults/authors/authors-result"
import { AuthorsQueryInput } from "../../queries/authors/authors-query-input"

/**
 * Author Resolver
 * @description
 * Handles all author-related GraphQL mutations and queries.
 */

@Resolver(Author)
export class AuthorsResolver {
    /**
     * GraphQL Query to fetch all authors.
     *
     * This query supports:
     * - search by first name or last name,
     * - sorting (by name, ASC/DESC),
     * - pagination,
     * - as well as counting total authors before and after filters are applied.
     *
     * @param filters - Search filters and options for sorting/pagination.
     *
     * @returns An object containing:
     * - `allAuthors`: Paginated list of authors after applying filters.
     * - `totalCount`: Total number of authors matching the filters.
     * - `totalCountAll`: Total number of authors without filters.
     * - `page` and `limit`: Pagination metadata.
     *
     * @throws AppError - If no authors are found or in case of a server error.
     */
    @Query(() => AuthorsResult)
    async authors(
        @Arg("filters", () => AuthorsQueryInput, { nullable: true })
        filters: AuthorsQueryInput
    ): Promise<AuthorsResult> {
        try {
            const {
                search,
                page = 1,
                limit = 12,
            } = filters || {}

            // Retrieve the base query with all authors created
            const baseQuery = Author.createQueryBuilder("author")
                .leftJoinAndSelect("author.user", "user")
                .leftJoinAndSelect("author.books", "books")
                .leftJoinAndSelect("books.category", "category")

            // Get the total number of unfiltered authors and clone the query to apply filters
            const [totalCountAll, filteredQuery] = await Promise.all([
                baseQuery.getCount(),
                baseQuery.clone(),
            ])

            // Filter firstname and lastname (search)
            if (search?.trim()) {
                const trimmedSearch = `%${search.trim()}%`;

                filteredQuery.andWhere(new Brackets(qb => {
                    qb.where("author.firstname ILIKE :search", { search: trimmedSearch })
                        .orWhere("author.lastname ILIKE :search", { search: trimmedSearch })
                }));
            }

            // Get the total number of authors matching the filters (for pagination)
            const totalCount = await filteredQuery.getCount()

            // Apply pagination
            filteredQuery.skip((page - 1) * limit).take(limit)

            const allAuthors = await filteredQuery.getMany()

            if (!allAuthors) {
                throw new AppError("Authors not found", 404, "NotFoundError")
            }

            return {
                allAuthors,
                totalCount,
                totalCountAll,
                page,
                limit,
            }
        } catch (error) {
            throw new AppError(
                "Failed to fetch authors",
                500,
                "InternalServerError"
            )
        }
    }

    /**
     * Query to get a specific author by their ID.
     *
     * @param id - The ID of the author to fetch.
     *
     * @returns An Author object if found, or null if not.
     *
     * This query retrieves a specific author along with the user who created them.
     *
     * @throws AppError - If the author is not found or if a server error occurs.
     */
    @Query(() => Author, { nullable: true })
    async author(@Arg("id", () => ID) id: number): Promise<Author | null> {
        try {
            const author = await Author.findOne({
                where: { id },
                relations: {
                    user: true,
                    books: {
                        category: true,
                    },
                },
            })
            if (!author) {
                throw new AppError("Author not found", 404, "NotFoundError")
            }

            return author
        } catch (error) {
            throw new AppError(
                "Failed to fetch author",
                500,
                "InternalServerError"
            )
        }
    }

    /**
     * Mutation to create a new author.
     *
     * @param data - The input data containing all required author fields.
     * @param context - The context object that contains the currently authenticated user.
     *
     * @returns The newly created Author object.
     *
     * Only users with the role `User` or `Admin` can create an author.
     * The author is automatically linked to the authenticated user.
     *
     * @throws AppError - On validation or save failure.
     */
    @Authorized(Roles.User, Roles.Admin)
    @Mutation(() => Author)
    async createAuthor(
        @Arg("data", () => CreateAuthorInput) data: CreateAuthorInput,
        @Ctx() context: Context
    ): Promise<Author> {
        try {
            const user = context.user

            if (!user) {
                throw new AppError("User not found", 404, "NotFoundError")
            }

            const newAuthor = new Author()
            Object.assign(newAuthor, data, { user })

            await newAuthor.save()
            return newAuthor
        } catch (error) {
            throw new AppError(
                "Failed to create author",
                500,
                "InternalServerError"
            )
        }
    }

    /**
     * Mutation to update an existing author.
     *
     * @param data - The input data with the fields to update (partial update supported).
     * @param context - GraphQL context containing the authenticated user.
     *
     * @returns The updated Author object, or null if not found or not permitted.
     *
     * Only the admin or the original user who created the author can update it.
     * Validates existence of the author before updating.
     *
     * @throws AppError - If the author is not found, user is unauthorized, or update fails.
     */
    @Authorized(Roles.User, Roles.Admin)
    @Mutation(() => Author, { nullable: true })
    async updateAuthor(
        @Arg("data", () => UpdateAuthorInput) data: UpdateAuthorInput,
        @Ctx() context: Context
    ): Promise<Author | null> {
        try {
            const user = context.user

            if (!user) {
                throw new AppError("User not found", 404, "NotFoundError")
            }

            const author = await Author.findOne({
                where: {
                    id: data.id,
                    user: { id: user.id }
                },
                relations: {
                    user: true,
                },
            })

            if (!author) {
                throw new AppError("Author not found", 404, "NotFoundError")
            }

            if (!isOwnerOrAdmin(author.user.id, user)) {
                throw new AppError(
                    "Not authorized to delete this author",
                    403,
                    "ForbiddenError"
                )
            }

            const { id, ...updateData } = data

            Object.assign(author, updateData)

            await author.save()
            return author
        } catch (error) {
            throw new AppError(
                "Failed to update author",
                500,
                "InternalServerError"
            )
        }
    }

    /**
     * Mutation to delete an existing author.
     *
     * @param id - The ID of the author to delete.
     * @param context - GraphQL context containing the authenticated user.
     *
     * @returns The deleted Author object (with ID), or null if not found.
     *
     * Only the admin or the author's owner can perform this action.
     *
     * @throws AppError - If the author is not found, user is unauthorized, or deletion fails.
     */
    @Authorized(Roles.User, Roles.Admin)
    @Mutation(() => Author, { nullable: true })
    async deleteAuthor(
        @Arg("id", () => ID) id: number,
        @Ctx() context: Context
    ): Promise<Author | null> {
        try {
            const user = context.user

            if (!user) {
                throw new AppError("User not found", 404, "NotFoundError")
            }

            const author = await Author.findOne({
                where: { id },
                relations: { user: true, books: true }
            });

            if (!author) {
                throw new AppError("Author not found", 404, "NotFoundError")
            }

            if (!isOwnerOrAdmin(author.user.id, user)) {
                throw new AppError(
                    "Not authorized to delete this author",
                    403,
                    "ForbiddenError"
                )
            }

            if (!author.books) {
                throw new AppError("Author's books not found", 404, "NotFoundError")
            }

            if (author.books.length > 0) {
                throw new AppError(
                    "Cannot delete author with existing books",
                    400,
                    "BadRequestError"
                );
            }

            if (author !== null) {
                await author.remove()
                author.id = id
            }

            return author
        } catch (error) {
            throw new AppError(
                "Failed to delete author",
                500,
                "InternalServerError"
            )
        }
    }
}
