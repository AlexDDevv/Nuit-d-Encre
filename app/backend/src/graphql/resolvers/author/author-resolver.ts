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
import { AllAuthorsResult } from "../../../database/filteredResults/authors/all-authors-result"
import { AllAuthorsQueryInput } from "../../queries/authors/all-authors-query-input"
import { MyAuthorsResult } from "../../../database/filteredResults/authors/my-authors-result"
import { MyAuthorsQueryInput } from "../../queries/authors/my-authors-query-input"

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
    @Query(() => AllAuthorsResult)
    async authors(
        @Arg("filters", () => AllAuthorsQueryInput, { nullable: true })
        filters: AllAuthorsQueryInput
    ): Promise<AllAuthorsResult> {
        try {
            const {
                search,
                page = 1,
                limit = 12,
            } = filters || {}

            // Retrieve the base query with all books created
            const baseQuery = Author.createQueryBuilder("authors")
                .leftJoinAndSelect("authors.user", "user")

            // Get the total number of unfiltered books and clone the query to apply filters
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

            // Get the total number of books matching the filters (for pagination)
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
                "Failed to fetch books",
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
     * GraphQL Query to retrieve authors created by the currently authenticated user.
     *
     * This query supports:
     * - search by name,
     * - pagination,
     * - and total count before and after filters.
     *
     * ⚠️ Access restricted to roles `User` and `Admin`.
     *
     * @param filters - Search filters and options for pagination.
     * @param context - GraphQL context containing the authenticated user.
     *
     * @returns A paginated list of the user's authors and related metadata.
     *
     * @throws AppError - If the user is not authenticated or in case of a server error.
     */
    @Authorized(Roles.User, Roles.Admin)
    @Query(() => MyAuthorsResult)
    async myAuthors(
        @Arg("filters", () => MyAuthorsQueryInput, { nullable: true })
        filters: MyAuthorsQueryInput,
        @Ctx() context: Context
    ): Promise<MyAuthorsResult> {
        try {
            const user = context.user

            if (!user) {
                throw new AppError(
                    "You can only retrieve your own authors",
                    401,
                    "UnauthorizedError"
                )
            }

            const {
                search,
                page = 1,
                limit = 12,
            } = filters || {}

            // Retrieve the base query with all books created by the user
            const baseQuery = Author.createQueryBuilder("author").where(
                "author.userId = :userId",
                { userId: user.id }
            )

            // Get the total number of unfiltered books and clone the query to apply filters
            const [totalCountAll, filteredQuery] = await Promise.all([
                baseQuery.getCount(),
                baseQuery.clone(),
            ])

            // Filter by firstname and lastname (search)
            if (search?.trim()) {
                const trimmedSearch = `%${search.trim()}%`;

                filteredQuery.andWhere(new Brackets(qb => {
                    qb.where("author.firstname ILIKE :search", { search: trimmedSearch })
                        .orWhere("author.lastname ILIKE :search", { search: trimmedSearch })
                }));
            }

            // Get the total number of books matching the filters (for pagination)
            const totalCount = await filteredQuery.getCount()

            // Apply pagination
            filteredQuery.skip((page - 1) * limit).take(limit)

            const authors = await filteredQuery.getMany()

            return {
                authors,
                totalCount,
                totalCountAll,
                page,
                limit,
            }
        } catch (error) {
            throw new AppError(
                "Failed to fetch user authors",
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
                where: { id: data.id, user },
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

            const author = await Author.findOneBy({
                id,
                user
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
