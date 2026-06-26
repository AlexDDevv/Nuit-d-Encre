import { Field, ID, Int, ObjectType } from "type-graphql";

@ObjectType()
export class FeedActor {
    @Field(() => ID)
    id!: string;

    @Field()
    userName!: string;

    @Field(() => String, { nullable: true })
    avatar?: string | null;

    @Field(() => Int)
    level!: number;
}

@ObjectType()
export class FeedEntry {
    @Field(() => ID)
    id!: string;

    @Field()
    type!: string;

    @Field(() => String, { nullable: true })
    metadata?: string | null;

    @Field(() => String, { nullable: true })
    targetId?: string | null;

    @Field()
    createdAt!: Date;

    @Field(() => FeedActor)
    actor!: FeedActor;
}
