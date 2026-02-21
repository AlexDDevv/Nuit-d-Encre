/**
 * @packageDocumentation
 * @category Inputs
 * @description
 * Input type for creating or toggling a book recommendation.
 */

import { Field, ID, InputType } from "type-graphql";

/**
 * CreateBookRecommendationInput
 * @description
 * Input data required to create or toggle a recommendation for a book.
 * 
 * Since recommendations are simple endorsements without additional data,
 * only the book ID is required. The user is automatically determined
 * from the authentication context.
 * 
 * @example
 * ```graphql
 * mutation {
 *   toggleBookRecommendation(data: { bookId: 1 }) {
 *     id
 *     book { title }
 *   }
 * }
 * ```
 */
@InputType()
export class CreateBookRecommendationInput {
    /**
     * ID of the book to recommend
     * @description
     * The unique identifier of the book being recommended.
     * This is the only required field as the user is derived from context.
     */
    @Field(() => ID)
    bookId!: number;
}