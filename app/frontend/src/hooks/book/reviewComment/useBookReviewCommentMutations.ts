import { ApolloCache, Reference, gql, useMutation } from "@apollo/client";
import {
    CREATE_BOOK_REVIEW_COMMENT,
    DELETE_BOOK_REVIEW_COMMENT,
} from "@/graphql/book/book-review-comment";
import { BookReviewComment } from "@/types/types";

const NEW_COMMENT_FRAGMENT = gql`
    fragment NewBookReviewComment on BookReviewComment {
        id
        content
        createdAt
        user {
            id
            userName
            avatar
        }
    }
`;

function addCommentToCache(
    cache: ApolloCache<unknown>,
    reviewId: string,
    comment: BookReviewComment,
) {
    const reviewRef = cache.identify({
        __typename: "BookReview",
        id: reviewId,
    });
    if (!reviewRef) return;

    const commentRef = cache.writeFragment({
        data: { ...comment, __typename: "BookReviewComment" },
        fragment: NEW_COMMENT_FRAGMENT,
    });
    if (!commentRef) return;

    cache.modify({
        id: reviewRef,
        fields: {
            comments: (existing = []) => [...existing, commentRef],
            commentCount: (existing = 0) => existing + 1,
        },
    });
}

function removeCommentFromCache(
    cache: ApolloCache<unknown>,
    reviewId: string,
    commentId: string,
) {
    const reviewRef = cache.identify({
        __typename: "BookReview",
        id: reviewId,
    });
    if (reviewRef) {
        cache.modify({
            id: reviewRef,
            fields: {
                comments: (existing = [], { readField }) =>
                    existing.filter(
                        (ref: Reference) =>
                            readField("id", ref) !== commentId,
                    ),
                commentCount: (existing = 0) => Math.max(existing - 1, 0),
            },
        });
    }

    cache.evict({
        id: cache.identify({ __typename: "BookReviewComment", id: commentId }),
    });
    cache.gc();
}

/**
 * Mutations create/delete pour les commentaires de critique, avec mise à
 * jour directe du cache Apollo (pas de refetch).
 */
export function useBookReviewCommentMutations() {
    const [
        createMutation,
        {
            loading: isCreatingComment,
            error: createCommentError,
            reset: resetCreateCommentError,
        },
    ] = useMutation(CREATE_BOOK_REVIEW_COMMENT);

    const [
        deleteMutation,
        {
            loading: isDeletingComment,
            error: deleteCommentError,
            reset: resetDeleteCommentError,
        },
    ] = useMutation(DELETE_BOOK_REVIEW_COMMENT);

    const createComment = async (
        reviewId: string,
        content: string,
    ): Promise<BookReviewComment | undefined> => {
        const result = await createMutation({
            variables: { data: { reviewId, content } },
            update(cache, { data }) {
                const comment = data?.createBookReviewComment;
                if (!comment) return;
                addCommentToCache(cache, reviewId, comment);
            },
        });
        return result.data?.createBookReviewComment;
    };

    const deleteComment = async (
        reviewId: string,
        commentId: string,
    ): Promise<boolean> => {
        const result = await deleteMutation({
            variables: { id: commentId },
            update(cache, { data }) {
                if (!data?.deleteBookReviewComment) return;
                removeCommentFromCache(cache, reviewId, commentId);
            },
        });
        return Boolean(result.data?.deleteBookReviewComment);
    };

    return {
        createComment,
        isCreatingComment,
        createCommentError,
        resetCreateCommentError,
        deleteComment,
        isDeletingComment,
        deleteCommentError,
        resetDeleteCommentError,
    };
}
