import { Arg, Authorized, Ctx, ID, Mutation, Resolver } from "type-graphql";
import { BookReview } from "../../../database/entities/book/bookReview";
import { BookReviewComment } from "../../../database/entities/book/bookReviewComment";
import { AppError } from "../../../middlewares/error-handler";
import { Context } from "../../../types/types";
import { isOwnerOrAdmin } from "../../../utils/authorizations";
import { CreateBookReviewCommentInput } from "../../inputs/create/book/create-book-review-comment-input";

/**
 * Mutations create/delete pour les commentaires de critique. Liste plate,
 * pas d'édition (cf. spec `2026-07-01-review-comments-design.md`).
 */
@Resolver(BookReviewComment)
export class BookReviewCommentsResolver {
    @Authorized()
    @Mutation(() => BookReviewComment)
    async createBookReviewComment(
        @Arg("data", () => CreateBookReviewCommentInput)
        data: CreateBookReviewCommentInput,
        @Ctx() context: Context,
    ): Promise<BookReviewComment> {
        const user = context.user;
        if (!user) {
            throw new AppError("User not found", 404, "NotFoundError");
        }

        const content = data.content.trim();
        if (!content) {
            throw new AppError(
                "Le commentaire ne peut pas être vide",
                400,
                "BadUserInput",
            );
        }

        const review = await BookReview.findOne({
            where: { id: data.reviewId },
        });
        if (!review) {
            throw new AppError("Review not found", 404, "NotFoundError");
        }

        const comment = new BookReviewComment();
        comment.content = content;
        comment.user = user;
        comment.review = review;
        await comment.save();

        return comment;
    }

    @Authorized()
    @Mutation(() => Boolean)
    async deleteBookReviewComment(
        @Arg("id", () => ID) id: string,
        @Ctx() context: Context,
    ): Promise<boolean> {
        const user = context.user;
        if (!user) {
            throw new AppError("User not found", 404, "NotFoundError");
        }

        const comment = await BookReviewComment.findOne({
            where: { id },
            relations: { user: true },
        });
        if (!comment) {
            throw new AppError("Comment not found", 404, "NotFoundError");
        }

        if (!isOwnerOrAdmin(comment.user.id, user)) {
            throw new AppError(
                "Not authorized to delete this comment",
                403,
                "ForbiddenError",
            );
        }

        await comment.remove();
        return true;
    }
}
