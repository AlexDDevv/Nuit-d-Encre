/**
 * @packageDocumentation
 * @category Inputs
 * @description
 * Input type for updating an existing book review.
 */

import { Field, ID, InputType, Int } from "type-graphql";
import { IsInt, IsOptional, IsString, Max, MaxLength, Min } from "class-validator";

/**
 * UpdateBookReviewInput
 * @description
 * Input data for updating an existing book review.
 * 
 * All fields except `id` are optional, allowing partial updates.
 * Users can update just the rating, just the text, or both.
 * Only the owner of the review can update it.
 * 
 * @example
 * ```graphql
 * mutation {
 *   updateBookReview(data: {
 *     id: 1
 *     rating: 4
 *     reviewText: "Updated my opinion - still great but not perfect"
 *   }) {
 *     id
 *     rating
 *     reviewText
 *   }
 * }
 * ```
 */
@InputType()
export class UpdateBookReviewInput {
    /**
     * ID of the review to update
     * @description
     * The unique identifier of the review being modified.
     */
    @Field(() => ID)
    id!: number;

    /**
     * Updated numerical rating
     * @description
     * Optional new rating score. If provided, must be within valid range.
     * If omitted, the existing rating is preserved.
     */
    @Field(() => Int, { nullable: true })
    @IsOptional()
    @IsInt()
    @Min(1, { message: "Rating must be at least 1" })
    @Max(5, { message: "Rating must not exceed 5" })
    rating?: number;

    /**
     * Updated review text content
     * @description
     * Optional new review text. Can be set to empty string to remove text.
     * If omitted, the existing text is preserved.
     * Limited to 5000 characters.
     */
    @Field({ nullable: true })
    @IsOptional()
    @IsString()
    @MaxLength(5000, { message: "Review text must not exceed 5000 characters" })
    reviewText?: string;
}