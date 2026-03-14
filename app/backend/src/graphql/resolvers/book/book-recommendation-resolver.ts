/**
 * @packageDocumentation
 * @category Resolvers
 * @description
 * This module provides GraphQL resolvers for book recommendation operations.
 * It handles creating and removing recommendations in a toggle fashion.
 */

import {
    Arg,
    Authorized,
    Ctx,
    ID,
    Mutation,
    Query,
    Resolver,
} from "type-graphql";
import { AppError } from "../../../middlewares/error-handler";
import { Context, Roles, UserActionType } from "../../../types/types";
import { Book } from "../../../database/entities/book/book";
import { grantXpService } from "../../../services/grind/grant-xp-service";
import { BookRecommendation } from "../../../database/entities/book/bookRecommendation";
import { CreateBookRecommendationInput } from "../../inputs/create/book/create-book-recommendation-input";
import { BookRecommendationToggleResult } from "../../../database/filteredResults/books/book-recommendation-result";

/**
 * BookRecommendation Resolver
 * @description
 * Handles all book recommendation-related GraphQL mutations and queries.
 * 
 * Recommendations are lightweight endorsements that users can toggle on/off.
 * Unlike reviews, they contain no text or rating - just a simple "I recommend this book".
 */
@Resolver(BookRecommendation)
export class BookRecommendationsResolver {
    /**
     * Query to check if the current user has recommended a specific book.
     * 
     * @description
     * Returns the recommendation object if it exists, or null if the user
     * hasn't recommended this book yet.
     * 
     * @param bookId - The ID of the book to check.
     * @param context - GraphQL context containing the authenticated user.
     * 
     * @returns The BookRecommendation object if found, null otherwise.
     * 
     * @example
     * ```graphql
     * query {
     *   bookRecommendation(bookId: 1) {
     *     id
     *     createdAt
     *   }
     * }
     * ```
     * 
     * @throws AppError - If user is not authenticated or query fails.
     */
    @Authorized(Roles.User, Roles.Admin)
    @Query(() => BookRecommendation, { nullable: true })
    async bookRecommendation(
        @Arg("bookId", () => ID) bookId: number,
        @Ctx() context: Context
    ): Promise<BookRecommendation | null> {
        try {
            const user = context.user;

            if (!user) {
                throw new AppError("User not found", 404, "NotFoundError");
            }

            const recommendation = await BookRecommendation.findOne({
                where: {
                    user: { id: user.id },
                    book: { id: bookId },
                },
                relations: {
                    user: true,
                    book: true,
                },
            });

            return recommendation;
        } catch (error) {
            if (error instanceof AppError) throw error;
            throw new AppError(
                "Failed to fetch recommendation",
                500,
                "InternalServerError"
            );
        }
    }

    /**
     * Mutation to toggle a book recommendation.
     * 
     * @description
     * This is the primary way to manage recommendations. It works as a toggle:
     * - If the user hasn't recommended the book → creates a new recommendation
     * - If the user has already recommended it → removes the recommendation
     * 
     * This approach is more user-friendly than separate create/delete mutations
     * as it simplifies the frontend logic (one button that toggles state).
     * 
     * @param data - Input containing the book ID to recommend.
     * @param context - GraphQL context containing the authenticated user.
     * 
     * @returns An object with:
     * - `recommendation`: The BookRecommendation object (null if removed)
     * - `action`: "created" or "removed" to indicate what happened
     * 
     * @example
     * ```graphql
     * mutation {
     *   toggleBookRecommendation(data: { bookId: 1 }) {
     *     recommendation {
     *       id
     *       book { title }
     *     }
     *     action
     *   }
     * }
     * ```
     * 
     * @throws AppError - If user is not found, book doesn't exist, or operation fails.
     */
    @Authorized(Roles.User, Roles.Admin)
    @Mutation(() => BookRecommendationToggleResult)
    async toggleBookRecommendation(
        @Arg("data", () => CreateBookRecommendationInput)
        data: CreateBookRecommendationInput,
        @Ctx() context: Context
    ): Promise<BookRecommendationToggleResult> {
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

            // Check if recommendation already exists
            const existingRecommendation = await BookRecommendation.findOne({
                where: {
                    user: { id: user.id },
                    book: { id: book.id },
                },
                relations: {
                    user: true,
                    book: true,
                },
            });

            // If exists, remove it
            if (existingRecommendation) {
                await existingRecommendation.remove();

                return {
                    recommendation: null,
                    action: "removed",
                };
            }

            // Otherwise, create new recommendation
            const newRecommendation = new BookRecommendation();
            newRecommendation.user = user;
            newRecommendation.book = book;

            await newRecommendation.save();

            // Grant XP for recommending a book
            await grantXpService(user, UserActionType.BOOK_RECOMMENDED, {
                targetId: book.id.toString(),
                metadata: { title: book.title },
            });

            return {
                recommendation: newRecommendation,
                action: "created",
            };
        } catch (error) {
            if (error instanceof AppError) throw error;
            throw new AppError(
                "Failed to toggle recommendation",
                500,
                "InternalServerError"
            );
        }
    }

    /**
     * Mutation to delete a book recommendation (alternative to toggle).
     * 
     * @description
     * Explicit delete operation for removing a recommendation.
     * Can be useful if you prefer separate create/delete mutations
     * instead of the toggle approach.
     * 
     * @param bookId - The ID of the book to remove the recommendation from.
     * @param context - GraphQL context containing the authenticated user.
     * 
     * @returns The deleted BookRecommendation object with its ID.
     * 
     * @example
     * ```graphql
     * mutation {
     *   deleteBookRecommendation(bookId: 1) {
     *     id
     *     book { title }
     *   }
     * }
     * ```
     * 
     * @throws AppError - If recommendation not found or deletion fails.
     */
    @Authorized(Roles.User, Roles.Admin)
    @Mutation(() => BookRecommendation, { nullable: true })
    async deleteBookRecommendation(
        @Arg("bookId", () => ID) bookId: number,
        @Ctx() context: Context
    ): Promise<BookRecommendation | null> {
        try {
            const user = context.user;

            if (!user) {
                throw new AppError("User not found", 404, "NotFoundError");
            }

            const recommendation = await BookRecommendation.findOne({
                where: {
                    user: { id: user.id },
                    book: { id: bookId },
                },
                relations: {
                    user: true,
                    book: true,
                },
            });

            if (!recommendation) {
                throw new AppError(
                    "Recommendation not found",
                    404,
                    "NotFoundError"
                );
            }

            const recommendationId = recommendation.id;
            await recommendation.remove();
            recommendation.id = recommendationId;

            return recommendation;
        } catch (error) {
            if (error instanceof AppError) throw error;
            throw new AppError(
                "Failed to delete recommendation",
                500,
                "InternalServerError"
            );
        }
    }
}