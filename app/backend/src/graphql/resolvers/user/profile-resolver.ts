import {
    Arg,
    Authorized,
    Ctx,
    FieldResolver,
    ID,
    Int,
    Mutation,
    Query,
    Resolver,
    Root,
} from "type-graphql";
import { User } from "../../../database/entities/user/user";
import { UserBook } from "../../../database/entities/user/user-book";
import { Title } from "../../../database/entities/gamification/title";
import { AppError } from "../../../middlewares/error-handler";
import { Context, Roles } from "../../../types/types";

@Resolver(() => User)
export class ProfileResolver {
    @FieldResolver(() => String, { nullable: true })
    async email(
        @Root() user: User,
        @Ctx() context: Context,
    ): Promise<string | null> {
        const me = context.user;
        if (!me) return null;
        if (me.id === user.id || me.role === Roles.Admin) return user.email;
        return null;
    }

    @FieldResolver(() => Title, { nullable: true })
    async title(
        @Root() user: User,
        @Ctx() context: Context,
    ): Promise<Title | null> {
        return context.loaders.title.load(user.level);
    }

    @Query(() => User, { nullable: true })
    async getUserProfile(
        @Arg("id", () => ID) id: string
    ): Promise<User | null> {
        try {
            const user = await User.findOne({ where: { id } });
            if (!user) throw new AppError("User not found", 404, "NotFoundError");
            return user;
        } catch (error) {
            if (error instanceof AppError) throw error;
            throw new AppError("Failed to fetch user profile", 500, "InternalServerError");
        }
    }

    @Query(() => [UserBook])
    async getUserFavoriteBooks(
        @Arg("userId", () => ID) userId: string
    ): Promise<UserBook[]> {
        try {
            return UserBook.createQueryBuilder("userBook")
                .leftJoinAndSelect("userBook.user", "user")
                .leftJoinAndSelect("userBook.book", "book")
                .leftJoinAndSelect("book.author", "author")
                .leftJoinAndSelect("book.category", "category")
                .where("user.id = :userId", { userId })
                .andWhere("userBook.isFavorite = true")
                .orderBy("userBook.favoriteRank", "ASC")
                .getMany();
        } catch (error) {
            throw new AppError("Failed to fetch favorite books", 500, "InternalServerError");
        }
    }

    @Authorized()
    @Mutation(() => UserBook)
    async setFavoriteBook(
        @Arg("userBookId", () => ID) userBookId: string,
        @Arg("rank", () => Int) rank: number,
        @Ctx() context: Context
    ): Promise<UserBook> {
        try {
            const user = context.user;
            if (!user) throw new AppError("User not found", 404, "NotFoundError");

            if (rank < 1 || rank > 3) {
                throw new AppError("Le rang doit être entre 1 et 3", 400, "BadUserInput");
            }

            const userBook = await UserBook.findOne({
                where: { id: userBookId, user: { id: user.id } },
                relations: { user: true, book: { author: true, category: true } },
            });

            if (!userBook) {
                throw new AppError("User book not found", 404, "NotFoundError");
            }

            const existing = await UserBook.findOne({
                where: { user: { id: user.id }, isFavorite: true, favoriteRank: rank },
            });

            if (existing && existing.id !== userBookId) {
                existing.isFavorite = false;
                existing.favoriteRank = null;
                await existing.save();
            }

            userBook.isFavorite = true;
            userBook.favoriteRank = rank;
            await userBook.save();

            return userBook;
        } catch (error) {
            if (error instanceof AppError) throw error;
            throw new AppError("Failed to set favorite book", 500, "InternalServerError");
        }
    }

    @Authorized()
    @Mutation(() => UserBook)
    async removeFavoriteBook(
        @Arg("userBookId", () => ID) userBookId: string,
        @Ctx() context: Context
    ): Promise<UserBook> {
        try {
            const user = context.user;
            if (!user) throw new AppError("User not found", 404, "NotFoundError");

            const userBook = await UserBook.findOne({
                where: { id: userBookId, user: { id: user.id } },
                relations: { user: true, book: { author: true, category: true } },
            });

            if (!userBook) {
                throw new AppError("User book not found", 404, "NotFoundError");
            }

            userBook.isFavorite = false;
            userBook.favoriteRank = null;
            await userBook.save();

            return userBook;
        } catch (error) {
            if (error instanceof AppError) throw error;
            throw new AppError("Failed to remove favorite book", 500, "InternalServerError");
        }
    }
}
