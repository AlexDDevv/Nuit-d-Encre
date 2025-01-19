import {
    BaseEntity,
    Column,
    CreateDateColumn,
    Entity,
    ManyToMany,
    ManyToOne,
    PrimaryGeneratedColumn,
} from "typeorm";
import { Length } from "class-validator";
import { Ad } from "./Ad";
import { Field, ID, InputType, ObjectType } from "type-graphql";
import { User } from "./User";

@Entity()
@ObjectType()
export class Tag extends BaseEntity {
    @PrimaryGeneratedColumn()
    @Field(() => ID)
    id!: number;

    @Column()
    @Length(2, 50, {
        message: "Le nom du tag doit être compris en 2 et 50 caractères.",
    })
    @Field()
    name!: string;

    @ManyToMany(() => Ad, (ad) => ad.tags)
    @Field(() => [Ad], { nullable: true })
    ads!: Ad[];

    @CreateDateColumn()
    @Field()
    createdAt!: Date;

    @ManyToOne(() => User)
    @Field(() => User, { nullable: true })
    createdBy: User;
}

@InputType()
export class createTagInput {
    @Length(2, 50, {
        message: "Le nom du tag doit être compris en 2 et 50 caractères.",
    })
    @Field()
    name!: string;
}

@InputType()
export class updateTagInput {
    @Length(2, 50, {
        message: "Le nom du tag doit être compris en 2 et 50 caractères.",
    })
    @Field({ nullable: true })
    name!: string;
}
