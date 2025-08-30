/**
 * @packageDocumentation
 * @category Entities
 * @description
 * This module defines the Author entity for the database.
 * It represents an author referenced in the system, including details such as
 * first name, last name, birth date, nationality, and optional external links like
 * Wikipedia or an official website. It maintains a relationship with the User entity,
 * representing the user who added the author, and with Book entities linked to them.
 */

import { Field, ID, ObjectType } from "type-graphql";
import {
    BaseEntity,
    Column,
    Entity,
    ManyToOne,
    OneToMany,
    PrimaryGeneratedColumn,
} from "typeorm";
import { User } from "../user/user";
import { Book } from "../book/book";

/**
 * Author Entity
 * @description
 * Represents an author entity in the database.
 *
 * @param name the entity's name in the database.
 *
 * This class defines the structure of the author entity in the database:
 * - `id`: unique identifier for the author.
 * - `firstname`: first name of the author.
 * - `lastname`: last name of the author.
 * - `birthDate`: date of birth of the author.
 * - `nationality`: nationality or language of origin.
 * - `wikipediaUrl`: optional link to Wikipedia page.
 * - `officialWebsite`: optional link to official website.
 * - `books`: books associated with this author (one-to-many relationship).
 * - `user`: user who added the author (foreign key).
 * - `createdAt`: timestamp when the author was created.
 * - `updatedAt`: timestamp when the author was last updated.
 *
 * @example
 * ```typescript
 * const author = new Author();
 * author.firstname = "Antoine";
 * author.lastname = "de Saint-Exupéry";
 * author.birthDate = new Date("1900-06-29");
 * author.nationality = "fr";
 * author.wikipediaUrl = "https://en.wikipedia.org/wiki/Antoine_de_Saint-Exupéry";
 * author.user = userInstance;
 * await author.save();
 * ```
 *
 * Decorators used:
 * - `@Entity()`: Declares the class as a database entity.
 * - `@PrimaryGeneratedColumn()`: Auto-generates a primary key.
 * - `@Column()`: Maps properties to database columns.
 * - `@ManyToOne()`: Defines many-to-one relationships.
 * - `@OneToMany()`: Defines one-to-many relationships.
 * - `@Field()`: Exposes fields to the GraphQL schema.
 */
@ObjectType()
@Entity({ name: "author" })
export class Author extends BaseEntity {
    /**
     * Unique identifier for the author
     * @description
     * Auto-generated primary key.
     */
    @Field(() => ID)
    @PrimaryGeneratedColumn()
    id!: number;

    /**
     * First name of the author
     */
    @Field()
    @Column()
    firstname!: string;

    /**
     * Last name of the author
     */
    @Field()
    @Column()
    lastname!: string;

    /**
     * Birth date of the author
     */
    @Field({ nullable: true })
    @Column({ nullable: true })
    birthDate?: string;

    /**
     * Nationality of the author
     * @description
     * The language or country of origin (e.g., "en", "fr").
     */
    @Field({ nullable: true })
    @Column({ nullable: true })
    nationality?: string;

    /**
     * Wikipedia link
     * @description
     * Optional link to the author's Wikipedia page.
     */
    @Field({ nullable: true })
    @Column({ nullable: true })
    wikipediaUrl?: string;

    /**
     * Official website
     * @description
     * Optional link to the author's official website.
     */
    @Field({ nullable: true })
    @Column({ nullable: true })
    officialWebsite?: string;

    /**
     * Books written by the author
     * @description
     * One-to-many relationship with the Book entity.
     */
    @Field(() => [Book], { nullable: true })
    @OneToMany(() => Book, (book) => book.author, { nullable: true })
    books?: Book[];

    /**
     * The user who added the author
     * @description
     * Many-to-one relationship with the User entity.
     */
    @ManyToOne(() => User, (user) => user.authors)
    @Field(() => User)
    user!: User;

    /**
     * Timestamp when the author was created
     * @description
     * Automatically set when the author is created.
     */
    @Field()
    @Column({ default: () => "CURRENT_TIMESTAMP" })
    createdAt!: Date;

    /**
     * Timestamp when the author was last updated
     * @description
     * Automatically updated whenever the author is modified.
     */
    @Field()
    @Column({
        default: () => "CURRENT_TIMESTAMP",
        onUpdate: "CURRENT_TIMESTAMP",
    })
    updatedAt!: Date;
}
