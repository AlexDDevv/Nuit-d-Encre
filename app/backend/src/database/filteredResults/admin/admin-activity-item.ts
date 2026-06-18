import { Field, ID, Int, ObjectType } from "type-graphql";

/**
 * AdminActivityItem
 * @description
 * Entrée aplatie du journal de bord XP affiché sur le dashboard admin.
 * L'entité `UserActions` n'expose pas sa relation `user` au schéma GraphQL ;
 * ce DTO porte donc directement l'identité de l'auteur de l'action.
 */
@ObjectType()
export class AdminActivityItem {
    @Field(() => ID)
    id!: string;

    @Field()
    type!: string;

    @Field(() => Int)
    xp!: number;

    @Field(() => String, { nullable: true })
    metadata?: string | null;

    @Field(() => String, { nullable: true })
    targetId?: string | null;

    @Field()
    createdAt!: Date;

    @Field(() => ID)
    userId!: string;

    @Field()
    userName!: string;
}
