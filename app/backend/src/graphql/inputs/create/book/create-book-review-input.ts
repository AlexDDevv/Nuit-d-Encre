/**
 * @packageDocumentation
 * @category Inputs
 * @description
 * Input type for creating a book review.
 */

import { Field, ID, InputType, Int } from "type-graphql";
import { IsInt, IsOptional, IsString, Max, MaxLength, Min } from "class-validator";

/**
 * CreateBookReviewInput
 * @description
 * Input data required to create a review for a book.
 * 
 * A review consists of a mandatory rating (numerical score) and an optional
 * text review. The user is automatically determined from the authentication context.
 * 
 * @example
 * ```graphql
 * mutation {
 *   createBookReview(data: {
 *     bookId: 1
 *     rating: 5
 *     reviewText: "An absolutely captivating read!"
 *   }) {
 *     id
 *     rating
 *     reviewText
 *   }
 * }
 * ```
 */
@InputType()
export class CreateBookReviewInput {
    /**
     * ID of the book being reviewed
     * @description
     * The unique identifier of the book for which the review is being written.
     */
    @Field(() => ID)
    bookId!: string;

    /**
     * Numerical rating for the book
     * @description
     * The rating score given by the user, typically on a scale of 1-5 or 1-10.
     * Must be within the valid range defined by Min and Max validators.
     */
    @Field(() => Int)
    @IsInt()
    @Min(1, { message: "Rating must be at least 1" })
    @Max(5, { message: "Rating must not exceed 5" })
    rating!: number;

    /**
     * Review text content
     * @description
     * Optional detailed critique or thoughts about the book.
     * Limited to 5000 characters to prevent excessively long reviews.
     */
    @Field({ nullable: true })
    @IsOptional()
    @IsString()
    @MaxLength(5000, { message: "Review text must not exceed 5000 characters" })
    reviewText?: string;
}