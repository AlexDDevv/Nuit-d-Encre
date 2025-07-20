import { Length, IsIn, IsOptional, IsDateString, IsInt, Min } from "class-validator"
import { Field, ID, InputType } from "type-graphql"

/**
 * Represents input data for creating a new book.
 * This class is used to validate the book data before storing it in the database.
 *
 * @description
 * - `title`: title of the book, must be between 1 and 255 characters.
 * - `description`: summary or context about the book, between 1 and 5000 characters.
 * - `author`: name of the book's author, between 1 and 255 characters.
 * - `isbn10`: optional 10-character ISBN code.
 * - `isbn13`: required 13-character ISBN code.
 * - `pageCount`: optional number of pages, must be a positive integer if provided.
 * - `publishedDate`: optional publication date in ISO format.
 * - `language`: optional language of the book (e.g., "en", "fr"), max 100 characters.
 * - `publisher`: optional name of the publishing house, max 255 characters.
 * - `format`: required physical format of the book (must be one of: hardcover, paperback, softcover).
 * - `category`: category ID the book belongs to.
 * 
 * The class uses the following decorators:
 * - `@Field()`: Exposes the property in the GraphQL schema (via type-graphql).
 * - `@Length()`: Validates string length.
 * - `@IsIn()`: Ensures the value is within a set of allowed values.
 * - `@IsOptional()`: Marks the field as optional during validation.
 * - `@IsInt()` and `@Min()`: Ensure numeric fields are valid integers and not negative.
 * - `@IsDateString()`: Ensures the value is a valid date string.
 */
@InputType()
export class CreateBookInput {
    @Field()
    @Length(1, 255, { message: "Title must be between 1 and 255 characters" })
    title!: string

    @Field()
    @Length(1, 5000, { message: "Description must be between 1 and 5000 characters" })
    description!: string

    @Field()
    @Length(1, 255, { message: "Author name must be between 1 and 255 characters" })
    author!: string

    @Field({ nullable: true })
    @Length(10, 10, { message: "ISBN-10 must be exactly 10 characters" })
    @IsOptional()
    isbn10?: string

    @Field()
    @Length(13, 13, { message: "ISBN-13 must be exactly 13 characters" })
    isbn13!: string

    @Field()
    @IsInt({ message: "Page count must be an integer" })
    @Min(1, { message: "Page count must be at least 1" })
    pageCount!: number

    @Field()
    @IsDateString({}, { message: "Published date must be a valid date string (ISO format)" })
    publishedDate!: string

    @Field()
    @Length(1, 100, { message: "Language must be between 1 and 100 characters" })
    language!: string

    @Field()
    @Length(1, 255, { message: "Publisher name must be between 1 and 255 characters" })
    @IsOptional()
    publisher!: string

    @Field()
    @IsIn(["hardcover", "paperback", "softcover"], {
        message: "Format must be one of: hardcover, paperback, softcover",
    })
    format!: string

    @Field(() => ID)
    category!: number
}
