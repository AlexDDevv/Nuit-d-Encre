import { IsEmail, IsStrongPassword } from "class-validator";
import {
    BaseEntity,
    Column,
    CreateDateColumn,
    Entity,
    PrimaryGeneratedColumn,
} from "typeorm";
import { Field, ID, ObjectType, InputType } from "type-graphql";

@Entity()
@ObjectType()
export class User extends BaseEntity {
    @PrimaryGeneratedColumn()
    @Field(() => ID)
    id: number;

    @Column({ unique: true })
    @IsEmail()
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

@InputType()
export class createUserInput {
    @IsEmail()
    @Field()
    email!: string;

    @Field()
    @IsStrongPassword(
        { minLength: 10, minNumbers: 1, minSymbols: 1, minUppercase: 1 },
        {
            message:
                "Password must be at least 10 characters long and include 1 number, 1 uppercase letter, and 1 symbol",
        }
    )
    password!: string;
}
