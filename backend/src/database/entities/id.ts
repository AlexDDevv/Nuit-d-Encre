import { Field, ID, InputType } from "type-graphql";

/**
 * IdInput is a reusable input type that represents a single entity identifier.
 *
 * It is typically used for queries or mutations that require fetching,
 * updating, or deleting an entity by its unique numeric ID.
 */

@InputType()
export class IdInput {
    /**
     * The unique identifier of the entity.
     */
    @Field(() => ID)
    id: number;
}
