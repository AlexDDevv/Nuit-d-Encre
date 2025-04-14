import { IsEmail } from "class-validator";
import {
    BaseEntity,
    Column,
    CreateDateColumn,
    Entity,
    PrimaryGeneratedColumn,
} from "typeorm";
import { Field, ID, ObjectType } from "type-graphql";

/**
 * Represents a user entity in the database.
 * @param name is the entity's name in the database.
 * This class defines the structure of the user entity in database:
 * - `id`: unique identifier for the user.
 * - `email`: unique email address used for login and identification.
 * - `hashedPassword`: securely stored hashed password of the user (not exposed in GraphQL).
 * - `role`: role assigned to the user (`user` or `admin`), default is `user`.
 * - `createdAt`: timestamp of when the user was created.
 *
 * The class also leverages the following decorators:
 * - `@Column()`: tells TypeORM to store the property in the database.
 * - `@Field()`: exposes the property in the GraphQL schema (via type-graphql).
 *
 * Password is stored internally as `hashedPassword` and is not exposed directly in the GraphQL schema.
 */

@Entity()
@ObjectType()
export class User extends BaseEntity {
    @PrimaryGeneratedColumn()
    @Field(() => ID)
    id: number;

    @Column({ unique: true })
    @IsEmail({}, { message: "Email must be an email" })
    @Field()
    email: string;

    @Column()
    hashedPassword: string;

    @Column({ enum: ["user", "admin"], default: "user" })
    @Field()
    role: string;

    @CreateDateColumn()
    @Field()
    createdAt: Date;
}
