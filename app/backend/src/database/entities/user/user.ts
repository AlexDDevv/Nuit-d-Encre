import { Field, ID, ObjectType } from "type-graphql";
import {
    BaseEntity,
    Column,
    Entity,
    OneToMany,
    PrimaryGeneratedColumn,
} from "typeorm";
import { Roles, UserRole } from "../../../types/types";
import { Book } from "../book/book";
import { UserActions } from "./user-actions";
import { Author } from "../author/author";

/**
 * Represents a user entity in the database.
 * @param name is the entity's name in database.
 * This class defines the structure of the user entity in database:
 * - `id`: unique identifier for the user.
 * - `email`: user's email address (unique).
 * - `hashedPassword`: the user's password stored in a hashed format (not exposed via GraphQL).
 * - `userName`: the user's name.
 * - `role`: the user's role (defaults to `Roles.User`).
 * - `books`: list of books created by the user (relation to the `Book` entity).
 * - `level`: level reached by the user.
 * - `xp`: user experience earned by actions.
 * - `actions`: actions that allow the user to gain experience.
 * - `createdAt`: timestamp of when the user was created.
 * - `updatedAt`: timestamp of when the user was last updated.
 *
 * The class also leverages the following decorators:
 * - `@Column()`: Tells TypeORM to store the property in the database.
 * - `@Field()`: Exposes the property in the GraphQL schema (via type-graphql).
 *
 * For `createdAt` and `updatedAt`, the timestamps are automatically set by the database.
 */
@ObjectType()
@Entity({ name: "user" })
export class User extends BaseEntity {
    @Field(() => ID)
    @PrimaryGeneratedColumn()
    id!: number;

    @Field()
    @Column({ length: 254, unique: true })
    email!: string;

    @Column({ length: 255 })
    hashedPassword!: string;

    @Field()
    @Column({ length: 100 })
    userName!: string;

    @Field()
    @Column({
        type: "enum",
        enum: Roles,
        default: Roles.User,
    })
    role!: UserRole;

    @Field(() => [Book])
    @OneToMany(() => Book, (book) => book.user)
    books!: Book[];

    @Field(() => [Author])
    @OneToMany(() => Author, (author) => author.user)
    authors!: Author[];

    @Field()
    @Column()
    level!: number;

    @Field()
    @Column()
    xp!: number;

    @Field(() => [UserActions])
    @OneToMany(() => UserActions, (action) => action.user)
    actions!: UserActions[];

    @Field()
    @Column({ default: () => "CURRENT_TIMESTAMP" })
    createdAt!: Date;

    @Field()
    @Column({
        default: () => "CURRENT_TIMESTAMP",
        onUpdate: "CURRENT_TIMESTAMP",
    })
    updatedAt!: Date;
}

@ObjectType()
export class LogInResponse {
    @Field()
    message!: string;

    @Field(() => Boolean)
    cookieSet!: boolean;
}
