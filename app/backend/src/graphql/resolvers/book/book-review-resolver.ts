/**
 * @packageDocumentation
 * @category Resolvers
 * @description
 * This module provides GraphQL resolvers for book review operations.
 * It handles review creation, retrieval, update, and deletion.
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
} from "type-graphql";
import { AppError } from "../../../middlewares/error-handler";
import {
    BookReviewSortBy,
    Context,
    Roles,
    UserActionType,
} from "../../../types/types";
import { Book } from "../../../database/entities/book/book";
import { grantXpService } from "../../../services/grind/grant-xp-service";
import { isOwnerOrAdmin } from "../../../utils/authorizations";
import { BookReview } from "../../../database/entities/book/bookReview";
import { BookReviewsResult } from "../../../database/filteredResults/books/book-reviews-result";
import { CreateBookReviewInput } from "../../inputs/create/book/create-book-review-input";
import { UpdateBookReviewInput } from "../../inputs/update/book/update-book-review-input";

/**
 * BookReview Resolver
 * @description
 * Handles all book review-related GraphQL mutations and queries.
 *
 * Reviews are comprehensive user assessments of books, consisting of a
 * numerical rating and optional text critique. Each user can write only
 * one review per book.
 */
@Resolver(BookReview)
export class BookReviewsResolver {
    /**
     * Query to get a specific review by its ID.
     *
     * @description
     * Retrieves a single review with all its relationships loaded.
     *
     * @param id - The ID of the review to fetch.
     *
     * @returns A BookReview object if found, null otherwise.
     *
     * @example
     * ```graphql
     * query {
     *   bookReview(id: 1) {
     *     rating
     *     reviewText
     *     user { name }
     *     book { title }
     *   }
     * }
     * ```
     *
     * @throws AppError - If the review is not found or query fails.
     */
    @Query(() => BookReview, { nullable: true })
    async bookReview(
        @Arg("id", () => ID) id: string,
    ): Promise<BookReview | null> {
        try {
            const review = await BookReview.findOne({
                where: { id },
                relations: {
                    user: true,
                    book: true,
                },
            });

            if (!review) {
                throw new AppError("Review not found", 404, "NotFoundError");
            }

            return review;
        } catch (error) {
            throw new AppError(
                "Failed to fetch review",
                500,
                "InternalServerError",
            );
        }
    }

    /**
     * Query to get all reviews for a specific book.
     *
     * @description
     * Retrieves all reviews for a given book with pagination and sorting support.
     * By default, sorts by most recent reviews first.
     *
     * @param bookId - The ID of the book to fetch reviews for.
     * @param page - Page number for pagination (default: 1).
     * @param limit - Number of reviews per page (default: 10).
     * @param sortBy - Sort order: "recent" (newest first), "oldest", "rating_high", "rating_low", "helpful" (default: "recent").
     *
     * @returns An object containing reviews and pagination metadata.
     *
     * @example
     * ```graphql
     * query {
     *   bookReviews(bookId: 1, page: 1, limit: 10, sortBy: "helpful") {
     *     reviews {
     *       rating
     *       reviewText
     *       user { name }
     *       helpfulCount
     *     }
     *     totalCount
     *     page
     *     limit
     *   }
     * }
     * ```
     *
     * @throws AppError - If the book is not found or query fails.
     */
    @Query(() => BookReviewsResult)
    async bookReviews(
        @Arg("bookId", () => ID) bookId: string,
        @Arg("page", () => Int, { defaultValue: 1 }) page: number,
        @Arg("limit", () => Int, { defaultValue: 10 }) limit: number,
        @Arg("sortBy", () => BookReviewSortBy, {
            defaultValue: BookReviewSortBy.RECENT,
        })
        sortBy: BookReviewSortBy,
    ): Promise<BookReviewsResult> {
        try {
            // Verify book exists
            const book = await Book.findOne({ where: { id: bookId } });
            if (!book) {
                throw new AppError("Book not found", 404, "NotFoundError");
            }

            const totalCount = await BookReview.count({
                where: { book: { id: bookId } },
            });

            let reviews: BookReview[];

            if (sortBy === BookReviewSortBy.HELPFUL) {
                const rawIds = await BookReview.createQueryBuilder("review")
                    .select("review.id", "id")
                    .addSelect(
                        `(SELECT COUNT(*) FROM "book_review_vote" "bv" WHERE "bv"."reviewId" = "review"."id" AND "bv"."isHelpful" = true)`,
                        "helpfulCount",
                    )
                    .where("review.bookId = :bookId", { bookId })
                    .orderBy('"helpfulCount"', "DESC")
                    .addOrderBy("review.createdAt", "DESC")
                    .limit(limit)
                    .offset((page - 1) * limit)
                    .getRawMany();

                const ids: string[] = rawIds.map((r: any) => String(r.id));

                // Step 2 - fetch full entities for those IDs (no skip/take = no DISTINCT pagination).
                if (ids.length === 0) {
                    reviews = [];
                } else {
                    const reviewsData = await BookReview.createQueryBuilder(
                        "review",
                    )
                        .leftJoinAndSelect("review.user", "user")
                        .leftJoinAndSelect("review.votes", "votes")
                        .whereInIds(ids)
                        .getMany();

                    // Restore the sorted order from step 1.
                    reviews = ids
                        .map((id) => reviewsData.find((r) => r.id === id)!)
                        .filter(Boolean);
                }
            } else {
                const query = BookReview.createQueryBuilder("review")
                    .leftJoinAndSelect("review.user", "user")
                    .leftJoinAndSelect("review.votes", "votes")
                    .where("review.bookId = :bookId", { bookId });

                switch (sortBy) {
                    case BookReviewSortBy.OLDEST:
                        query.orderBy("review.createdAt", "ASC");
                        break;
                    case BookReviewSortBy.RATING_HIGH:
                        query.orderBy("review.rating", "DESC");
                        break;
                    case BookReviewSortBy.RATING_LOW:
                        query.orderBy("review.rating", "ASC");
                        break;
                    case BookReviewSortBy.RECENT:
                    default:
                        query.orderBy("review.createdAt", "DESC");
                        break;
                }

                query.skip((page - 1) * limit).take(limit);
                reviews = await query.getMany();
            }

            return { reviews, totalCount, page, limit };
        } catch (error) {
            if (error instanceof AppError) throw error;
            throw new AppError(
                "Failed to fetch reviews",
                500,
                "InternalServerError",
            );
        }
    }

    /**
     * Query to get the current user's review for a specific book.
     *
     * @description
     * Returns the authenticated user's review for a given book, if it exists.
     * Useful for checking if the user has already reviewed a book and
     * for pre-filling edit forms.
     *
     * @param bookId - The ID of the book.
     * @param context - GraphQL context containing the authenticated user.
     *
     * @returns The user's BookReview if found, null otherwise.
     *
     * @example
     * ```graphql
     * query {
     *   myBookReview(bookId: 1) {
     *     id
     *     rating
     *     reviewText
     *   }
     * }
     * ```
     *
     * @throws AppError - If user is not authenticated or query fails.
     */
    @Authorized(Roles.User, Roles.Admin)
    @Query(() => BookReview, { nullable: true })
    async myBookReview(
        @Arg("bookId", () => ID) bookId: string,
        @Ctx() context: Context,
    ): Promise<BookReview | null> {
        try {
            const user = context.user;

            if (!user) {
                throw new AppError("User not found", 404, "NotFoundError");
            }

            const review = await BookReview.findOne({
                where: {
                    user: { id: user.id },
                    book: { id: bookId },
                },
                relations: {
                    user: true,
                    book: true,
                },
            });

            return review;
        } catch (error) {
            throw new AppError(
                "Failed to fetch review",
                500,
                "InternalServerError",
            );
        }
    }

    /**
     * Mutation to create a new book review.
     *
     * @description
     * Creates a new review for a book. Each user can only write one review per book.
     * Awards XP to the user, with bonus XP for detailed reviews (>200 characters).
     *
     * @param data - The input data containing book ID, rating, and optional review text.
     * @param context - GraphQL context containing the authenticated user.
     *
     * @returns The newly created BookReview object.
     *
     * @example
     * ```graphql
     * mutation {
     *   createBookReview(data: {
     *     bookId: 1
     *     rating: 5
     *     reviewText: "A masterpiece of modern literature..."
     *   }) {
     *     id
     *     rating
     *     reviewText
     *     user { name }
     *   }
     * }
     * ```
     *
     * @throws AppError - If user not found, book not found, review already exists, or creation fails.
     */
    @Authorized(Roles.User, Roles.Admin)
    @Mutation(() => BookReview)
    async createBookReview(
        @Arg("data", () => CreateBookReviewInput) data: CreateBookReviewInput,
        @Ctx() context: Context,
    ): Promise<BookReview> {
        try {
            const user = context.user;

            if (!user) {
                throw new AppError("User not found", 404, "NotFoundError");
            }

            // Check if book exists
            const book = await Book.findOne({
                where: { id: data.bookId },
            });

            if (!book) {
                throw new AppError("Book not found", 404, "NotFoundError");
            }

            // Check if user has already reviewed this book
            const existingReview = await BookReview.findOne({
                where: {
                    user: { id: user.id },
                    book: { id: book.id },
                },
            });

            if (existingReview) {
                throw new AppError(
                    "You have already reviewed this book. Use updateBookReview to modify your review.",
                    409,
                    "ConflictError",
                );
            }

            // Create new review
            const newReview = new BookReview();
            newReview.rating = data.rating;
            newReview.reviewText = data.reviewText;
            newReview.user = user;
            newReview.book = book;

            await newReview.save();

            // Grant XP for writing a review
            await grantXpService(user, UserActionType.REVIEW_CREATED, {
                targetId: newReview.id,
                metadata: {
                    bookTitle: book.title,
                    rating: data.rating,
                },
            });

            // Bonus XP for detailed reviews (>200 characters)
            if (data.reviewText && data.reviewText.length > 200) {
                await grantXpService(
                    user,
                    UserActionType.DETAILED_REVIEW_BONUS,
                    {
                        targetId: newReview.id,
                        metadata: {
                            bookTitle: book.title,
                            textLength: data.reviewText.length,
                        },
                    },
                );
            }

            return newReview;
        } catch (error) {
            if (error instanceof AppError) {
                throw error;
            }
            throw new AppError(
                "Failed to create review",
                500,
                "InternalServerError",
            );
        }
    }

    /**
     * Mutation to update an existing book review.
     *
     * @description
     * Updates a review's rating and/or text. Only the review's author can update it.
     * Partial updates are supported (can update just rating or just text).
     *
     * @param data - The input data containing review ID and fields to update.
     * @param context - GraphQL context containing the authenticated user.
     *
     * @returns The updated BookReview object.
     *
     * @example
     * ```graphql
     * mutation {
     *   updateBookReview(data: {
     *     id: 1
     *     rating: 4
     *     reviewText: "Revised my opinion after re-reading..."
     *   }) {
     *     id
     *     rating
     *     reviewText
     *     updatedAt
     *   }
     * }
     * ```
     *
     * @throws AppError - If review not found, user unauthorized, or update fails.
     */
    @Authorized(Roles.User, Roles.Admin)
    @Mutation(() => BookReview)
    async updateBookReview(
        @Arg("data", () => UpdateBookReviewInput) data: UpdateBookReviewInput,
        @Ctx() context: Context,
    ): Promise<BookReview> {
        try {
            const user = context.user;

            if (!user) {
                throw new AppError("User not found", 404, "NotFoundError");
            }

            const review = await BookReview.findOne({
                where: { id: data.id },
                relations: {
                    user: true,
                    book: true,
                },
            });

            if (!review) {
                throw new AppError("Review not found", 404, "NotFoundError");
            }

            // Check authorization
            if (!isOwnerOrAdmin(review.user.id, user)) {
                throw new AppError(
                    "Not authorized to update this review",
                    403,
                    "ForbiddenError",
                );
            }

            // Update fields if provided
            if (data.rating !== undefined) {
                review.rating = data.rating;
            }

            if (data.reviewText !== undefined) {
                review.reviewText = data.reviewText;
            }

            await review.save();

            return review;
        } catch (error) {
            if (error instanceof AppError) {
                throw error;
            }
            throw new AppError(
                "Failed to update review",
                500,
                "InternalServerError",
            );
        }
    }

    /**
     * Mutation to delete a book review.
     *
     * @description
     * Permanently deletes a review. Only the review's author or an admin can delete it.
     *
     * @param id - The ID of the review to delete.
     * @param context - GraphQL context containing the authenticated user.
     *
     * @returns The deleted BookReview object (with ID preserved).
     *
     * @example
     * ```graphql
     * mutation {
     *   deleteBookReview(id: 1) {
     *     id
     *     book { title }
     *   }
     * }
     * ```
     *
     * @throws AppError - If review not found, user unauthorized, or deletion fails.
     */
    @Authorized(Roles.User, Roles.Admin)
    @Mutation(() => BookReview)
    async deleteBookReview(
        @Arg("id", () => ID) id: string,
        @Ctx() context: Context,
    ): Promise<BookReview> {
        try {
            const user = context.user;

            if (!user) {
                throw new AppError("User not found", 404, "NotFoundError");
            }

            const review = await BookReview.findOne({
                where: { id },
                relations: {
                    user: true,
                    book: true,
                },
            });

            if (!review) {
                throw new AppError("Review not found", 404, "NotFoundError");
            }

            // Check authorization
            if (!isOwnerOrAdmin(review.user.id, user)) {
                throw new AppError(
                    "Not authorized to delete this review",
                    403,
                    "ForbiddenError",
                );
            }

            const reviewId = review.id;
            await review.remove();
            review.id = reviewId;

            return review;
        } catch (error) {
            if (error instanceof AppError) {
                throw error;
            }
            throw new AppError(
                "Failed to delete review",
                500,
                "InternalServerError",
            );
        }
    }

    /* ========================================================================
     * FIELD RESOLVERS - Computed fields for BookReview entity
     * ======================================================================== */

    /**
     * Field Resolver: Count of helpful votes
     *
     * @description
     * Counts how many users found this review helpful.
     *
     * @param review - The parent BookReview object.
     *
     * @returns Number of "helpful" votes.
     *
     * @example
     * ```graphql
     * query {
     *   bookReview(id: 1) {
     *     reviewText
     *     helpfulCount
     *   }
     * }
     * ```
     */
    @FieldResolver(() => Int)
    helpfulCount(@Root() review: BookReview): number {
        return review.votes?.filter((vote) => vote.isHelpful).length ?? 0;
    }

    /**
     * Field Resolver: Count of not helpful votes
     *
     * @description
     * Counts how many users found this review not helpful.
     *
     * @param review - The parent BookReview object.
     *
     * @returns Number of "not helpful" votes.
     *
     * @example
     * ```graphql
     * query {
     *   bookReview(id: 1) {
     *     reviewText
     *     notHelpfulCount
     *   }
     * }
     * ```
     */
    @FieldResolver(() => Int)
    notHelpfulCount(@Root() review: BookReview): number {
        return review.votes?.filter((vote) => !vote.isHelpful).length ?? 0;
    }
}
