import { Field, ID, ObjectType } from "type-graphql";
import {
    BaseEntity,
    Column,
    Entity,
    ManyToOne,
    PrimaryGeneratedColumn,
} from "typeorm";
import { User } from "../user/user";
import { BookReview } from "./bookReview";

/**
 * Commentaire court posté sur une critique existante. Liste plate (pas de
 * réponses imbriquées), pas d'édition (suppression seule), pas de
 * contrainte unique — un utilisateur peut poster plusieurs commentaires
 * sous la même critique.
 */
@ObjectType()
@Entity({ name: "book_review_comment" })
export class BookReviewComment extends BaseEntity {
    @Field(() => ID)
    @PrimaryGeneratedColumn("uuid")
    id!: string;

    @Field()
    @Column({ type: "text" })
    content!: string;

    @ManyToOne(() => User)
    @Field(() => User)
    user!: User;

    @ManyToOne(() => BookReview, (review) => review.comments, {
        onDelete: "CASCADE",
    })
    @Field(() => BookReview)
    review!: BookReview;

    @Field()
    @Column({ default: () => "CURRENT_TIMESTAMP" })
    createdAt!: Date;
}
