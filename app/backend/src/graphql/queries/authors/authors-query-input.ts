import { IsOptional, IsInt, Min, IsString } from "class-validator"
import { Field, InputType, Int } from "type-graphql"

/**
 * Represents the input parameters for querying all authors.
 * This input is used to filter, sort, and paginate all authors in the app collection.
 *
 * @description
 * This input type defines the filters, sorting, and pagination options
 * for retrieving a paginated list of authors.
 *
 * - `search`: filter authors by firstname and lastname.
 * - `page`: page number for paginated results (default is typically 1).
 * - `limit`: maximum number of results per page (default can be 10–20).
 *
 * All fields are optional, allowing flexible and partial filtering.
 * 
 * The decorators used are:
 * - `@Field({ nullable: true })`: exposes each property to the GraphQL schema as optional.
 * - `@IsOptional()`: marks each field as optional during validation (class-validator).
 */
@InputType()
export class AuthorsQueryInput {
	@Field(() => String, { nullable: true })
	@IsOptional()
	@IsString()
	search?: string

	@Field(() => Int, { nullable: true })
	@IsOptional()
	@IsInt()
	@Min(1)
	page?: number

	@Field(() => Int, { nullable: true })
	@IsOptional()
	@IsInt()
	@Min(1)
	limit?: number
}
