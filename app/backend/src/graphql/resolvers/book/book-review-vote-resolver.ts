/**
 * @packageDocumentation
 * @category Resolvers
 * @description
 * This module provides GraphQL resolvers for review vote operations.
 * It handles voting on reviews (helpful/not helpful) and vote management.
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
import { grantXpService } from "../../../services/grind/grant-xp-service";
import { BookReviewVote } from "../../../database/entities/book/bookReviewVote";
import { BookReviewVoteResult } from "../../../database/filteredResults/books/book-review-vote-result";
import { CreateBookReviewVoteInput } from "../../inputs/create/book/create-book-review-vote-input";
import { BookReview } from "../../../database/entities/book/bookReview";

/**
 * BookReviewVote Resolver
 * @description
 * Handles all review vote-related GraphQL mutations and queries.
 * 
 * Votes allow users to indicate whether they found a review helpful or not,
 * helping to surface the most valuable reviews. Each user can vote once per review,
 * but can change their vote between helpful/not helpful.
 */
@Resolver(BookReviewVote)
export class BookReviewVotesResolver {
    /**
     * Query to get the current user's vote on a specific review.
     * 
     * @description
     * Returns the authenticated user's vote on a given review, if it exists.
     * Useful for displaying the current vote state in the UI (e.g., highlighting
     * the "helpful" button if the user voted helpful).
     * 
     * @param reviewId - The ID of the review to check.
     * @param context - GraphQL context containing the authenticated user.
     * 
     * @returns The BookReviewVote object if found, null otherwise.
     * 
     * @example
     * ```graphql
     * query {
     *   myVoteOnReview(reviewId: 1) {
     *     id
     *     isHelpful
     *   }
     * }
     * ```
     * 
     * @throws AppError - If user is not authenticated or query fails.
     */
    @Authorized(Roles.User, Roles.Admin)
    @Query(() => BookReviewVote, { nullable: true })
    async myVoteOnReview(
        @Arg("reviewId", () => ID) reviewId: number,
        @Ctx() context: Context
    ): Promise<BookReviewVote | null> {
        try {
            const user = context.user;

            if (!user) {
                throw new AppError("User not found", 404, "NotFoundError");
            }

            const vote = await BookReviewVote.findOne({
                where: {
                    user: { id: user.id },
                    review: { id: reviewId },
                },
                relations: {
                    user: true,
                    review: true,
                },
            });

            return vote;
        } catch (error) {
            throw new AppError(
                "Failed to fetch vote",
                500,
                "InternalServerError"
            );
        }
    }

    /**
     * Mutation to vote on a review (upsert pattern).
     * 
     * @description
     * Allows a user to vote on a review as helpful or not helpful.
     * This mutation uses an "upsert" pattern:
     * - If the user hasn't voted yet → creates a new vote
     * - If the user has already voted → updates the existing vote
     * 
     * This simplifies frontend logic as you don't need to check if a vote
     * exists before deciding whether to create or update.
     * 
     * Users cannot vote on their own reviews (enforced by business logic).
     * 
     * Awards XP to the review author when their review receives helpful votes.
     * 
     * @param data - Input containing the review ID and vote type (helpful/not helpful).
     * @param context - GraphQL context containing the authenticated user.
     * 
     * @returns An object with:
     * - `vote`: The BookReviewVote object
     * - `action`: "created" or "updated" to indicate what happened
     * 
     * @example
     * ```graphql
     * mutation {
     *   voteOnReview(data: {
     *     reviewId: 1
     *     isHelpful: true
     *   }) {
     *     vote {
     *       id
     *       isHelpful
     *     }
     *     action
     *   }
     * }
     * ```
     * 
     * @throws AppError - If user not found, review not found, voting on own review, or operation fails.
     */
    @Authorized(Roles.User, Roles.Admin)
    @Mutation(() => BookReviewVoteResult)
    async voteOnReview(
        @Arg("data", () => CreateBookReviewVoteInput) data: CreateBookReviewVoteInput,
        @Ctx() context: Context
    ): Promise<BookReviewVoteResult> {
        try {
            const user = context.user;

            if (!user) {
                throw new AppError("User not found", 404, "NotFoundError");
            }

            // Check if review exists
            const review = await BookReview.findOne({
                where: { id: data.reviewId },
                relations: {
                    user: true,
                },
            });

            if (!review) {
                throw new AppError("Review not found", 404, "NotFoundError");
            }

            // Prevent users from voting on their own reviews
            if (review.user.id === user.id) {
                throw new AppError(
                    "You cannot vote on your own review",
                    403,
                    "ForbiddenError"
                );
            }

            // Check if user has already voted on this review
            const existingVote = await BookReviewVote.findOne({
                where: {
                    user: { id: user.id },
                    review: { id: review.id },
                },
                relations: {
                    user: true,
                    review: true,
                },
            });

            let vote: BookReviewVote;
            let action: "created" | "updated";

            // If vote exists, update it
            if (existingVote) {
                existingVote.isHelpful = data.isHelpful;
                await existingVote.save();
                vote = existingVote;
                action = "updated";
            } else {
                // Otherwise, create new vote
                const newVote = new BookReviewVote();
                newVote.isHelpful = data.isHelpful;
                newVote.user = user;
                newVote.review = review;

                await newVote.save();
                vote = newVote;
                action = "created";

                // Grant XP to the review author when their review receives a helpful vote
                if (data.isHelpful) {
                    await grantXpService(
                        review.user,
                        UserActionType.REVIEW_VOTED_HELPFUL,
                        {
                            targetId: review.id.toString(),
                            metadata: {
                                voterId: user.id,
                                voterName: user.userName || "Unknown",
                            },
                        }
                    );
                }
            }

            return {
                vote,
                action,
            };
        } catch (error) {
            if (error instanceof AppError) {
                throw error;
            }
            throw new AppError(
                "Failed to vote on review",
                500,
                "InternalServerError"
            );
        }
    }

    /**
     * Mutation to remove a vote from a review.
     * 
     * @description
     * Allows a user to remove their vote from a review entirely.
     * This is different from changing a vote - it completely removes the vote record.
     * 
     * @param reviewId - The ID of the review to remove the vote from.
     * @param context - GraphQL context containing the authenticated user.
     * 
     * @returns The deleted BookReviewVote object with its ID.
     * 
     * @example
     * ```graphql
     * mutation {
     *   removeVoteOnReview(reviewId: 1) {
     *     id
     *     review { id }
     *   }
     * }
     * ```
     * 
     * @throws AppError - If vote not found or deletion fails.
     */
    @Authorized(Roles.User, Roles.Admin)
    @Mutation(() => BookReviewVote, { nullable: true })
    async removeVoteOnReview(
        @Arg("reviewId", () => ID) reviewId: number,
        @Ctx() context: Context
    ): Promise<BookReviewVote | null> {
        try {
            const user = context.user;

            if (!user) {
                throw new AppError("User not found", 404, "NotFoundError");
            }

            const vote = await BookReviewVote.findOne({
                where: {
                    user: { id: user.id },
                    review: { id: reviewId },
                },
                relations: {
                    user: true,
                    review: true,
                },
            });

            if (!vote) {
                throw new AppError("Vote not found", 404, "NotFoundError");
            }

            const voteId = vote.id;
            await vote.remove();
            vote.id = voteId;

            return vote;
        } catch (error) {
            if (error instanceof AppError) {
                throw error;
            }
            throw new AppError(
                "Failed to remove vote",
                500,
                "InternalServerError"
            );
        }
    }

    /**
     * Mutation to toggle a helpful vote on a review.
     * 
     * @description
     * Convenience mutation that specifically handles "helpful" votes in a toggle fashion:
     * - If no vote exists → creates a helpful vote
     * - If helpful vote exists → removes the vote
     * - If not helpful vote exists → changes it to helpful
     * 
     * This is useful for a simple "👍 Helpful" button that doesn't require
     * the user to choose between helpful/not helpful explicitly.
     * 
     * @param reviewId - The ID of the review to toggle the helpful vote on.
     * @param context - GraphQL context containing the authenticated user.
     * 
     * @returns An object with:
     * - `vote`: The BookReviewVote object (null if removed)
     * - `action`: "created", "removed", or "updated"
     * 
     * @example
     * ```graphql
     * mutation {
     *   toggleHelpfulVote(reviewId: 1) {
     *     vote {
     *       id
     *       isHelpful
     *     }
     *     action
     *   }
     * }
     * ```
     * 
     * @throws AppError - If user not found, review not found, or operation fails.
     */
    @Authorized(Roles.User, Roles.Admin)
    @Mutation(() => BookReviewVoteResult)
    async toggleHelpfulVote(
        @Arg("reviewId", () => ID) reviewId: number,
        @Ctx() context: Context
    ): Promise<BookReviewVoteResult> {
        try {
            const user = context.user;

            if (!user) {
                throw new AppError("User not found", 404, "NotFoundError");
            }

            // Check if review exists
            const review = await BookReview.findOne({
                where: { id: reviewId },
                relations: {
                    user: true,
                },
            });

            if (!review) {
                throw new AppError("Review not found", 404, "NotFoundError");
            }

            // Prevent users from voting on their own reviews
            if (review.user.id === user.id) {
                throw new AppError(
                    "You cannot vote on your own review",
                    403,
                    "ForbiddenError"
                );
            }

            // Check if user has already voted
            const existingVote = await BookReviewVote.findOne({
                where: {
                    user: { id: user.id },
                    review: { id: review.id },
                },
                relations: {
                    user: true,
                    review: true,
                },
            });

            // If exists and is helpful, remove it (toggle off)
            if (existingVote && existingVote.isHelpful) {
                await existingVote.remove();
                return {
                    vote: null,
                    action: "removed",
                };
            }

            // If exists and is not helpful, change to helpful
            if (existingVote && !existingVote.isHelpful) {
                existingVote.isHelpful = true;
                await existingVote.save();

                // Grant XP to review author
                await grantXpService(
                    review.user,
                    UserActionType.REVIEW_VOTED_HELPFUL,
                    {
                        targetId: review.id.toString(),
                        metadata: {
                            voterId: user.id,
                            voterName: user.userName || "Unknown",
                        },
                    }
                );

                return {
                    vote: existingVote,
                    action: "updated",
                };
            }

            // If doesn't exist, create helpful vote
            const newVote = new BookReviewVote();
            newVote.isHelpful = true;
            newVote.user = user;
            newVote.review = review;

            await newVote.save();

            // Grant XP to review author
            await grantXpService(
                review.user,
                UserActionType.REVIEW_VOTED_HELPFUL,
                {
                    targetId: review.id.toString(),
                    metadata: {
                        voterId: user.id,
                        voterName: user.userName || "Unknown",
                    },
                }
            );

            return {
                vote: newVote,
                action: "created",
            };
        } catch (error) {
            if (error instanceof AppError) {
                throw error;
            }
            throw new AppError(
                "Failed to toggle helpful vote",
                500,
                "InternalServerError"
            );
        }
    }
}