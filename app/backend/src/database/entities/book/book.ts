/**
 * @packageDocumentation
 * @category Entities
 * @description
 * This module defines the Book entity for the database.
 * It represents a book added by a user, with a title, description,
 * author, availability status, and associated user.
 */

import { Field, ID, ObjectType } from "type-graphql";
import {
    BaseEntity,
    Column,
    Entity,
    ManyToOne,
    PrimaryGeneratedColumn,
} from "typeorm";
import { User } from "../user";
import { Category } from "./category";

/**
 * Book Entity
 * @description
 * Represents a book entity in the database.
 *
 * @param name is the entity's name in the database.
 *
 * This class defines the structure of the book entity in the database:
 * - `id`: unique identifier for the book.
 * - `title`: title of the book (must be unique).
 * - `description`: brief summary or context about the book.
 * - `author`: the author of the book.
 * - `isAvailable`: indicates whether the book is currently available (default is `true`).
 * - `user`: the user who added the book (relation to the `User` entity).
 * - `createdAt`: timestamp of when the book was created.
 * - `updatedAt`: timestamp of when the book was last updated.
 *
 * @example
 * ```typescript
 * // Create a new book
 * const book = new Book()
 * book.title = "The Little Prince"
 * book.description = "A poetic and philosophical tale"
 * book.author = "Antoine de Saint-Exupéry"
 * book.isAvailable = true
 * book.user = userInstance
 * await book.save()
 * ```
 *
 * Decorators used:
 * - `@Entity()`: Declares the class as a database entity.
 * - `@PrimaryGeneratedColumn()`: Marks the primary key column with auto-increment.
 * - `@Column()`: Maps a class property to a database column.
 * - `@ManyToOne()`: Defines a many-to-one relationship between entities.
 * - `@Field()`: Exposes a class property to the GraphQL schema.
 *
 */
@ObjectType()
@Entity({ name: "book" })
export class Book extends BaseEntity {
    /**
     * Unique identifier for the book
     * @description
     * Auto-generated primary key.
     */
    @Field(() => ID)
    @PrimaryGeneratedColumn()
    id!: number;

    /**
     * Title of the book
     * @description
     * A short, unique label that identifies the book.
     */
    @Field()
    @Column({ length: 255, unique: true }) // NOTE: Two books cannot have the same title
    title!: string;

    /**
     * Description of the book
     * @description
     * Provides additional information or a summary about the book.
     */
    @Field()
    @Column({ length: 5000 })
    description!: string;

    /**
     * Author of the book
     * @description
     * The name of the person who wrote the book.
     */
    @Field()
    @Column({ length: 255 })
    author!: string;

    /**
     * Category of the book
     * @description
     * Many-to-one relationship with the Category entity.
     */
    @ManyToOne(() => Category, category => category.books)
    @Field(() => Category)
    category!: Category

    /**
     * ISBN-10 code
     * @description
     * The 10-digit International Standard Book Number (optional).
     */
    @Field({ nullable: true })
    @Column({ length: 10, unique: true, nullable: true })
    isbn10?: string;

    /**
     * ISBN-13 code
     * @description
     * The 13-digit International Standard Book Number (required).
     */
    @Field()
    @Column({ length: 13, unique: true })
    isbn13!: string;

    /**
     * Number of pages
     * @description
     * Total number of pages in the book.  
     * Optional field.
     */
    @Field({ nullable: true })
    @Column({ type: "int", nullable: true })
    pageCount!: number;

    /**
     * Publication date
     * @description
     * The date when the book was published.  
     * Optional field.
     */
    @Field({ nullable: true })
    @Column({ type: "date", nullable: true })
    publishedDate!: Date;

    /**
     * Language of the book
     * @description
     * The language in which the book is written (e.g., "en", "fr", "English", "French").  
     * Optional field.
     */
    @Field({ nullable: true })
    @Column({ length: 100, nullable: true })
    language!: string;

    /**
     * Publisher
     * @description
     * The name of the publishing house for the book.  
     * Optional field.
     */
    @Field({ nullable: true })
    @Column({ length: 255, nullable: true })
    publisher!: string;

    /**
     * Book format
     * @description
     * The physical format of the book.  
     * For example:  
     * - "hardcover"  
     * - "paperback"  
     * - "softcover"  
     *  
     * This field is required and limited to these values.
     */
    @Field()
    @Column({
        type: "enum",
        enum: ["hardcover", "paperback", "softcover"],
    })
    format!: string;

    /**
     * The user who added the book
     * @description
     * Many-to-one relationship with the User entity.
     */
    @ManyToOne(() => User, (user) => user.books)
    @Field(() => User)
    user!: User;

    /**
     * Timestamp when the book was created
     * @description
     * Automatically set when the book is created.
     */
    @Field()
    @Column({ default: () => "CURRENT_TIMESTAMP" })
    createdAt!: Date;

    /**
     * Timestamp when the book was last updated
     * @description
     * Automatically updated whenever the book is modified.
     */
    @Field()
    @Column({
        default: () => "CURRENT_TIMESTAMP",
        onUpdate: "CURRENT_TIMESTAMP",
    })
    updatedAt!: Date;
}
