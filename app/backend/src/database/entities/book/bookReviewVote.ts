/**
 * @packageDocumentation
 * @category Entities
 * @description
 * This module defines the ReviewVote entity for the database.
 * It represents a vote cast by a user on a book review, indicating
 * whether they found the review helpful or not helpful. This helps
 * surface the most useful reviews and provides feedback to reviewers.
 */

import { Field, ID, ObjectType } from "type-graphql";
import {
    BaseEntity,
    Column,
    Entity,
    ManyToOne,
    PrimaryGeneratedColumn,
    Unique,
} from "typeorm";
import { User } from "../user/user";
import { BookReview } from "./bookReview";

/**
 * BookReviewVote Entity
 * @description
 * Represents a vote on a book review entity in the database.
 *
 * @param name is the entity's name in the database.
 *
 * This class defines the structure of the book review vote entity in the database:
 * - `id`: unique identifier for the vote.
 * - `isHelpful`: boolean indicating if the vote is positive (helpful) or negative (not helpful).
 * - `user`: user who cast the vote (foreign key).
 * - `review`: review being voted on (foreign key).
 * - `createdAt`: timestamp when the vote was created.
 *
 * A unique constraint on (user_id, review_id) ensures that each user
 * can only vote once per review. Users can change their vote from
 * helpful to not helpful (or vice versa) by updating the isHelpful field.
 * Users cannot vote on their own reviews.
 *
 * @example
 * ```typescript
 * const vote = new BookReviewVote();
 * vote.isHelpful = true; // Mark as helpful
 * vote.user = userInstance;
 * vote.review = reviewInstance;
 * await vote.save();
 * ```
 *
 * Decorators used:
 * - `@Entity()`: Declares the class as a database entity.
 * - `@PrimaryGeneratedColumn()`: Auto-generates a primary key.
 * - `@Column()`: Maps properties to database columns.
 * - `@ManyToOne()`: Defines many-to-one relationships.
 * - `@Unique()`: Ensures uniqueness on multiple columns.
 * - `@Field()`: Exposes fields to the GraphQL schema.
 */
@ObjectType()
@Entity({ name: "book_review_vote" })
@Unique(["user", "review"])
export class BookReviewVote extends BaseEntity {
    /**
     * Unique identifier for the vote
     * @description
     * Auto-generated primary key.
     */
    @Field(() => ID)
    @PrimaryGeneratedColumn()
    id!: number;

    /**
     * Indicates if the vote is helpful
     * @description
     * Boolean flag where:
     * - `true` = the user found the review helpful/useful
     * - `false` = the user found the review not helpful/not useful
     * 
     * This allows users to provide feedback on review quality
     * and helps surface the most valuable reviews.
     */
    @Field()
    @Column()
    isHelpful!: boolean;

    /**
     * The user who cast the vote
     * @description
     * Many-to-one relationship with the User entity.
     * Each vote belongs to exactly one user.
     * Users cannot vote on their own reviews (enforced in business logic).
     */
    @ManyToOne(() => User, (user) => user.bookReviewVotes)
    @Field(() => User)
    user!: User;

    /**
     * The review being voted on
     * @description
     * Many-to-one relationship with the BookReview entity.
     * Each vote is for exactly one review.
     */
    @ManyToOne(() => BookReview, (review) => review.votes)
    @Field(() => BookReview)
    review!: BookReview;

    /**
     * Timestamp when the vote was created
     * @description
     * Automatically set when the vote is created.
     * Useful for tracking voting patterns over time.
     */
    @Field()
    @Column({ default: () => "CURRENT_TIMESTAMP" })
    createdAt!: Date;
}