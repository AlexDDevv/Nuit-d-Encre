/**
 * BookRecommendationToggleResult
 * @description
 * Return type for the toggleBookRecommendation mutation.
 * Indicates whether a recommendation was created or removed.
 */
import { ObjectType, Field } from "type-graphql";
import { BookRecommendation } from "../../../database/entities/book/bookRecommendation";

@ObjectType()
export class BookRecommendationToggleResult {
    /**
     * The recommendation object
     * @description
     * Contains the BookRecommendation if created, or null if removed.
     */
    @Field(() => BookRecommendation, { nullable: true })
    recommendation!: BookRecommendation | null;

    /**
     * Action performed
     * @description
     * Indicates what action was taken: "created" or "removed".
     * Useful for frontend feedback messages.
     */
    @Field()
    action!: "created" | "removed";
}