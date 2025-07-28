import { Field, ObjectType } from "type-graphql";
import { BaseEntity, Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./user";

/**
 * Represents a user action that grants experience points (XP) to the user.
 * @param name is the entity's name in the database.
 * This class defines the structure of the user actions stored in the database:
 * - `id`: unique identifier for the action.
 * - `user`: the user who performed the action (relation to the `User` entity).
 * - `type`: type of action performed (e.g., BOOK_ADDED, AUTHOR_ADDED).
 * - `xp`: amount of experience points earned from the action.
 * - `createdAt`: timestamp of when the action was performed.
 * - `targetId`: optional identifier of the related entity (e.g., book or author ID).
 * - `metadata`: optional serialized data to describe the action (e.g., book title).
 *
 * This entity enables:
 * - Tracking of all XP-related user activities.
 * - Auditing user progression and gamification logic.
 * - Generating user stats, badges, and progress history.
 *
 * The class leverages the following decorators:
 * - `@Entity()`: Marks the class as a TypeORM entity.
 * - `@PrimaryGeneratedColumn()`: Generates a unique primary key for each action.
 * - `@ManyToOne()`: Defines a many-to-one relationship with the `User` entity.
 * - `@Column()`: Tells TypeORM to persist the property in the database.
 * - `@Field()`: Exposes the property in the GraphQL schema (via type-graphql).
 */
@ObjectType()
@Entity()
export class UserActions extends BaseEntity {
    @PrimaryGeneratedColumn()
    id!: string;

    @ManyToOne(() => User, user => user.actions)
    user!: User;

    @Field()
    @Column()
    type!: string;

    @Field()
    @Column()
    xp!: number;

    @Field()
    @Column({ default: () => "CURRENT_TIMESTAMP" })
    createdAt!: Date;

    @Field({ nullable: true })
    @Column({ nullable: true })
    targetId?: string;

    @Field({ nullable: true })
    @Column({ nullable: true })
    metadata?: string;
}
