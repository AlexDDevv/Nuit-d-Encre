/**
 * @packageDocumentation
 * @category GraphQL Inputs
 * @description
 * This module defines the GraphQL input type used to update a UserBook entry.
 * It supports partial updates of reading status, rating/review, recommendation,
 * reading dates, and visibility. The target entry can be identified by `id`
 * or, alternatively, by `bookId` (unique per user).
 */

import { Field, ID, Int, InputType } from "type-graphql";
import {
  IsBoolean,
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  Max,
  MaxLength,
  Min,
  Validate,
  IsDate,
} from "class-validator";
import { ReadingStatus } from "../../../../types/types";
import { EndAfterStart } from "../../../helpers/endAfterStart";

/**
 * UpdateUserBookInput
 * @description
 * Represents the payload to update an existing user-book relationship.
 *
 * Identification:
 * - `id` (preferred) or `bookId` (unique per user). One of them is required.
 *
 * Updatable fields (all optional):
 * - `status`: reading status.
 * - `rating`: integer rating (0–5).
 * - `review`: free-form textual review.
 * - `recommended`: whether the user recommends the book.
 * - `startedAt`: reading start date.
 * - `finishedAt`: reading finish date (must be >= startedAt if both provided).
 * - `isPublic`: visibility flag.
 *
 * Notes:
 * - The user is inferred from the authenticated context on the server.
 * - If both `id` and `bookId` are provided, the resolver may prioritize `id`.
 *
 * @example
 * ```graphql
 * mutation UpdateEntry($input: UpdateUserBookInput!) {
 *   updateUserBook(input: $input) {
 *     id
 *     status
 *     rating
 *     review
 *     recommended
 *     startedAt
 *     finishedAt
 *     isPublic
 *   }
 * }
 *
 * # Variables
 * {
 *   "input": {
 *     "bookId": 42,
 *     "status": "PAUSED",
 *     "rating": 4,
 *     "isPublic": false
 *   }
 * }
 * ```
 */
@InputType()
export class UpdateUserBookInput {
  /** Target by UserBook primary key (preferred) */
  @Field(() => ID, { nullable: true })
  @IsOptional()
  @IsInt()
  @Min(1)
  id?: number;

  /** Alternative targeting by Book (unique per user) */
  @Field(() => ID, { nullable: true })
  @IsOptional()
  @IsInt()
  @Min(1)
  bookId?: number;

  /** Reading status */
  @Field(() => ReadingStatus, { nullable: true })
  @IsOptional()
  @IsEnum(ReadingStatus)
  status?: ReadingStatus;

  /** Rating (0–5) */
  @Field(() => Int, { nullable: true })
  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(5)
  rating?: number | null;

  /** Textual review */
  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  @MaxLength(10000)
  review?: string | null;

  /** Recommendation flag */
  @Field({ nullable: true })
  @IsOptional()
  @IsBoolean()
  recommended?: boolean;

  /** Visibility flag (public/private) */
  @Field({ nullable: true })
  @IsOptional()
  @IsBoolean()
  isPublic?: boolean;

  /** Reading start date */
  @Field({ nullable: true })
  @IsOptional()
  @IsDate()
  startedAt?: Date;

  /** Reading finish date (>= startedAt) */
  @Field({ nullable: true })
  @IsOptional()
  @IsDate()
  @Validate(EndAfterStart)
  finishedAt?: Date;
}
