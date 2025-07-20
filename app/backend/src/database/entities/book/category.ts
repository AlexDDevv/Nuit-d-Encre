/**
 * @packageDocumentation
 * @category Entities
 * @description
 * This module defines the `Category` entity for the database.
 * It represents a category to which books can be assigned.
 */

import {
	BaseEntity,
	Column,
	Entity,
	ManyToOne,
	OneToMany,
	PrimaryGeneratedColumn,
} from "typeorm"
import { ObjectType, Field, ID } from "type-graphql"
import { User } from "../user"
import { Book } from "./book"

/**
 * Category Entity
 * @description
 * Represents a category for organizing books.
 * Each category has a unique name and can contain multiple books.
 * It is created by a user, and timestamps are automatically handled.
 *
 * @param name is the entity's name in the database (`category`).
 *
 * This class defines the structure of the Category entity in the database:
 * - `id`: unique identifier for the category.
 * - `name`: unique name for the category.
 * - `books`: books that belong to this category.
 * - `createdBy`: the user who created this category.
 * - `createdAt`: timestamp of when the category was created.
 * - `updatedAt`: timestamp of the last update.
 *
 * @example
 * ```ts
 * const category = new Category()
 * category.name = "Science Fiction"
 * category.createdBy = currentUser
 * await category.save()
 * ```
 *
 * Decorators used:
 * - `@Entity()`: defines the table.
 * - `@PrimaryGeneratedColumn()`: auto-generates the primary key.
 * - `@Column()`: maps properties to columns.
 * - `@OneToMany()` / `@ManyToOne()`: defines relations.
 * - `@Field()`: exposes fields in the GraphQL schema.
 */
@ObjectType()
@Entity({ name: "category" })
export class Category extends BaseEntity {
	/**
	 * Unique identifier for the category
	 * @description
	 * Auto-generated primary key.
	 */
	@Field(() => ID)
	@PrimaryGeneratedColumn()
	id!: number

	/**
	 * Name of the book category
	 * @description
	 * A short, unique label used to classify books.
	 */
	@Field()
	@Column({ length: 100, unique: true })
	name!: string

	/**
	 * Books belonging to this category
	 * @description
	 * One-to-many relation to the `Book` entity.
	 */
	@OneToMany(() => Book, book => book.category)
	@Field(() => [Book])
	books!: Book[]

	/**
	 * User who created the category
	 * @description
	 * Many-to-one relation to the `User` entity.
	 */
	@ManyToOne(() => User)
	@Field(() => User, { nullable: true })
	createdBy!: User

	/**
	 * Timestamp when the category was created
	 * @description
	 * Automatically set on insertion.
	 */
	@Field()
	@Column({ default: () => "CURRENT_TIMESTAMP" })
	createdAt!: Date

	/**
	 * Timestamp when the category was last updated
	 * @description
	 * Automatically updated on change.
	 */
	@Field()
	@Column({
		default: () => "CURRENT_TIMESTAMP",
		onUpdate: "CURRENT_TIMESTAMP",
	})
	updatedAt!: Date
}
