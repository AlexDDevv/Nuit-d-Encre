/**
 * @packageDocumentation
 * @category Entities
 * @description
 * This module defines the UserBook entity for the database.
 * It represents the relationship between a user and a book in the user's
 * personal library, including reading status, rating, review, visibility,
 * and reading timeline. It enforces a single entry per (user, book) pair
 * and provides indexes to optimize lookups by user and by book.
 */

import { Field, ID, Int, ObjectType, registerEnumType } from "type-graphql";
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  Index,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
} from "typeorm";
import { User } from "./user";
import { Book } from "../book/book";
import { ReadingStatus } from "../../../types/types";

/**
 * Registers the ReadingStatus enum in the GraphQL schema.
 * @see {@link ReadingStatus}
 */
registerEnumType(ReadingStatus, { name: "ReadingStatus" });

/**
 * UserBook Entity
 * @description
 * Represents a user's entry for a given book in their personal library.
 *
 * @param name is the entity's name in the database.
 *
 * This class defines the structure of the user-book relationship:
 * - `id`: unique identifier for the user-book entry.
 * - `user`: the owner of the library entry (foreign key).
 * - `book`: the referenced book (foreign key).
 * - `status`: reading status (e.g., TO_READ, READING, READ, PAUSED...).
 * - `rating`: optional rating given by the user (0–5).
 * - `review`: optional textual review provided by the user.
 * - `recommended`: optional flag indicating if the user recommends the book.
 * - `startedAt`: optional date when the user started reading the book.
 * - `finishedAt`: optional date when the user finished reading the book.
 * - `isPublic`: visibility of this entry (public by default).
 * - `createdAt`: timestamp when the entry was created.
 * - `updatedAt`: timestamp when the entry was last updated.
 *
 * Constraints and indexes:
 * - Unique constraint `UQ_user_book` on (`user`, `book`) ensures a book
 *   appears at most once in a user's library.
 * - Index `IDX_user` on `user` optimizes queries filtering by user.
 * - Index `IDX_book` on `book` optimizes queries filtering by book.
 *
 * @example
 * ```typescript
 * // Create or update a user-book entry
 * const userBook = new UserBook();
 * userBook.user = userInstance;      // existing User
 * userBook.book = bookInstance;      // existing Book
 * userBook.status = ReadingStatus.READING;
 * userBook.rating = 5;
 * userBook.review = "A thoughtful and moving story.";
 * userBook.recommended = true;
 * userBook.isPublic = true;          // optional (defaults to true)
 * await userBook.save();
 * ```
 *
 * Decorators used:
 * - `@Entity()`: Declares the class as a database entity.
 * - `@PrimaryGeneratedColumn()`: Auto-generates a primary key.
 * - `@Column()`: Maps properties to database columns.
 * - `@ManyToOne()`: Defines many-to-one relationships.
 * - `@Unique()`: Enforces a uniqueness constraint across columns.
 * - `@Index()`: Creates indexes for faster lookups.
 * - `@CreateDateColumn()` / `@UpdateDateColumn()`: Automatic timestamps.
 * - `@Field()`: Exposes fields to the GraphQL schema.
 */
@ObjectType()
@Entity({ name: "user_book" })
@Unique("UQ_user_book", ["user", "book"])
@Index("IDX_user", ["user"])
@Index("IDX_book", ["book"])
export class UserBook extends BaseEntity {
  /**
   * Unique identifier for the user-book entry
   * @description
   * Auto-generated primary key.
   */
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id!: number;

  /**
   * The user who owns this library entry
   * @description
   * Many-to-one relationship with the User entity.
   * `onDelete: "CASCADE"` removes related entries if the user is deleted.
   */
  @ManyToOne(() => User, (user) => user.userBooks, { onDelete: "CASCADE" })
  @Field(() => User)
  user!: User;

  /**
   * The referenced book
   * @description
   * Many-to-one relationship with the Book entity.
   * `onDelete: "CASCADE"` removes related entries if the book is deleted.
   */
  @ManyToOne(() => Book, (book) => book.userBooks, { onDelete: "CASCADE" })
  @Field(() => Book)
  book!: Book;

  /**
   * Reading status for this book
   * @description
   * One of the values defined in ReadingStatus.
   * Defaults to TO_READ.
   */
  @Field(() => ReadingStatus)
  @Column({
    type: "enum",
    enum: ReadingStatus,
    default: ReadingStatus.TO_READ,
  })
  status!: ReadingStatus;

  /**
   * Rating given by the user
   * @description
   * Optional integer rating (typically 0–5).
   */
  @Field(() => Int, { nullable: true })
  @Column({ type: "int", nullable: true })
  rating?: number | null;

  /**
   * User's textual review
   * @description
   * Optional free-form text review associated with the book.
   */
  @Field(() => String, { nullable: true })
  @Column({ type: "text", nullable: true })
  review?: string | null;

  /**
   * User recommendation flag
   * @description
   * Optional boolean indicating whether the user recommends the book.
   * Can be aggregated to compute community recommendation counts.
   */
  @Field({ nullable: true })
  @Column({ type: "boolean", default: false })
  recommended?: boolean;

  /**
   * Reading start date
   * @description
   * Optional date when the user started reading the book.
   */
  @Field(() => Date, { nullable: true })
  @Column({ type: "date", nullable: true })
  startedAt?: Date | null;

  /**
   * Reading finish date
   * @description
   * Optional date when the user finished reading the book.
   */
  @Field(() => Date, { nullable: true })
  @Column({ type: "date", nullable: true })
  finishedAt?: Date | null;

  /**
   * Visibility of this library entry
   * @description
   * Indicates whether this entry is public (default) or private.
   * Useful for social features and public profiles.
   */
  @Field({ nullable: true })
  @Column({ type: "boolean", default: true })
  isPublic!: boolean;

  /**
   * Timestamp when the entry was created
   * @description
   * Automatically set when the entry is created.
   */
  @Field()
  @CreateDateColumn({ type: "timestamp with time zone" })
  createdAt!: Date;

  /**
   * Timestamp when the entry was last updated
   * @description
   * Automatically updated whenever the entry is modified.
   */
  @Field()
  @UpdateDateColumn({ type: "timestamp with time zone" })
  updatedAt!: Date;
}
