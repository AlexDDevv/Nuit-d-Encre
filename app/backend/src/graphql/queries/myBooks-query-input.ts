import { IsOptional, IsInt, Min, IsArray, IsString } from "class-validator"
import { Field, InputType, Int } from "type-graphql"
import { BookFormat } from "../../types/types"

/**
 * Represents the input parameters for querying books owned by the authenticated user.
 * This input is used to filter, sort, and paginate the user's personal book collection.
 *
 * @description
 * - `search`: filter books by keyword (matches the book title, isbn or author).
 * - `categoryIds`: filter books by one or more category IDs.
 * - `format`: filter books by their format
 * - `language`: filter books by their language
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
export class MyBooksQueryInput {
	@Field(() => String, { nullable: true })
	@IsOptional()
	@IsString()
	search?: string

	@Field(() => [Int], { nullable: true })
	@IsOptional()
	@IsArray()
	@IsInt({ each: true })
	categoryIds?: number[]

	@Field(() => [String], { nullable: true })
	@IsOptional()
	@IsArray()
	format?: BookFormat[]

	@Field(() => String, { nullable: true })
	@IsOptional()
	@IsString()
	language?: string

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
