import { Field, Float, ID, Int, ObjectType } from "type-graphql";

@ObjectType()
export class BookSearchResult {
    @Field(() => ID, { nullable: true })
    id?: number;

    @Field()
    title!: string;

    @Field({ nullable: true })
    author?: string;

    // ── Champs enrichis pour les résultats DB (cartes harmonisées avec
    // l'accueil) ; restent nuls pour les résultats externes. ──
    @Field(() => ID, { nullable: true })
    authorId?: number;

    @Field({ nullable: true })
    category?: string;

    @Field({ nullable: true })
    format?: string;

    @Field(() => Float, { nullable: true })
    averageRating?: number;

    @Field(() => Int, { nullable: true })
    reviewCount?: number;

    @Field({ nullable: true })
    isInLibrary?: boolean;

    @Field({ nullable: true })
    isImported?: boolean;

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
