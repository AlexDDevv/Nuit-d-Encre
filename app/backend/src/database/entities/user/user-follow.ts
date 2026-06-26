import { Field, ID, ObjectType } from "type-graphql";
import {
    BaseEntity,
    CreateDateColumn,
    Entity,
    ManyToOne,
    PrimaryGeneratedColumn,
    Unique,
} from "typeorm";
import { User } from "./user";

/**
 * Relation de suivi entre deux utilisateurs (follower → following).
 * Contrainte unique sur la paire pour empêcher les doublons ; le rejet
 * de l'auto-suivi est géré côté resolver.
 */
@ObjectType()
@Entity({ name: "user_follow" })
@Unique("UQ_user_follow_pair", ["follower", "following"])
export class UserFollow extends BaseEntity {
    @Field(() => ID)
    @PrimaryGeneratedColumn("uuid")
    id!: string;

    @ManyToOne(() => User, (user) => user.following, { onDelete: "CASCADE" })
    follower!: User;

    @ManyToOne(() => User, (user) => user.followers, { onDelete: "CASCADE" })
    following!: User;

    @Field()
    @CreateDateColumn()
    createdAt!: Date;
}
