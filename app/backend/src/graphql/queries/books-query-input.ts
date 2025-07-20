import { IsOptional, IsInt, Min, IsArray } from "class-validator"
import { Field, InputType, Int } from "type-graphql"

/**
 * Represents the input parameters for querying all books.
 *
 * @description
 * This input type defines the filters, sorting, and pagination options
 * for retrieving a paginated list of books.
 *
 * - `search`: filter books by keyword (matches the book title).
 * - `categoryIds`: filter books by one or more category IDs.
 * - `sortBy`: define the field by which to sort the results.
 *             Common options might include: title, publishedDate, or pageCount.
 * - `order`: define the sorting order (ascending or descending).
 * - `page`: page number for paginated results (default is typically 1).
 * - `limit`: maximum number of results per page (default can be 10–20).
 *
 * All fields are optional to allow flexible querying.
 */
@InputType()
export class AllBooksQueryInput {
	@Field({ nullable: true })
	@IsOptional()
	search?: string

	@Field(() => [Int], { nullable: true })
	@IsOptional()
	@IsArray()
	@IsInt({ each: true })
	categoryIds?: number[]

	@Field({ nullable: true })
	@IsOptional()
	sortBy?: "estimatedDuration" | "availableDuration"

	@Field({ nullable: true })
	@IsOptional()
	order?: "ASC" | "DESC"

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
