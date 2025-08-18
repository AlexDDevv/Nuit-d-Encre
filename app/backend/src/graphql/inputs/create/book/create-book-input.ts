import { Length, IsIn, IsOptional, IsInt, Min, Max } from "class-validator"
import { Field, ID, InputType, Int } from "type-graphql"

/**
 * Represents input data for creating a new book.
 * This class is used to validate the book data before storing it in the database.
 *
 * @description
 * - `title`: title of the book, must be between 1 and 255 characters.
 * - `summary`: summary or context about the book, between 1 and 5000 characters.
 * - `author`: name of the book's author, between 1 and 255 characters.
 * - `isbn10`: optional 10-character ISBN code.
 * - `isbn13`: required 13-character ISBN code.
 * - `pageCount`: optional number of pages, must be a positive integer if provided.
 * - `publishedYear`: required publication year.
 * - `language`: required language of the book (e.g., "en", "fr"), max 100 characters.
 * - `publisher`: required name of the publishing house, max 255 characters.
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
    @Length(1, 5000, { message: "Summary must be between 1 and 5000 characters" })
    summary!: string

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

    @Field(() => Int)
    @IsInt({ message: "Page count must be an integer" })
    @Min(1, { message: "Page count must be at least 1" })
    pageCount!: number

    @Field(() => Int)
    @IsInt({ message: "Published year must be a number" })
    @Min(1000)
    @Max(9999)
    publishedYear!: number;

    @Field()
    @Length(1, 5, { message: "Language must be between 1 and 5 characters" })
    language!: string

    @Field()
    @Length(1, 255, { message: "Publisher name must be between 1 and 255 characters" })
    @IsOptional()
    publisher!: string

    @Field()
    @IsIn(["hardcover", "paperback", "softcover", "pocket"], {
        message: "Format must be one of: hardcover, paperback, softcover or pocket",
    })
    format!: string

    @Field(() => ID)
    category!: number
}
