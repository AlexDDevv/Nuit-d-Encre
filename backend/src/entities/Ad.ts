import {
    IsBase64,
    IsEmail,
    Length,
    Max,
    Min,
    ValidateBy,
    ValidationOptions,
} from "class-validator";
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

const isValidUrl = (str: string) => {
    try {
        new URL(str);
        return true;
    } catch {
        return false;
    }
};

const isValidDataUri = (str: string) => {
    return str.startsWith("data:image/") && str.includes(";base64,");
};

const IsUrlOrBase64 = (validationOptions?: ValidationOptions) => {
    return ValidateBy({
        name: "isUrlOrBase64",
        validator: {
            validate: (value: string) =>
                isValidUrl(value) || isValidDataUri(value),
            defaultMessage: () =>
                "Each picture must be either a valid URL or a valid base64 image",
        },
        ...validationOptions,
    });
};

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
    @Length(20, 5000, {
        message: "Description must be between 20 and 1800 chars",
    })
    @Field()
    description!: string;

    @Column()
    @Length(3, 255, { message: "Location must be between 3 and 255 chars" })
    @Field()
    location!: string;

    @Column()
    @IsEmail({}, { message: "Invalid email format" })
    @Field()
    owner!: string;

    @Column()
    @Min(0, { message: "Price must be positive" })
    @Max(1000000, { message: "Price must be lower than 1000000 euros" })
    @Field(() => Float)
    price!: number;

    @Column("json")
    @IsUrlOrBase64({ each: true, message: "Each picture must be a valid URL" })
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

    @Length(20, 5000, {
        message: "Description must be between 20 and 1800 chars",
    })
    @Field()
    description!: string;

    @Length(3, 255, { message: "Location must be between 3 and 255 chars" })
    @Field()
    location!: string;

    @IsEmail({}, { message: "Invalid email format" })
    @Field()
    owner!: string;

    @Min(0, { message: "Price must be positive" })
    @Max(1000000, { message: "Price must be lower than 1000000 cents" })
    @Field(() => Float)
    price!: number;

    @Column("json")
    @IsUrlOrBase64({ each: true, message: "Each picture must be a valid URL" })
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

    @Length(20, 1800, {
        message: "Description must be between 20 and 1800 chars",
    })
    @Field({ nullable: true })
    description!: string;

    @Length(3, 255, { message: "Location must be between 3 and 255 chars" })
    @Field({ nullable: true })
    location!: string;

    @IsEmail({}, { message: "Invalid email format" })
    @Field({ nullable: true })
    owner!: string;

    @Min(0, { message: "Price must be positive" })
    @Max(1000000, { message: "Price must be lower than 1000000 cents" })
    @Field(() => Float, { nullable: true })
    price!: number;

    @Column("json")
    @IsUrlOrBase64({ each: true, message: "Each picture must be a valid URL" })
    @Field(() => [String])
    picture!: string[];
}
