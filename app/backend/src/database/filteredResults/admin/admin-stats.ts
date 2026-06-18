import { Field, Int, ObjectType } from "type-graphql";

/**
 * AdminStats
 * @description
 * Compteurs globaux affichés dans la barre d'analytics du panel admin.
 */
@ObjectType()
export class AdminStats {
    @Field(() => Int)
    users!: number;

    @Field(() => Int)
    books!: number;

    @Field(() => Int)
    authors!: number;

    @Field(() => Int)
    reviews!: number;

    @Field(() => Int)
    categories!: number;
}
