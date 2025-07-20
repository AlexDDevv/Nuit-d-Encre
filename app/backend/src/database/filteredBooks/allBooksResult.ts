import { Field, Int, ObjectType } from "type-graphql"
import { Book } from "../entities/book/book"

/**
 * Represents the response of the `books` query, containing paginated results of all books.
 * This class structures the return value of the query with pagination metadata.
 *
 * @description
 * - `allBooks`: array of `Book` objects corresponding to the books matching the query.
 * - `totalCount`: total number of books matching the applied filters (after filtering).
 * - `totalCountAll`: total number of books without any filters applied.
 * - `page`: current page number (optional, useful for client-side pagination).
 * - `limit`: number of books per page (optional, useful for client-side pagination).
 *
 * The decorators used are:
 * - `@ObjectType()`: marks the class as a GraphQL output type.
 * - `@Field()`: exposes each property to the GraphQL schema.
 */
@ObjectType()
export class AllBooksResult {
	@Field(() => [Book])
	allBooks!: Book[]

	@Field(() => Int)
	totalCount!: number

	@Field(() => Int)
	totalCountAll!: number

	@Field(() => Int, { nullable: true })
	page?: number

	@Field(() => Int, { nullable: true })
	limit?: number
}
