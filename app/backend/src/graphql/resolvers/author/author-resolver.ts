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
    FieldResolver,
    ID,
    Int,
    Mutation,
    Query,
    Resolver,
    Root,
} from "type-graphql"
import { AppError } from "../../../middlewares/error-handler"
import { Context, Roles, UserActionType } from "../../../types/types"
import { grantXpService } from "../../../services/grind/grant-xp-service"
import { Brackets } from "typeorm"
import { Author } from "../../../database/entities/author/author"
import { CreateAuthorInput } from "../../inputs/create/author/create-author-input"
import { UpdateAuthorInput } from "../../inputs/update/author/update-author-input"
import { isOwnerOrAdmin } from "../../../utils/authorizations"
import { AuthorsResult } from "../../../database/filteredResults/authors/authors-result"
import { AuthorsQueryInput } from "../../queries/authors/authors-query-input"
import { Book } from "../../../database/entities/book/book"

function isAuthorIncomplete(author: Author): boolean {
    return (
        !author.birthDate ||
        !author.nationality ||
        !author.wikipediaUrl ||
        !author.biography
    );
}

/**
 * Author Resolver
 * @description
 * Handles all author-related GraphQL mutations and queries.
 */

@Resolver(Author)
export class AuthorsResolver {
    /**
     * Field Resolver: Whether the author's record is incomplete.
     *
     * @description
     * Computed server-side so list queries can display the completion
     * badge without fetching birthDate/nationality/wikipediaUrl/biography.
     *
     * @param author - The parent Author object from the query.
     *
     * @returns `true` if at least one enrichment field is missing.
     *
     * @example
     * ```graphql
     * query {
     *   authors {
     *     allAuthors {
     *       firstname
     *       isIncomplete  # Returns: true
     *     }
     *   }
     * }
     * ```
     */
    @FieldResolver(() => Boolean)
    isIncomplete(@Root() author: Author): boolean {
        return isAuthorIncomplete(author)
    }

    /**
     * Field Resolver: Number of books associated with the author.
     *
     * @description
     * Computed server-side so list queries (e.g. the authors catalogue cards)
     * can display the book count without fetching the full books relation.
     *
     * @param author - The parent Author object from the query.
     *
     * @returns The count of books linked to this author as an integer.
     *
     * @example
     * ```graphql
     * query {
     *   authors {
     *     allAuthors {
     *       firstname
     *       bookCount  # Returns: 7
     *     }
     *   }
     * }
     * ```
     */
    @FieldResolver(() => Int)
    async bookCount(@Root() author: Author): Promise<number> {
        try {
            return await Book.count({
                where: { author: { id: author.id } }
            })
        } catch (error) {
            console.error("Error counting author books:", error)
            return 0
        }
    }

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
                    qb.where("unaccent(author.firstname) ILIKE unaccent(:search)", { search: trimmedSearch })
                        .orWhere("unaccent(author.lastname) ILIKE unaccent(:search)", { search: trimmedSearch })
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
            if (error instanceof AppError) throw error;
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
            if (error instanceof AppError) throw error;
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
            if (error instanceof AppError) throw error;
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

            const wasIncomplete = isAuthorIncomplete(author);

            const { id, ...updateData } = data

            Object.assign(author, updateData)

            await author.save()

            if (wasIncomplete && !isAuthorIncomplete(author)) {
                await grantXpService(user, UserActionType.AUTHOR_COMPLETED, {
                    targetId: author.id.toString(),
                    metadata: { firstname: author.firstname, lastname: author.lastname },
                });
            }

            return author
        } catch (error) {
            if (error instanceof AppError) throw error;
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

            if (author.books.length > 0) {
                throw new AppError(
                    "Cannot delete author with existing books",
                    400,
                    "BadRequestError"
                );
            }

            await author.remove()
            author.id = id

            return author
        } catch (error) {
            if (error instanceof AppError) throw error;
            throw new AppError(
                "Failed to delete author",
                500,
                "InternalServerError"
            )
        }
    }
}
