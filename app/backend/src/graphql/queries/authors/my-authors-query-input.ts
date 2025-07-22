import { IsOptional, IsInt, Min, IsString } from "class-validator"
import { Field, InputType, Int } from "type-graphql"

/**
 * Represents the input parameters for querying authors owned by the authenticated user.
 * This input is used to filter, sort, and paginate the user's personal author collection.
 *
 * @description
 * - `search`: filter authors by firstname and lastname.
 * - `page`: optional page number for pagination (e.g., 1 for the first page).
 * - `limit`: optional number of items per page (used for pagination).
 *
 * All fields are optional, allowing flexible and partial filtering.
 *
 * The decorators used are:
 * - `@Field({ nullable: true })`: exposes each property to the GraphQL schema as optional.
 * - `@IsOptional()`: marks each field as optional during validation (class-validator).
 */
@InputType()
export class MyAuthorsQueryInput {
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
