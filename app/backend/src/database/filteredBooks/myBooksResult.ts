import { Field, Int, ObjectType } from "type-graphql"
import { Book } from "../entities/book/book"

/**
 * Represents the response of the `myBooks` query, containing paginated results of the authenticated user's books.
 * This class structures the return value of the query along with pagination metadata.
 *
 * @description
 * - `books`: array of `Book` objects corresponding to the user's books.
 * - `totalCount`: total number of books matching the applied filters (after filtering).
 * - `totalCountAll`: total number of the user's books without any filters applied.
 * - `page`: current page number (optional, useful for client-side pagination).
 * - `limit`: number of books per page (optional, useful for client-side pagination).
 *
 * The decorators used are:
 * - `@ObjectType()`: marks the class as a GraphQL output type.
 * - `@Field()`: exposes each property to the GraphQL schema.
 */
@ObjectType()
export class MyBooksResult {
	@Field(() => [Book])
	books!: Book[]

	@Field(() => Int)
	totalCount!: number

	@Field(() => Int)
	totalCountAll!: number

	@Field(() => Int, { nullable: true })
	page?: number

	@Field(() => Int, { nullable: true })
	limit?: number
}

