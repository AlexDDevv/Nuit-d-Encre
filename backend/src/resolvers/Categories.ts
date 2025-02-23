import {
    Arg,
    Mutation,
    Query,
    Resolver,
    ID,
    Authorized,
    Ctx,
} from "type-graphql";
import {
    Category,
    createCategoryInput,
    updateCategoryInput,
} from "../entities/Category";
import { AuthContextType } from "../auth";
import { validate } from "class-validator";

@Resolver()
export class CategoriesResolver {
    @Query(() => [Category])
    async categories(): Promise<Category[]> {
        const categorires = await Category.find({
            relations: {
                ads: true,
            },
        });
        return categorires;
    }

    @Query(() => Category, { nullable: true })
    async category(@Arg("id", () => ID) id: number): Promise<Category | null> {
        const category = await Category.findOne({
            where: { id },
            relations: {
                ads: {
                    category: true,
                    tags: true,
                },
            },
        });

        if (category) {
            return category;
        } else {
            return null;
        }
    }

    @Authorized("admin")
    @Mutation(() => Category)
    async createCategory(
        @Arg("data", () => createCategoryInput) data: createCategoryInput,
        @Ctx() context: AuthContextType
    ): Promise<Category> {
        const errors = await validate(data);

        if (errors.length > 0) {
            throw new Error(`Validation error: ${JSON.stringify(errors)}`);
        }

        const newCategory = new Category();
        const user = context.user;

        Object.assign(newCategory, data, { createdBy: user });
        await newCategory.save();
        return newCategory;
    }

    @Authorized("admin")
    @Mutation(() => Category, { nullable: true })
    async updateCategory(
        @Arg("id", () => ID) id: number,
        @Arg("data", () => updateCategoryInput) data: updateCategoryInput,
        @Ctx() context: AuthContextType
    ): Promise<Category | null> {
        const errors = await validate(data);

        if (errors.length > 0) {
            throw new Error(`Validation error: ${JSON.stringify(errors)}`);
        }

        const category = await Category.findOneBy({
            id,
            createdBy: { id: context.user.id },
        });

        if (category !== null) {
            Object.assign(category, data);
            await category.save();
            return category;
        } else {
            return null;
        }
    }

    @Authorized("admin")
    @Mutation(() => Category, { nullable: true })
    async deleteCategory(
        @Arg("id", () => ID) id: number,
        @Ctx() context: AuthContextType
    ): Promise<Category | null> {
        const category = await Category.findOneBy({
            id,
            createdBy: { id: context.user.id },
        });

        if (category !== null) {
            await category.remove();
            category.id = id;
            return category;
        } else {
            return null;
        }
    }
}
