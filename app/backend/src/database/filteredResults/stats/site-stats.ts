import { Field, Int, ObjectType } from "type-graphql";

/**
 * SiteStats
 * @description
 * Public global counters shown on the Contact page (registered users,
 * referenced books, written reviews). No personal data exposed.
 */
@ObjectType()
export class SiteStats {
    @Field(() => Int)
    users!: number;

    @Field(() => Int)
    books!: number;

    @Field(() => Int)
    reviews!: number;
}
