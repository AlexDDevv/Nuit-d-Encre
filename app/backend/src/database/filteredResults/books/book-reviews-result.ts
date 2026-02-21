/**
 * BookReviewsResult
 * @description
 * Return type for the bookReviews query with pagination metadata.
 */
import { ObjectType, Field, Int } from "type-graphql";
import { BookReview } from "../../entities/book/bookReview";

@ObjectType()
export class BookReviewsResult {
    @Field(() => [BookReview])
    reviews!: BookReview[];

    @Field(() => Int)
    totalCount!: number;

    @Field(() => Int)
    page!: number;

    @Field(() => Int)
    limit!: number;
}