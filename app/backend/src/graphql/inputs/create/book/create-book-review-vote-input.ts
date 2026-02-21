/**
 * @packageDocumentation
 * @category Inputs
 * @description
 * Input type for voting on a book review.
 */

import { Field, ID, InputType } from "type-graphql";
import { IsBoolean } from "class-validator";

/**
 * CreateBookReviewVoteInput
 * @description
 * Input data required to cast a vote on a book review.
 * 
 * Users can vote to indicate whether they found a review helpful or not.
 * Each user can vote only once per review. The user is automatically
 * determined from the authentication context.
 * 
 * @example
 * ```graphql
 * mutation {
 *   voteOnReview(data: {
 *     reviewId: 1
 *     isHelpful: true
 *   }) {
 *     id
 *     isHelpful
 *     review {
 *       helpfulCount
 *     }
 *   }
 * }
 * ```
 */
@InputType()
export class CreateBookReviewVoteInput {
    /**
     * ID of the review being voted on
     * @description
     * The unique identifier of the review to vote on.
     */
    @Field(() => ID)
    reviewId!: number;

    /**
     * Whether the vote is helpful
     * @description
     * - `true`: The user found the review helpful/useful
     * - `false`: The user found the review not helpful/not useful
     */
    @Field()
    @IsBoolean()
    isHelpful!: boolean;
}