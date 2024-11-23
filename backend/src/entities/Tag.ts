import {
    BaseEntity,
    Column,
    Entity,
    ManyToMany,
    PrimaryGeneratedColumn,
} from "typeorm";
import { Length } from "class-validator";
import { Ad } from "./Ad";
import { Field, ID, InputType, ObjectType } from "type-graphql";

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
