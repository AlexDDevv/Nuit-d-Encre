import {
    Field,
    Int,
    ObjectType,
} from "type-graphql";
import { UserBook } from "../../../database/entities/user/user-book";

@ObjectType()
export class UserBooksResult {
    @Field(() => [UserBook])
    entries!: UserBook[];

    @Field(() => Int)
    totalCount!: number;

    @Field(() => Int)
    totalCountAll!: number;

    @Field(() => Int, { nullable: true })
    page?: number;

    @Field(() => Int, { nullable: true })
    limit?: number;
}