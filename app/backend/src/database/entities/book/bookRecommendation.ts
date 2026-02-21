/**
 * @packageDocumentation
 * @category Entities
 * @description
 * This module defines the BookRecommendation entity for the database.
 * It represents a simple recommendation action by a user for a specific book.
 * Unlike reviews, recommendations are lightweight endorsements without
 * ratings or text content. A user can only recommend a book once.
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
import { Book } from "../book/book";

/**
 * BookRecommendation Entity
 * @description
 * Represents a book recommendation entity in the database.
 *
 * @param name is the entity's name in the database.
 *
 * This class defines the structure of the book recommendation entity in the database:
 * - `id`: unique identifier for the recommendation.
 * - `user`: user who made the recommendation (foreign key).
 * - `book`: book being recommended (foreign key).
 * - `createdAt`: timestamp when the recommendation was created.
 *
 * A unique constraint on (user_id, book_id) ensures that each user
 * can only recommend a book once. Users can recommend books without
 * writing a full review, providing a quick way to endorse content.
 *
 * @example
 * ```typescript
 * const recommendation = new BookRecommendation();
 * recommendation.user = userInstance;
 * recommendation.book = bookInstance;
 * await recommendation.save();
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
@Entity({ name: "book_recommendation" })
@Unique(["user", "book"])
export class BookRecommendation extends BaseEntity {
    /**
     * Unique identifier for the recommendation
     * @description
     * Auto-generated primary key.
     */
    @Field(() => ID)
    @PrimaryGeneratedColumn()
    id!: number;

    /**
     * The user who made the recommendation
     * @description
     * Many-to-one relationship with the User entity.
     * Each recommendation belongs to exactly one user.
     */
    @ManyToOne(() => User, (user) => user.bookRecommendations)
    @Field(() => User)
    user!: User;

    /**
     * The book being recommended
     * @description
     * Many-to-one relationship with the Book entity.
     * Each recommendation is for exactly one book.
     */
    @ManyToOne(() => Book, (book) => book.recommendations)
    @Field(() => Book)
    book!: Book;

    /**
     * Timestamp when the recommendation was created
     * @description
     * Automatically set when the recommendation is created.
     * Useful for tracking when users discovered and endorsed books.
     */
    @Field()
    @Column({ default: () => "CURRENT_TIMESTAMP" })
    createdAt!: Date;
} 