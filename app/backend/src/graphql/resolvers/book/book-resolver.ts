/**
 * @packageDocumentation
 * @category Resolvers
 * @description
 * This module provides GraphQL resolvers for book-related operations.
 * It handles book creation, retrieval, update, and deletion.
 */

import {
    Arg,
    Authorized,
    Ctx,
    FieldResolver,
    Float,
    ID,
    Int,
    Mutation,
    Query,
    Resolver,
    Root,
} from "type-graphql"
import { AppError } from "../../../middlewares/error-handler"
import { Context, Roles, UserActionType } from "../../../types/types"
import { Book } from "../../../database/entities/book/book"
import { CreateBookInput } from "../../inputs/create/book/create-book-input"
import { Category } from "../../../database/entities/category/category"
import { UpdateBookInput } from "../../inputs/update/book/update-book-input"
import { BooksResult } from "../../../database/filteredResults/books/books-result"
import { BooksQueryInput } from "../../queries/books/books-query-input"
import { Brackets } from "typeorm"
import { isOwnerOrAdmin } from "../../../utils/authorizations"
import { grantXpService } from "../../../services/grind/grant-xp-service"
import { getOrCreateAuthorByFullName } from "../../../utils/author-factory"
import { BookReview } from "../../../database/entities/book/bookReview"
import { BookRecommendation } from "../../../database/entities/book/bookRecommendation"

/**
 * Book Resolver
 * @description
 * Handles all book-related GraphQL mutations and queries.
 */

@Resolver(Book)
export class BooksResolver {
    /**
     * GraphQL Query to fetch all books.
     *
     * This query supports:
     * - search by title,
     * - filtering by category,
     * - sorting (by title, publication date, or page count),
     * - pagination,
     * - as well as counting total books before and after filters are applied.
     *
     * @param filters - Search filters and options for sorting/pagination.
     *
     * @returns An object containing:
     * - `allBooks`: Paginated list of books after applying filters.
     * - `totalCount`: Total number of books matching the filters.
     * - `totalCountAll`: Total number of books without filters.
     * - `page` and `limit`: Pagination metadata.
     *
     * @throws AppError - If no books are found or in case of a server error.
     */
    @Query(() => BooksResult)
    async books(
        @Arg("filters", () => BooksQueryInput, { nullable: true })
        filters: BooksQueryInput
    ): Promise<BooksResult> {
        try {
            const {
                search,
                categoryIds,
                format,
                language,
                page = 1,
                limit = 12,
            } = filters || {}

            // Retrieve the base query with all books created
            const baseQuery = Book.createQueryBuilder("book")
                .leftJoinAndSelect("book.user", "user")
                .leftJoinAndSelect("book.category", "category")
                .leftJoinAndSelect("book.author", "author")

            // Get the total number of unfiltered books and clone the query to apply filters
            const [totalCountAll, filteredQuery] = await Promise.all([
                baseQuery.getCount(),
                baseQuery.clone(),
            ])

            // Filter by title, isnb13, authors and publisher (search)
            if (search?.trim()) {
                const trimmedSearch = `%${search.trim()}%`;

                filteredQuery.andWhere(new Brackets((qb) => {
                    qb.where("unaccent(book.title) ILIKE unaccent(:search)", { search: trimmedSearch })
                        .orWhere("book.isbn13 ILIKE :search", { search: trimmedSearch }) 
                        .orWhere("unaccent(author.firstname) ILIKE unaccent(:search)", { search: trimmedSearch })
                        .orWhere("unaccent(author.lastname) ILIKE unaccent(:search)", { search: trimmedSearch })
                        .orWhere("unaccent(book.publisher) ILIKE unaccent(:search)", { search: trimmedSearch });
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
            if (language?.trim()) {
                filteredQuery.andWhere("unaccent(book.language) ILIKE unaccent(:language)", {
                    language: `%${language.trim()}%`,
                });
            }

            // Get the total number of books matching the filters (for pagination)
            const totalCount = await filteredQuery.getCount()

            // Apply pagination
            filteredQuery.skip((page - 1) * limit).take(limit)

            const allBooks = await filteredQuery.getMany()

            if (!allBooks) {
                throw new AppError("Books not found", 404, "NotFoundError")
            }

            return {
                allBooks,
                totalCount,
                totalCountAll,
                page,
                limit,
            }
        } catch (error) {
            if (error instanceof AppError) throw error;
            throw new AppError(
                "Failed to fetch books",
                500,
                "InternalServerError"
            )
        }
    }

    /**
     * Query to get a specific book by its ID.
     *
     * @param id - The ID of the book to fetch.
     *
     * @returns A Book object if found, or null if not.
     *
     * This query retrieves a specific book along with its user and category.
     *
     * @throws AppError - If the book is not found or if a server error occurs.
     */
    @Query(() => Book, { nullable: true })
    async book(@Arg("id", () => ID) id: number): Promise<Book | null> {
        try {
            const book = await Book.findOne({
                where: { id },
                relations: {
                    user: true,
                    category: true,
                    author: {
                        books: {
                            category: true
                        }
                    }
                },
            })

            if (!book) {
                throw new AppError("Book not found", 404, "NotFoundError")
            }

            return book
        } catch (error) {
            if (error instanceof AppError) throw error;
            throw new AppError(
                "Failed to fetch book",
                500,
                "InternalServerError"
            )
        }
    }

    /**
     * Mutation to create a new book.
     *
     * @param data - The input data containing all required book fields.
     * @param context - The context object that contains the currently authenticated user.
     *
     * @returns The newly created Book object.
     *
     * Only users with the role `User` or `Admin` can create a book.
     * The book is automatically linked to the authenticated user.
     *
     * @throws AppError - If the category is not found or on save failure.
     */
    @Authorized(Roles.User, Roles.Admin)
    @Mutation(() => Book)
    async createBook(
        @Arg("data", () => CreateBookInput) data: CreateBookInput,
        @Ctx() context: Context
    ): Promise<Book> {
        try {
            const user = context.user

            if (!user) {
                throw new AppError("User not found", 404, "NotFoundError")
            }

            const category = await Category.findOne({
                where: { id: data.category },
            })

            if (!category) {
                throw new AppError("Category not found", 404, "NotFoundError")
            }

            const authorEntity = await getOrCreateAuthorByFullName(data.author, user);

            const newBook = new Book()

            Object.assign(newBook, data, {
                user,
                category,
                author: authorEntity,
            });

            await newBook.save()

            await grantXpService(user, UserActionType.BOOK_ADDED, {
                targetId: newBook.id.toString(),
                metadata: { title: newBook.title }
            });

            return newBook
        } catch (error) {
            if (error instanceof AppError) throw error;
            throw new AppError(
                "Failed to create book",
                500,
                "InternalServerError"
            )
        }
    }

    /**
     * Mutation to update an existing book.
     *
     * @param data - The input data with the fields to update (partial update supported).
     * @param context - GraphQL context containing the authenticated user.
     *
     * @returns The updated Book object, or null if not found or not permitted.
     *
     * Only the admin or the original user who created the book can update it.
     * Validates existence of the book and new category if changed.
     *
     * @throws AppError - If the book is not found, user is unauthorized, or update fails.
     */
    @Authorized(Roles.User, Roles.Admin)
    @Mutation(() => Book, { nullable: true })
    async updateBook(
        @Arg("data", () => UpdateBookInput) data: UpdateBookInput,
        @Ctx() context: Context
    ): Promise<Book | null> {
        try {
            const user = context.user

            if (!user) {
                throw new AppError("User not found", 404, "NotFoundError")
            }

            const book = await Book.findOne({
                where: {
                    id: data.id,
                    user: { id: user.id }
                },
                relations: {
                    user: true,
                    category: true,
                    author: true
                },
            })

            if (!book) {
                throw new AppError(
                    "Book not found",
                    404,
                    "BookNotFoundError"
                )
            }

            if (!isOwnerOrAdmin(book.user.id, user)) {
                throw new AppError(
                    "Not authorized to delete this book",
                    403,
                    "ForbiddenError"
                )
            }

            const { id, category, author, ...updateData } = data

            if (category) {
                const categoryBook = await Category.findOne({
                    where: { id: category },
                })
                if (!categoryBook) {
                    throw new AppError(
                        "Category not found",
                        404,
                        "NotFoundError"
                    )
                }
                book.category = categoryBook
            }

            if (author) {
                const authorEntity = await getOrCreateAuthorByFullName(author, user);
                book.author = authorEntity;
            }

            Object.assign(book, updateData);

            await book.save();

            return book;
        } catch (error) {
            if (error instanceof AppError) throw error;
            throw new AppError(
                "Failed to update book",
                500,
                "InternalServerError"
            )
        }
    }

    /**
     * Mutation to delete an existing book.
     *
     * @param id - The ID of the book to delete.
     * @param context - GraphQL context containing the authenticated user.
     *
     * @returns The deleted Book object (with ID), or null if not found.
     *
     * Only the admin or the book's owner can perform this action.
     *
     * @throws AppError - If the book is not found, user is unauthorized, or deletion fails.
     */
    @Authorized(Roles.User, Roles.Admin)
    @Mutation(() => Book, { nullable: true })
    async deleteBook(
        @Arg("id", () => ID) id: number,
        @Ctx() context: Context
    ): Promise<Book | null> {
        try {
            const user = context.user

            if (!user) {
                throw new AppError("User not found", 404, "NotFoundError")
            }

            const book = await Book.findOne({
                where: {
                    id,
                    user: { id: user.id },
                },
                relations: {
                    user: true
                },
            })

            if (!book) {
                throw new AppError(
                    "Book not found",
                    404,
                    "BookNotFoundError"
                )
            }

            if (!isOwnerOrAdmin(book.user.id, user)) {
                throw new AppError(
                    "Not authorized to delete this book",
                    403,
                    "ForbiddenError"
                )
            }

            await book.remove()
            book.id = id

            return book
        } catch (error) {
            if (error instanceof AppError) throw error;
            throw new AppError(
                "Failed to delete book",
                500,
                "InternalServerError"
            )
        }
    }

    /* ========================================================================
     * FIELD RESOLVERS - Computed fields for Book entity
     * ======================================================================== */

    /**
     * Field Resolver: Average rating for a book
     * 
     * @description
     * Calculates the average rating across all reviews for this book.
     * Uses SQL AVG function for optimal performance.
     * 
     * @param book - The parent Book object from the query.
     * 
     * @returns The average rating as a float (e.g., 4.2), or null if no reviews exist.
     * 
     * @example
     * ```graphql
     * query {
     *   book(id: 1) {
     *     title
     *     averageRating  # Returns: 4.2
     *   }
     * }
     * ```
     */
    @FieldResolver(() => Float, { nullable: true })
    async averageRating(@Root() book: Book): Promise<number | null> {
        try {
            const result = await BookReview
                .createQueryBuilder("review")
                .select("AVG(review.rating)", "avg")
                .where("review.bookId = :bookId", { bookId: book.id })
                .getRawOne();

            return result?.avg ? parseFloat(Number(result.avg).toFixed(2)) : null;
        } catch (error) {
            console.error("Error calculating average rating:", error);
            return null;
        }
    }

    /**
     * Field Resolver: Total number of reviews for a book
     * 
     * @description
     * Counts the total number of reviews written for this book.
     * 
     * @param book - The parent Book object from the query.
     * 
     * @returns The count of reviews as an integer.
     * 
     * @example
     * ```graphql
     * query {
     *   book(id: 1) {
     *     title
     *     reviewCount  # Returns: 42
     *   }
     * }
     * ```
     */
    @FieldResolver(() => Int)
    async reviewCount(@Root() book: Book): Promise<number> {
        try {
            return await BookReview.count({
                where: { book: { id: book.id } }
            });
        } catch (error) {
            console.error("Error counting reviews:", error);
            return 0;
        }
    }

    /**
     * Field Resolver: Total number of recommendations for a book
     * 
     * @description
     * Counts how many users have recommended this book.
     * 
     * @param book - The parent Book object from the query.
     * 
     * @returns The count of recommendations as an integer.
     * 
     * @example
     * ```graphql
     * query {
     *   book(id: 1) {
     *     title
     *     recommendationCount  # Returns: 327
     *   }
     * }
     * ```
     */
    @FieldResolver(() => Int)
    async recommendationCount(@Root() book: Book): Promise<number> {
        try {
            return await BookRecommendation.count({
                where: { book: { id: book.id } }
            });
        } catch (error) {
            console.error("Error counting recommendations:", error);
            return 0;
        }
    }

    /**
     * Field Resolver: Check if the current user has reviewed this book
     * 
     * @description
     * Returns true if the authenticated user has already written a review
     * for this book, false otherwise. Returns false for unauthenticated users.
     * 
     * @param book - The parent Book object from the query.
     * @param context - GraphQL context containing the authenticated user.
     * 
     * @returns Boolean indicating if the user has reviewed the book.
     * 
     * @example
     * ```graphql
     * query {
     *   book(id: 1) {
     *     title
     *     hasUserReviewed  # Returns: true or false
     *   }
     * }
     * ```
     */
    @FieldResolver(() => Boolean)
    async hasUserReviewed(
        @Root() book: Book,
        @Ctx() context: Context
    ): Promise<boolean> {
        try {
            const user = context.user;
            
            if (!user) {
                return false;
            }

            const review = await BookReview.findOne({
                where: {
                    book: { id: book.id },
                    user: { id: user.id }
                }
            });

            return !!review;
        } catch (error) {
            console.error("Error checking user review:", error);
            return false;
        }
    }

    /**
     * Field Resolver: Check if the current user has recommended this book
     * 
     * @description
     * Returns true if the authenticated user has recommended this book,
     * false otherwise. Returns false for unauthenticated users.
     * 
     * @param book - The parent Book object from the query.
     * @param context - GraphQL context containing the authenticated user.
     * 
     * @returns Boolean indicating if the user has recommended the book.
     * 
     * @example
     * ```graphql
     * query {
     *   book(id: 1) {
     *     title
     *     hasUserRecommended  # Returns: true or false
     *   }
     * }
     * ```
     */
    @FieldResolver(() => Boolean)
    async hasUserRecommended(
        @Root() book: Book,
        @Ctx() context: Context
    ): Promise<boolean> {
        try {
            const user = context.user;
            
            if (!user) {
                return false;
            }

            const recommendation = await BookRecommendation.findOne({
                where: {
                    book: { id: book.id },
                    user: { id: user.id }
                }
            });

            return !!recommendation;
        } catch (error) {
            console.error("Error checking user recommendation:", error);
            return false;
        }
    }

    /**
     * Field Resolver: Get top reviews sorted by helpfulness
     * 
     * @description
     * Returns the most helpful reviews for this book, sorted by the number
     * of "helpful" votes. Useful for displaying featured reviews on the book page.
     * 
     * @param book - The parent Book object from the query.
     * @param limit - Maximum number of reviews to return (default: 5).
     * 
     * @returns Array of BookReview objects, ordered by helpfulness.
     * 
     * @example
     * ```graphql
     * query {
     *   book(id: 1) {
     *     title
     *     topReviews(limit: 3) {
     *       reviewText
     *       rating
     *       user { name }
     *     }
     *   }
     * }
     * ```
     */
    @FieldResolver(() => [BookReview])
    async topReviews(
        @Root() book: Book,
        @Arg("limit", () => Int, { defaultValue: 5 }) limit: number
    ): Promise<BookReview[]> {
        try {
            const reviews = await BookReview
                .createQueryBuilder("review")
                .leftJoinAndSelect("review.user", "user")
                .leftJoinAndSelect("review.votes", "votes")
                .where("review.bookId = :bookId", { bookId: book.id })
                .addSelect(
                    `(SELECT COUNT(*) FROM "book_review_vote" "bv" WHERE "bv"."reviewId" = "review"."id" AND "bv"."isHelpful" = true)`,
                    "helpfulvotecount",
                )
                .orderBy("helpfulvotecount", "DESC")
                .addOrderBy("review.createdAt", "DESC")
                .limit(limit)
                .getMany();

            return reviews;
        } catch (error) {
            console.error("Error fetching top reviews:", error);
            return [];
        }
    }
}