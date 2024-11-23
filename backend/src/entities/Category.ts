import {
    BaseEntity,
    Column,
    Entity,
    OneToMany,
    PrimaryGeneratedColumn,
} from "typeorm";
import { Length } from "class-validator";
import { Ad } from "./Ad";
import { Field, ID, InputType, ObjectType } from "type-graphql";

@Entity()
@ObjectType()
export class Category extends BaseEntity {
    @PrimaryGeneratedColumn()
    @Field(() => ID)
    id!: number;

    @Column()
    @Length(2, 50, {
        message:
            "Le nom de la catégorie doit être compris en 2 et 50 caractères.",
    })
    @Field()
    name!: string;

    @OneToMany(() => Ad, (ad) => ad.category)
    @Field(() => [Ad])
    ads!: Ad[];
}

@InputType()
export class createCategoryInput {
    @Length(2, 50, {
        message:
            "Le nom de la catégorie doit être compris en 2 et 50 caractères.",
    })
    @Field()
    name!: string;
}

@InputType()
export class updateCategoryInput {
    @Length(2, 50, {
        message:
            "Le nom de la catégorie doit être compris en 2 et 50 caractères.",
    })
    @Field({ nullable: true })
    name!: string;
}
