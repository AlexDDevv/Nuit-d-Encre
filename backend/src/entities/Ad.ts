import { IsEmail, IsUrl, Length, Max, Min } from "class-validator";
import {
    BaseEntity,
    Column,
    CreateDateColumn,
    Entity,
    JoinTable,
    ManyToMany,
    ManyToOne,
    PrimaryGeneratedColumn,
} from "typeorm";
import { Category } from "./Category";
import { Tag } from "./Tag";
import { Field, ID, Float, ObjectType, InputType } from "type-graphql";
import { IdInput } from "./Id";
import { User } from "./User";

@Entity()
@ObjectType()
export class Ad extends BaseEntity {
    @PrimaryGeneratedColumn()
    @Field(() => ID)
    id!: number;

    @Column()
    @Length(10, 100, { message: "Title must be between 10 and 100 chars" })
    @Field()
    title!: string;

    @Column()
    @Field()
    description!: string;

    @Column()
    @Field()
    location!: string;

    @Column()
    @IsEmail()
    @Field()
    owner!: string;

    @Column()
    @Min(0, { message: "Price must be positive" })
    @Max(1000000, { message: "Price must be lower than 1000000 cents" })
    @Field(() => Float)
    price!: number;

    @Column("json")
    @IsUrl({}, { each: true })
    @Field(() => [String])
    picture!: string[];

    @CreateDateColumn()
    @Field()
    createdAt!: Date;

    @ManyToOne(() => User)
    @Field(() => User, { nullable: true })
    createdBy: User;

    @ManyToOne(() => Category, (category) => category.ads)
    @Field(() => Category, { nullable: true })
    category!: Category;

    @ManyToMany(() => Tag, (tag) => tag.ads)
    @JoinTable()
    @Field(() => [Tag], { nullable: true })
    tags!: Tag[];
}

@InputType()
export class createAdInput {
    @Length(10, 100, { message: "Title must be between 10 and 100 chars" })
    @Field()
    title!: string;

    @Field()
    description!: string;

    @Field()
    location!: string;

    @IsEmail()
    @Field()
    owner!: string;

    @Min(0, { message: "Price must be positive" })
    @Max(1000000, { message: "Price must be lower than 1000000 cents" })
    @Field(() => Float)
    price!: number;

    @IsUrl({}, { each: true })
    @Field(() => [String])
    picture!: string[];

    @Field(() => IdInput, { nullable: true })
    category!: IdInput;

    @Field(() => [IdInput], { nullable: true })
    tags!: IdInput[];
}

@InputType()
export class updateAdInput {
    @Field(() => IdInput, { nullable: true })
    category!: IdInput;

    @Field(() => [IdInput], { nullable: true })
    tags!: IdInput[];

    @Length(10, 100, { message: "Title must be between 10 and 100 chars" })
    @Field({ nullable: true })
    title!: string;

    @Field({ nullable: true })
    description!: string;

    @Field({ nullable: true })
    location!: string;

    @IsEmail()
    @Field({ nullable: true })
    owner!: string;

    @Min(0, { message: "Price must be positive" })
    @Max(1000000, { message: "Price must be lower than 1000000 cents" })
    @Field(() => Float, { nullable: true })
    price!: number;

    @IsUrl({}, { each: true })
    @Field(() => [String], { nullable: true })
    picture!: string[];
}
