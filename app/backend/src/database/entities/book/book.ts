/**
 * @packageDocumentation
 * @category Entities
 * @description
 * This module defines the Book entity for the database.
 * It represents a book added by a user, including details like title,
 * description, author, ISBN codes, format, publication data, and its 
 * availability. It maintains relationships with the User and Category entities.
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
import { Author } from "./author";

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
 * - `description`: summary or context about the book.
 * - `author`: author of the book.
 * - `category`: category or genre the book belongs to.
 * - `isbn10`: optional 10-digit ISBN.
 * - `isbn13`: required 13-digit ISBN (must be unique).
 * - `pageCount`: required total number of pages.
 * - `publishedYear`: required publication date.
 * - `language`: required language of the book.
 * - `publisher`: required name of the publisher.
 * - `format`: book format (required, one of: "hardcover", "paperback", "softcover").
 * - `user`: user who added the book (foreign key).
 * - `createdAt`: timestamp when the book was created.
 * - `updatedAt`: timestamp when the book was last updated.
 *
 * @example
 * ```typescript
 * const book = new Book();
 * book.title = "The Little Prince";
 * book.description = "A poetic and philosophical tale";
 * book.author = "Antoine de Saint-Exupéry";
 * book.isbn13 = "9780156012195";
 * book.format = "paperback";
 * book.user = userInstance;
 * book.category = categoryInstance;
 * await book.save();
 * ```
 *
 * Decorators used:
 * - `@Entity()`: Declares the class as a database entity.
 * - `@PrimaryGeneratedColumn()`: Auto-generates a primary key.
 * - `@Column()`: Maps properties to database columns.
 * - `@ManyToOne()`: Defines many-to-one relationships.
 * - `@Field()`: Exposes fields to the GraphQL schema.
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
     * Many-to-one relationship with the Author entity
     */
    @ManyToOne(() => Author, author => author.books)
    @Field(() => Author)
    author!: Author

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
    @Field()
    @Column({ type: "int" })
    pageCount!: number;

    /**
     * Publication year
     * @description
     * The year when the book was published.  
     * Optional field.
     */
    @Field()
    @Column({ type: "int" })
    publishedYear!: number;

    /**
     * Language of the book
     * @description
     * The language in which the book is written (e.g., "en", "fr").  
     */
    @Field()
    @Column({ length: 5 })
    language!: string;

    /**
     * Publisher
     * @description
     * The name of the publishing house for the book.  
     */
    @Field()
    @Column({ length: 255 })
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
