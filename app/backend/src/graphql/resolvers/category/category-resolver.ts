/**
 * @packageDocumentation
 * @category Resolvers
 * @description
 * This module provides GraphQL resolvers for book category-related operations.
 * It handles book category creation, retrieval, update, and deletion.
 */

import {
	Arg,
	Authorized,
	Ctx,
	ID,
	Mutation,
	Query,
	Resolver,
} from "type-graphql"
import { Context, Roles } from "../../../types/types"
import { AppError } from "../../../middlewares/error-handler"
import { Category } from "../../../database/entities/category/category"
import { CreateCategoryInput } from "../../inputs/create/category/create-category-input"
import { UpdateCategoryInput } from "../../inputs/update/category/update-category-input"

/**
 * CategoryResolver
 * @description
 * Handles all book category-related GraphQL mutations and queries.
 */
@Resolver(Category)
export class CategoryResolver {
	/**
	 * Query to get all book categories.
	 *
	 * @returns A Promise that resolves to an array of Category objects.
	 *
	 * This query retrieves all book categories, including their associated books.
	 */
	@Query(() => [Category])
	async categories(): Promise<Category[]> {
		try {
			const categories = await Category.find({
				relations: {
					books: true,
					createdBy: true,
				},
			})

			if (!categories) {
				throw new AppError("Categories not found", 404, "NotFoundError")
			}

			return categories
		} catch (error) {
			throw new AppError(
				"Failed to fetch categories",
				500,
				"InternalServerError"
			)
		}
	}

	/**
	 * Query to get a specific book category by ID.
	 *
	 * @param id - The ID of the category to fetch.
	 *
	 * @returns A Promise that resolves to a Category object if found, or null if no category is found.
	 *
	 * This query retrieves a specific book category by its ID, along with its associated books.
	 */
	@Query(() => Category, { nullable: true })
	async category(@Arg("id") id: number): Promise<Category | null> {
		try {
			const category = await Category.findOne({
				where: { id },
				relations: {
					books: true,
					createdBy: true,
				},
			})

			if (!category) {
				throw new AppError("Category not found", 404, "NotFoundError")
			}

			return category
		} catch (error) {
			throw new AppError(
				"Failed to fetch category",
				500,
				"InternalServerError"
			)
		}
	}

	/**
	 * Mutation to create a new book category.
	 *
	 * @param data - The input data containing the category name.
	 * @param context - The context object that contains the currently authenticated user.
	 *
	 * @returns A Promise that resolves to the newly created Category object.
	 *
	 * This mutation allows an admin user to create a new book category. The category will be associated with the admin user.
	 */
	@Authorized(Roles.Admin)
	@Mutation(() => Category)
	async createCategory(
		@Arg("data", () => CreateCategoryInput)
		data: CreateCategoryInput,
		@Ctx() context: Context
	): Promise<Category> {
		try {
			const newCategory = new Category()
			const user = context.user

			if (!user) {
				throw new AppError("User not found", 404, "NotFoundError")
			}

			if (user.role !== "admin") {
				throw new AppError(
					"You are not allowed to create category",
					401,
					"UnauthorizedError"
				)
			}

			Object.assign(newCategory, data, { createdBy: user })

			await newCategory.save()
			return newCategory
		} catch (error) {
			throw new AppError(
				"Failed to create category",
				500,
				"InternalServerError"
			)
		}
	}

	/**
	 * Mutation to update an existing book category.
	 *
	 * @param id - The ID of the category to update.
	 * @param data - The input data containing the updated category name.
	 * @param context - The context object that contains the currently authenticated user.
	 *
	 * @returns A Promise that resolves to the updated Category object, or null if the category could not be found or updated.
	 *
	 * This mutation allows an admin user to update an existing book category. Only the admin who created the category can update it.
	 */
	@Authorized(Roles.Admin)
	@Mutation(() => Category, { nullable: true })
	async updateCategory(
		@Arg("id", () => ID) id: number,
		@Arg("data", () => UpdateCategoryInput)
		data: UpdateCategoryInput,
		@Ctx() context: Context
	): Promise<Category | null> {
		try {
			const user = context.user

			if (!user) {
				throw new AppError("User not found", 404, "NotFoundError")
			}

			if (user.role !== "admin") {
				throw new AppError(
					"You are not allowed to modify category",
					401,
					"UnauthorizedError"
				)
			}

			const category = await Category.findOneBy({
				id,
				createdBy: { id: user.id },
			})

			if (category !== null) {
				Object.assign(category, data)
				await category.save()
			}

			return category
		} catch (error) {
			throw new AppError(
				"Failed to update category",
				500,
				"InternalServerError"
			)
		}
	}

	/**
	 * Mutation to delete an existing book category.
	 *
	 * @param id - The ID of the category to delete.
	 * @param context - The context object that contains the currently authenticated user.
	 *
	 * @returns A Promise that resolves to the deleted Category object, or null if the category could not be found or deleted.
	 *
	 * This mutation allows an admin user to delete an existing book category. Only the admin who created the category can delete it.
	 */
	@Authorized(Roles.Admin)
	@Mutation(() => Category, { nullable: true })
	async deleteCategory(
		@Arg("id", () => ID) id: number,
		@Ctx() context: Context
	): Promise<Category | null> {
		try {
			const user = context.user

			if (!user) {
				throw new AppError("User not found", 404, "NotFoundError")
			}

			if (user.role !== "admin") {
				throw new AppError(
					"You are not allowed to delete category",
					401,
					"UnauthorizedError"
				)
			}

			const category = await Category.findOneBy({
				id,
				createdBy: { id: user.id },
			})

			if (category !== null) {
				await category.remove()
				category.id = id
			}

			return category
		} catch (error) {
			throw new AppError(
				"Failed to delete category",
				500,
				"InternalServerError"
			)
		}
	}
}
