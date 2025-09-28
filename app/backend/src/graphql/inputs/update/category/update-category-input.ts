import { Length } from "class-validator"
import { Field, InputType } from "type-graphql"

/**
 * Represents input data for updating an existing book category.
 * This class is used to validate the category data before updating it in the database.
 *
 * @description
 * - `name`: The name of the book category (must be between 1 and 100 characters).
 *
 * The class uses the following decorators:
 * - `@Field()`: Exposes the property in the GraphQL schema (via type-graphql).
 * - `@Length()`: Ensures the string length is within the specified bounds.
 */
@InputType()
export class UpdateCategoryInput {
	@Field()
	@Length(1, 100, { message: "Category name must be between 1 and 100 characters" })
	name!: string
}
