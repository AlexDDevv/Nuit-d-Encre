import { Field, Int, ObjectType } from "type-graphql";

/**
 * Nombre d'ouvrages de la bibliothèque d'un utilisateur, ventilé par statut de
 * lecture (sur l'ensemble de la collection, indépendamment de la pagination).
 */
@ObjectType()
export class UserBookStatusCounts {
    @Field(() => Int)
    total!: number;

    @Field(() => Int)
    toRead!: number;

    @Field(() => Int)
    reading!: number;

    @Field(() => Int)
    read!: number;

    @Field(() => Int)
    paused!: number;
}
