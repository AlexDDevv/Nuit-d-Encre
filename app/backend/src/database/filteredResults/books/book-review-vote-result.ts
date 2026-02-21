/**
 * BookReviewVoteResult
 * @description
 * Return type for vote mutations that indicates the action performed.
 */
import { ObjectType, Field } from "type-graphql";
import { BookReviewVote } from "../../entities/book/bookReviewVote";

@ObjectType()
export class BookReviewVoteResult {
    /**
     * The vote object
     * @description
     * Contains the BookReviewVote if created/updated, or null if removed.
     */
    @Field(() => BookReviewVote, { nullable: true })
    vote!: BookReviewVote | null;

    /**
     * Action performed
     * @description
     * Indicates what action was taken: "created", "updated", or "removed".
     * Useful for frontend feedback messages.
     */
    @Field()
    action!: "created" | "updated" | "removed";
}