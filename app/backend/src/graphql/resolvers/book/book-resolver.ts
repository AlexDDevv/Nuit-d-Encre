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
    ID,
    Mutation,
    Query,
    Resolver,
} from "type-graphql"
import { AppError } from "../../../middlewares/error-handler"
import { Context, Roles } from "../../../types/types"
import { Book } from "../../../database/entities/book/book"
import { CreateBookInput } from "../../inputs/create/book/create-book-inpt"
import { Category } from "../../../database/entities/book/category"
import { UpdateBookInput } from "../../inputs/update/book/update-book-input"
import { AllBooksResult } from "../../../database/filteredBooks/allBooksResult"
import { AllBooksQueryInput } from "../../queries/books-query-input"
import { MyBooksResult } from "../../../database/filteredBooks/myBooksResult"
import { MyBooksQueryInput } from "../../queries/myBooks-query-input"

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
     * - sorting (by title, publication date, or page count, ASC/DESC),
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
    @Query(() => AllBooksResult)
    async surveys(
        @Arg("filters", () => AllBooksQueryInput, { nullable: true })
        filters: AllBooksQueryInput
    ): Promise<AllBooksResult> {
        try {
            const {
                search,
                categoryIds,
                sortBy = "estimatedDuration",
                order = "DESC",
                page = 1,
                limit = 12,
            } = filters || {}

            // Retrieve the base query with all surveys created
            const baseQuery = Survey.createQueryBuilder("survey")
                .leftJoinAndSelect("survey.user", "user")
                .leftJoinAndSelect("survey.category", "category")
                .leftJoinAndSelect("survey.questions", "questions")

            // Get the total number of unfiltered surveys and clone the query to apply filters
            const [totalCountAll, filteredQuery] = await Promise.all([
                baseQuery.getCount(),
                baseQuery.clone(),
            ])

            // Filter by title (search)
            if (search?.trim()) {
                filteredQuery.andWhere("survey.title ILIKE :search", {
                    search: `%${search.trim()}%`,
                })
            }

            // Filter by category
            if (categoryIds && categoryIds.length > 0) {
                filteredQuery.andWhere(
                    "survey.category.id IN (:...categoryIds)",
                    {
                        categoryIds,
                    }
                )
            }

            // Get the total number of surveys matching the filters (for pagination)
            const totalCount = await filteredQuery.getCount()

            // Sort results by selected field (sortBy) and order (ASC/DESC)
            filteredQuery.orderBy(`survey.${sortBy}`, order)

            // Apply pagination
            filteredQuery.skip((page - 1) * limit).take(limit)

            const allSurveys = await filteredQuery.getMany()

            if (!allSurveys) {
                throw new AppError("Surveys not found", 404, "NotFoundError")
            }

            return {
                allSurveys,
                totalCount,
                totalCountAll,
                page,
                limit,
            }
        } catch (error) {
            throw new AppError(
                "Failed to fetch surveys",
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
                },
            })
            if (!book) {
                throw new AppError("Book not found", 404, "NotFoundError")
            }

            return book
        } catch (error) {
            throw new AppError(
                "Failed to fetch book",
                500,
                "InternalServerError"
            )
        }
    }

    /**
     * GraphQL Query to retrieve books belonging to the currently authenticated user.
     *
     * This query supports:
     * - search by title,
     * - filtering by availability,
     * - sorting (by creation or update date, ASC/DESC),
     * - pagination,
     * - and total count before and after filters.
     *
     * ⚠️ Access restricted to roles `User` and `Admin`.
     *
     * @param filters - Search filters and options for pagination/sorting.
     * @param context - GraphQL context containing the authenticated user.
     *
     * @returns A paginated list of the user's books and related metadata.
     *
     * @throws AppError - If the user is not authenticated or in case of a server error.
     */
    @Authorized(Roles.User, Roles.Admin)
    @Query(() => MyBooksResult)
    async mySurveys(
        @Arg("filters", () => MyBooksQueryInput, { nullable: true })
        filters: MyBooksQueryInput,
        @Ctx() context: Context
    ): Promise<MyBooksResult> {
        try {
            const user = context.user

            if (!user) {
                throw new AppError(
                    "You can only retrieve your own surveys",
                    401,
                    "UnauthorizedError"
                )
            }

            const {
                search,
                status,
                sortBy = "createdAt",
                order = "DESC",
                page = 1,
                limit = 5,
            } = filters || {}

            // Retrieve the base query with all surveys created by the user
            const baseQuery = Survey.createQueryBuilder("survey").where(
                "survey.userId = :userId",
                { userId: user.id }
            )

            // Get the total number of unfiltered surveys and clone the query to apply filters
            const [totalCountAll, filteredQuery] = await Promise.all([
                baseQuery.getCount(),
                baseQuery.clone(),
            ])

            // Filter by title (search)
            if (search?.trim()) {
                filteredQuery.andWhere("survey.title ILIKE :search", {
                    search: `%${search.trim()}%`,
                })
            }

            // Filter by status
            if (status && status.length > 0) {
                filteredQuery.andWhere("survey.status IN (:...status)", {
                    status,
                })
            }

            // Get the total number of surveys matching the filters (for pagination)
            const totalCount = await filteredQuery.getCount()

            // Sort results by selected field (sortBy) and order (ASC/DESC)
            filteredQuery.orderBy(`survey.${sortBy}`, order)

            // Apply pagination
            filteredQuery.skip((page - 1) * limit).take(limit)

            const surveys = await filteredQuery.getMany()

            return {
                surveys,
                totalCount,
                totalCountAll,
                page,
                limit,
            }
        } catch (error) {
            throw new AppError(
                "Failed to fetch user surveys",
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

            const newBook = new Book()
            Object.assign(newBook, data, { user, category })

            await newBook.save()
            return newBook
        } catch (error) {
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

            const whereCreatedBy =
                user.role === "admin" ? undefined : { id: user.id }

            const book = await Book.findOne({
                where: { id: data.id, user: whereCreatedBy },
                relations: {
                    user: true,
                    category: true,
                },
            })

            if (!book) {
                throw new AppError(
                    "Book not found",
                    404,
                    "BookNotFoundError"
                )
            }

            const { id, category, ...updateData } = data

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

            Object.assign(book, updateData)

            await book.save()
            return book
        } catch (error) {
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

            // Only admins or book owner can delete books
            const whereCreatedBy =
                user.role === "admin" ? undefined : { id: user.id }

            const book = await Book.findOneBy({
                id,
                user: whereCreatedBy,
            })

            if (book !== null) {
                await book.remove()
                book.id = id
            }

            return book
        } catch (error) {
            throw new AppError(
                "Failed to delete book",
                500,
                "InternalServerError"
            )
        }
    }
}
