import { Field, Int, ObjectType } from "type-graphql"
import { Author } from "../../entities/author/author"

/**
 * Represents the response of the `authors` query, containing paginated results of all authors.
 * This class structures the return value of the query with pagination metadata.
 *
 * @description
 * - `allAuthors`: array of `Author` objects corresponding to the authors matching the query.
 * - `totalCount`: total number of authors matching the applied filters (after filtering).
 * - `totalCountAll`: total number of authors without any filters applied.
 * - `page`: current page number (optional, useful for client-side pagination).
 * - `limit`: number of authors per page (optional, useful for client-side pagination).
 *
 * The decorators used are:
 * - `@ObjectType()`: marks the class as a GraphQL output type.
 * - `@Field()`: exposes each property to the GraphQL schema.
 */
@ObjectType()
export class AuthorsResult {
	@Field(() => [Author])
	allAuthors!: Author[]

	@Field(() => Int)
	totalCount!: number

	@Field(() => Int)
	totalCountAll!: number

	@Field(() => Int, { nullable: true })
	page?: number

	@Field(() => Int, { nullable: true })
	limit?: number
}
