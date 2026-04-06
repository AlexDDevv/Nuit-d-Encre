import { Field, ID, Int, ObjectType } from "type-graphql";

@ObjectType()
export class BookSearchResult {
    @Field(() => ID, { nullable: true })
    id?: number;

    @Field()
    title!: string;

    @Field({ nullable: true })
    author?: string;

    @Field({ nullable: true })
    isbn13?: string;

    @Field(() => Int, { nullable: true })
    year?: number;

    @Field({ nullable: true })
    publisher?: string;

    @Field({ nullable: true })
    language?: string;

    @Field({ nullable: true })
    coverUrl?: string;

    @Field(() => Int, { nullable: true })
    pageCount?: number;

    @Field({ nullable: true })
    description?: string;

    @Field()
    isInDatabase!: boolean;

    @Field({ nullable: true })
    source?: string;
}
