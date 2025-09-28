import { IsOptional, IsInt, Min, IsArray, IsString } from "class-validator"
import { Field, InputType, Int } from "type-graphql"
import { BookFormat } from "../../../types/types"

/**
 * Represents the input parameters for querying all books.
 * This input is used to filter, sort, and paginate all books in the app collection.
 *
 * @description
 * This input type defines the filters, sorting, and pagination options
 * for retrieving a paginated list of books.
 *
 * - `search`: filter books by keyword (matches the book title, isbn or author).
 * - `categoryIds`: filter books by one or more category IDs.
 * - `format`: filter books by their format
 * - `language`: filter books by their language
 * - `page`: page number for paginated results (default is typically 1).
 * - `limit`: maximum number of results per page (default can be 10–20).
 *
 * The decorators used are:
 * - `@Field({ nullable: true })`: exposes each property to the GraphQL schema as optional.
 * - `@IsOptional()`: marks each field as optional during validation (class-validator).
 */
@InputType()
export class BooksQueryInput {
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
