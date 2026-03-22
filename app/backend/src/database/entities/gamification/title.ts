import { Field, ID, ObjectType } from "type-graphql";
import {
    BaseEntity,
    Column,
    Entity,
    PrimaryGeneratedColumn,
} from "typeorm";

@ObjectType()
@Entity({ name: "title" })
export class Title extends BaseEntity {
    @Field(() => ID)
    @PrimaryGeneratedColumn()
    id!: number;

    @Field()
    @Column({ type: "varchar", length: 100 })
    label!: string;

    @Field()
    @Column({ type: "int" })
    minLevel!: number;

    @Field()
    @Column({ type: "varchar", length: 100 })
    iconKey!: string;

    @Field({ nullable: true })
    @Column({ type: "varchar", length: 100, nullable: true })
    ornamentKey?: string | null;
}
