import { Field, Int, ObjectType } from "type-graphql"
import { Author } from "../../entities/authors/author"

/**
 * Represents the response of the `myAuthor` query, containing paginated results of the authenticated user's authors.
 * This class structures the return value of the query along with pagination metadata.
 *
 * @description
 * - `authors`: array of `Author` objects corresponding to the user's authors.
 * - `totalCount`: total number of authors matching the applied filters (after filtering).
 * - `totalCountAll`: total number of the user's authors without any filters applied.
 * - `page`: current page number (optional, useful for client-side pagination).
 * - `limit`: number of authors per page (optional, useful for client-side pagination).
 *
 * The decorators used are:
 * - `@ObjectType()`: marks the class as a GraphQL output type.
 * - `@Field()`: exposes each property to the GraphQL schema.
 */
@ObjectType()
export class MyAuthorsResult {
	@Field(() => [Author])
	authors!: Author[]

	@Field(() => Int)
	totalCount!: number

	@Field(() => Int)
	totalCountAll!: number

	@Field(() => Int, { nullable: true })
	page?: number

	@Field(() => Int, { nullable: true })
	limit?: number
}

