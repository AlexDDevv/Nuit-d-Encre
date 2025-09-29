/**
 * @packageDocumentation
 * @category Resolvers
 * @description
 * GraphQL resolvers for operations related to `UserBook` (the link between a user
 * and a book in their personal library).  
 * 
 * This module provides:
 * - searching, filtering, sorting, and paginating user books,
 * - fetching a single user book by ID,
 * - adding a book to a user’s library,
 * - removing a book from a user’s library (with proper authorization).
 * 
 * Note: This resolver does **not** create or edit `Book` entities themselves;
 * it only manages `UserBook` entries referencing existing books.
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
import { Context, ReadingStatus, Roles, UserActionType } from "../../../types/types"
import { Book } from "../../../database/entities/book/book"
import { Brackets } from "typeorm"
import { isOwnerOrAdmin } from "../../../utils/authorizations"
import { grantXpService } from "../../../services/grind/grant-xp-service"
import { UserBooksResult } from "../../../database/filteredResults/user/user-books-result"
import { UserBooksQueryInput } from "../../queries/user/user-books-input"
import { UserBook } from "../../../database/entities/user/user-book"
import { CreateUserBookInput } from "../../inputs/create/user/create-user-book-input"

/**
 * UserBook Resolver
 * @description
 * Handles all UserBook-related GraphQL mutations and queries.
 */

@Resolver(UserBook)
export class UserBooksResolver {
    /**
    * GraphQL Query to fetch all user books.
    *
    * This query supports:
    * - search by title,
    * - filtering by category,
    * - sorting (by title, publication date, or page count),
    * - pagination,
    * - as well as counting total user books before and after filters are applied.
    *
    * @param filters - Search filters and options for sorting/pagination.
    *
    * @returns An object containing:
    * - `books`: Paginated list of user books after applying filters.
    * - `totalCount`: Total number of user books matching the filters.
    * - `totalCountAll`: Total number of user books without filters.
    * - `page` and `limit`: Pagination metadata.
    *
    * @throws AppError - If no user books are found or in case of a server error.
    */
    @Query(() => UserBooksResult)
    async userBooks(
        @Arg("filters", () => UserBooksQueryInput, { nullable: true })
        filters: UserBooksQueryInput
    ): Promise<UserBooksResult> {
        try {
            const {
                status,
                recommended,
                isPublic,
                search,
                categoryIds,
                format,
                language,
                page = 1,
                limit = 12,
            } = filters || {}

            // Retrieve the base query with all user's books created
            const baseQuery = UserBook.createQueryBuilder("userBook")
                .leftJoinAndSelect("userBook.user", "user")
                .leftJoinAndSelect("userBook.book", "book")
                .leftJoinAndSelect("book.category", "category")
                .leftJoinAndSelect("book.author", "author")

            // Get the total number of unfiltered books and clone the query to apply filters
            const [totalCountAll, filteredQuery] = await Promise.all([
                baseQuery.getCount(),
                baseQuery.clone(),
            ])

            // Filter by status
            if (status && status.length > 0) {
                filteredQuery.andWhere("userBook.status IN :status", { status });
            }

            // Filter by recommended book
            if (typeof recommended === "boolean") {
                filteredQuery.andWhere("userBook.recommended = :recommended", { recommended });
            }

            // Filter by public or private book
            if (typeof isPublic === "boolean") {
                filteredQuery.andWhere("userBook.isPublic = :isPublic", { isPublic });
            }

            // Filter by title, isnb13, authors and publisher (search)
            if (search?.trim()) {
                const trimmedSearch = `%${search.trim()}%`;

                filteredQuery.andWhere(new Brackets(qb => {
                    qb.where("book.title ILIKE :search", { search: trimmedSearch })
                        .orWhere("book.isbn13 ILIKE :search", { search: trimmedSearch })
                        .orWhere("author.firstname ILIKE :search", { search: trimmedSearch })
                        .orWhere("author.lastname ILIKE :search", { search: trimmedSearch })
                        .orWhere("book.publisher ILIKE :search", { search: trimmedSearch })
                }));
            }

            // Filter by category
            if (categoryIds && categoryIds.length > 0) {
                filteredQuery.andWhere(
                    "book.category.id IN (:...categoryIds)",
                    {
                        categoryIds,
                    }
                )
            }

            // Filter by format
            if (format && format.length > 0) {
                filteredQuery.andWhere("book.format IN (:...format)", {
                    format,
                })
            }

            // Filter by language
            if (language) {
                filteredQuery.andWhere("book.language ILIKE :language", {
                    language
                })
            }

            // Get the total number of user's books matching the filters (for pagination)
            const totalCount = await filteredQuery.getCount()

            // Apply pagination
            filteredQuery.skip((page - 1) * limit).take(limit)

            const userBooks = await filteredQuery.getMany()

            if (!userBooks) {
                throw new AppError("Books not found", 404, "NotFoundError")
            }

            return {
                userBooks,
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
     * Query to get a specific user book by its ID.
     *
     * @param id - The ID of the user book to fetch.
     *
     * @returns A UserBook object if found, or null if not.
     *
     * This query retrieves a specific user book along with its user and book data.
     *
     * @throws AppError - If the user book is not found or if a server error occurs.
     */
    @Query(() => UserBook, { nullable: true })
    async userBook(@Arg("id", () => ID) id: number): Promise<UserBook | null> {
        try {
            const userBook = await UserBook.findOne({
                where: { id },
                relations: {
                    user: true,
                    book: true
                },
            })

            if (!userBook) {
                throw new AppError("Book not found", 404, "NotFoundError")
            }

            return userBook
        } catch (error) {
            throw new AppError(
                "Failed to fetch book",
                500,
                "InternalServerError"
            )
        }
    }

    /**
     * Mutation to create a new user book.
     *
     * @param data - The input data containing all required user book fields.
     * @param context - The context object that contains the currently authenticated user.
     *
     * @returns The newly created UserBook object.
     *
     * Only users with the role `User` or `Admin` can create a user book.
     * The user book is automatically linked to the authenticated user and references an existing book.
     *
     * @throws AppError - If the book is not found, the user book already exists, or on save failure.
     */
    @Authorized(Roles.User, Roles.Admin)
    @Mutation(() => UserBook)
    async createUserBook(
        @Arg("data", () => CreateUserBookInput) data: CreateUserBookInput,
        @Ctx() context: Context
    ): Promise<UserBook> {
        try {
            const user = context.user

            if (!user) {
                throw new AppError("User not found", 404, "NotFoundError")
            }

            const { bookId, ...rest } = data;

            const book = await Book.findOne({ where: { id: data.bookId } });

            if (!book) {
                throw new AppError("Book not found", 404, "NotFoundError");
            }

            const existing = await UserBook.findOne({
                where: { user: { id: user.id }, book: { id: book.id } },
            });

            if (existing) {
                throw new AppError("Book already in user's library", 409, "ConflictError");
            }

            const newUserBook = new UserBook()

            Object.assign(newUserBook, rest, { user, book });

            await newUserBook.save();

            await grantXpService(user, UserActionType.BOOK_ADDED_TO_LIBRARY, {
                targetId: newUserBook.id.toString(),
                metadata: { title: book.title },
            });

            if (newUserBook.status === ReadingStatus.READ) {
                await grantXpService(user, UserActionType.BOOK_FINISHED, {
                    targetId: newUserBook.id.toString(),
                    metadata: { to: newUserBook.status, title: book.title },
                });
            }

            return newUserBook;
        } catch (error) {
            throw new AppError(
                "Failed to create book",
                500,
                "InternalServerError"
            )
        }
    }

    /**
    * Mutation to delete an existing user book.
    *
    * @param id - The ID of the user book to delete.
    * @param context - GraphQL context containing the authenticated user.
    *
    * @returns The deleted UserBook object (with ID), or null if not found.
    *
    * Only the admin or the user book’s owner can perform this action.
    *
    * @throws AppError - If the user book is not found, user is unauthorized, or deletion fails.
    */
    @Authorized(Roles.User, Roles.Admin)
    @Mutation(() => UserBook, { nullable: true })
    async deleteBook(
        @Arg("id", () => ID) id: number,
        @Ctx() context: Context
    ): Promise<UserBook | null> {
        try {
            const user = context.user

            if (!user) {
                throw new AppError("User not found", 404, "NotFoundError")
            }

            const userBook = await UserBook.findOne({
                where: {
                    id,
                    user: { id: user.id },
                },
                relations: {
                    user: true
                },
            })

            if (!userBook) {
                throw new AppError(
                    "Book not found",
                    404,
                    "BookNotFoundError"
                )
            }

            if (!isOwnerOrAdmin(userBook.user.id, user)) {
                throw new AppError(
                    "Not authorized to delete this book",
                    403,
                    "ForbiddenError"
                )
            }

            if (userBook !== null) {
                await userBook.remove()
                userBook.id = id
            }

            return userBook
        } catch (error) {
            throw new AppError(
                "Failed to delete book",
                500,
                "InternalServerError"
            )
        }
    }
}
