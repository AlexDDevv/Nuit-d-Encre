import { IsOptional } from "class-validator"
import { Field, InputType } from "type-graphql"
import { BookFormat } from "../../types/types"

/**
 * Represents the input parameters for querying books owned by the authenticated user.
 * This input is used to filter, sort, and paginate the user's personal book collection.
 *
 * @description
 * - `search`: optional string to filter books by keyword (typically matched against the title).
 * - `sortBy`: defines the sorting criteria (currently supports sorting by creation date).
 * - `order`: defines the sorting order — ascending (`ASC`) or descending (`DESC`).
 * - `status`: optional list of book formats (`BookFormat[]`) to filter by format
 *             (e.g., "hardcover", "paperback", "softcover").
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
	@Field({ nullable: true })
	@IsOptional()
	search?: string

	@Field({ nullable: true })
	@IsOptional()
	sortBy?: "createdAt"

	@Field({ nullable: true })
	@IsOptional()
	order?: "ASC" | "DESC"

	@Field(() => [String], { nullable: true })
	@IsOptional()
	status?: BookFormat[]

	@Field({ nullable: true })
	@IsOptional()
	page?: number

	@Field({ nullable: true })
	@IsOptional()
	limit?: number
}
