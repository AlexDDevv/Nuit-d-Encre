import { Length, IsIn, IsOptional, IsInt, Min, Max } from "class-validator"
import { Field, ID, InputType } from "type-graphql"

/**
 * Represents input data for updating an existing book.
 * All fields are optional, allowing partial updates.
 *
 * @description
 * Fields follow the same validation rules as CreateBookInput,
 * but are marked optional to support partial updates.
 */
@InputType()
export class UpdateBookInput {
    @Field(() => ID)
    id!: number

    @Field({ nullable: true })
    @Length(1, 255, { message: "Title must be between 1 and 255 characters" })
    @IsOptional()
    title?: string

    @Field({ nullable: true })
    @Length(1, 5000, { message: "Summary must be between 1 and 5000 characters" })
    @IsOptional()
    summary?: string

    @Field({ nullable: true })
    @Length(1, 255, { message: "Author name must be between 1 and 255 characters" })
    @IsOptional()
    author?: string

    @Field({ nullable: true })
    @Length(10, 10, { message: "ISBN-10 must be exactly 10 characters" })
    @IsOptional()
    isbn10?: string

    @Field({ nullable: true })
    @Length(13, 13, { message: "ISBN-13 must be exactly 13 characters" })
    @IsOptional()
    isbn13?: string

    @Field({ nullable: true })
    @IsInt({ message: "Page count must be an integer" })
    @Min(1, { message: "Page count must be at least 1" })
    @IsOptional()
    pageCount?: number

    @Field({ nullable: true })
    @IsInt({ message: "Published year must be a number" })
    @Min(1000)
    @Max(9999)
    @IsOptional()
    publishedYear?: number

    @Field({ nullable: true })
    @Length(1, 5, { message: "Language must be between 1 and 5 characters" })
    @IsOptional()
    language?: string

    @Field({ nullable: true })
    @Length(1, 255, { message: "Publisher name must be between 1 and 255 characters" })
    @IsOptional()
    publisher?: string

    @Field({ nullable: true })
    @IsIn(["hardcover", "paperback", "softcover"], {
        message: "Format must be one of: hardcover, paperback, softcover",
    })
    @IsOptional()
    format?: string

    @Field(() => ID, { nullable: true })
    @IsOptional()
    category?: number
}
