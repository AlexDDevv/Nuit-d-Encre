/**
 * @packageDocumentation
 * @category Entities
 * @description
 * This module defines the BookReview entity for the database.
 * It represents a review/critique written by a user for a specific book,
 * including a rating and optional review text. A user can only write one
 * review per book, ensuring data integrity.
 */

import { Field, ID, Int, ObjectType } from "type-graphql";
import {
    BaseEntity,
    Column,
    Entity,
    ManyToOne,
    OneToMany,
    PrimaryGeneratedColumn,
    Unique,
} from "typeorm";
import { User } from "../user/user";
import { Book } from "../book/book";
import { BookReviewVote } from "./bookReviewVote";

/**
 * BookReview Entity
 * @description
 * Represents a book review entity in the database.
 *
 * @param name is the entity's name in the database.
 *
 * This class defines the structure of the book review entity in the database:
 * - `id`: unique identifier for the review.
 * - `rating`: numerical rating given by the user (1-5 or 1-10).
 * - `reviewText`: optional text content of the review/critique.
 * - `user`: user who wrote the review (foreign key).
 * - `book`: book being reviewed (foreign key).
 * - `votes`: collection of votes on this review (helpful/not helpful).
 * - `createdAt`: timestamp when the review was created.
 * - `updatedAt`: timestamp when the review was last updated.
 *
 * A unique constraint on (user_id, book_id) ensures that each user
 * can only write one review per book.
 *
 * @example
 * ```typescript
 * const review = new BookReview();
 * review.rating = 5;
 * review.reviewText = "An absolutely captivating read! Highly recommended.";
 * review.user = userInstance;
 * review.book = bookInstance;
 * await review.save();
 * ```
 *
 * Decorators used:
 * - `@Entity()`: Declares the class as a database entity.
 * - `@PrimaryGeneratedColumn()`: Auto-generates a primary key.
 * - `@Column()`: Maps properties to database columns.
 * - `@ManyToOne()`: Defines many-to-one relationships.
 * - `@OneToMany()`: Defines one-to-many relationships.
 * - `@Unique()`: Ensures uniqueness on multiple columns.
 * - `@Field()`: Exposes fields to the GraphQL schema.
 */
@ObjectType()
@Entity({ name: "book_review" })
@Unique(["user", "book"])
export class BookReview extends BaseEntity {
    /**
     * Unique identifier for the review
     * @description
     * Auto-generated primary key.
     */
    @Field(() => ID)
    @PrimaryGeneratedColumn("uuid")
    id!: string;

    /**
     * Rating score for the book
     * @description
     * Numerical rating given by the user.
     * Typically on a scale of 1-5 or 1-10.
     * This field is required.
     */
    @Field(() => Int)
    @Column()
    rating!: number;

    /**
     * Review text content
     * @description
     * Optional text where the user can write their detailed critique,
     * thoughts, or analysis of the book.
     * Can be null if the user only wants to provide a rating.
     */
    @Field({ nullable: true })
    @Column({ type: "text", nullable: true })
    reviewText?: string;

    /**
     * The user who wrote the review
     * @description
     * Many-to-one relationship with the User entity.
     * Each review belongs to exactly one user.
     */
    @ManyToOne(() => User, (user) => user.bookReviews)
    @Field(() => User)
    user!: User;

    /**
     * The book being reviewed
     * @description
     * Many-to-one relationship with the Book entity.
     * Each review is about exactly one book.
     */
    @ManyToOne(() => Book, (book) => book.reviews)
    @Field(() => Book)
    book!: Book;

    /**
     * Votes on this review
     * @description
     * One-to-many relationship with the BookReviewVote entity.
     * Represents all the helpful/not helpful votes this review has received.
     */
    @OneToMany(() => BookReviewVote, (vote) => vote.review)
    @Field(() => [BookReviewVote])
    votes!: BookReviewVote[];

    /**
     * Timestamp when the review was created
     * @description
     * Automatically set when the review is created.
     */
    @Field()
    @Column({ default: () => "CURRENT_TIMESTAMP" })
    createdAt!: Date;

    /**
     * Timestamp when the review was last updated
     * @description
     * Automatically updated whenever the review is modified.
     */
    @Field()
    @Column({
        default: () => "CURRENT_TIMESTAMP",
        onUpdate: "CURRENT_TIMESTAMP",
    })
    updatedAt!: Date;
}