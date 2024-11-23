import { Arg, Mutation, Query, Resolver, ID } from "type-graphql";
import {
    Category,
    createCategoryInput,
    updateCategoryInput,
} from "../entities/Category";

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

    @Mutation(() => Category)
    async createCategory(
        @Arg("data", () => createCategoryInput) data: createCategoryInput
    ): Promise<Category> {
        const newCategory = new Category();
        Object.assign(newCategory, data);
        await newCategory.save();
        return newCategory;
    }

    @Mutation(() => Category, { nullable: true })
    async deleteCategory(
        @Arg("id", () => ID) id: number
    ): Promise<Category | null> {
        const category = await Category.findOneBy({ id });
        if (category !== null) {
            await category.remove();
            return category;
        } else {
            return null;
        }
    }

    @Mutation(() => Category, { nullable: true })
    async updateCategory(
        @Arg("id", () => ID) id: number,
        @Arg("data", () => updateCategoryInput) data: updateCategoryInput
    ): Promise<Category | null> {
        const category = await Category.findOneBy({ id });
        if (category !== null) {
            Object.assign(category, data);
            await category.save();
            return category;
        } else {
            return null;
        }
    }
}
