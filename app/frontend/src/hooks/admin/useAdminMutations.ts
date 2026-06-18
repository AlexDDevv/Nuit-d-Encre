import { useMutation } from "@apollo/client";
import {
    ADMIN_AUTHORS,
    ADMIN_BOOKS,
    ADMIN_CATEGORIES,
    ADMIN_CREATE_CATEGORY,
    ADMIN_DELETE_CATEGORY,
    ADMIN_REVIEWS,
    ADMIN_STATS,
    ADMIN_UPDATE_CATEGORY,
    ADMIN_USERS,
    DELETE_USER,
} from "@/graphql/admin/admin";
import { DELETE_BOOK } from "@/graphql/book/book";
import { DELETE_BOOK_REVIEW } from "@/graphql/book/book-review";
import { DELETE_AUTHOR } from "@/graphql/author/author";

/**
 * Regroupe toutes les mutations d'administration : suppressions (compte, livre,
 * auteur, critique) et gestion des catégories (création, renommage, suppression).
 * Chaque mutation rafraîchit la liste concernée ainsi que les compteurs globaux.
 */
export function useAdminMutations() {
    const [deleteUserMutation, { loading: isDeletingUser }] = useMutation(
        DELETE_USER,
        { refetchQueries: [{ query: ADMIN_USERS }, { query: ADMIN_STATS }] },
    );

    const [deleteBookMutation, { loading: isDeletingBook }] = useMutation(
        DELETE_BOOK,
        { refetchQueries: [{ query: ADMIN_BOOKS }, { query: ADMIN_STATS }] },
    );

    const [deleteAuthorMutation, { loading: isDeletingAuthor }] = useMutation(
        DELETE_AUTHOR,
        { refetchQueries: [{ query: ADMIN_AUTHORS }, { query: ADMIN_STATS }] },
    );

    const [deleteReviewMutation, { loading: isDeletingReview }] = useMutation(
        DELETE_BOOK_REVIEW,
        { refetchQueries: [{ query: ADMIN_REVIEWS }, { query: ADMIN_STATS }] },
    );

    const [createCategoryMutation, { loading: isCreatingCategory }] =
        useMutation(ADMIN_CREATE_CATEGORY, {
            refetchQueries: [
                { query: ADMIN_CATEGORIES },
                { query: ADMIN_STATS },
            ],
        });

    const [updateCategoryMutation, { loading: isUpdatingCategory }] =
        useMutation(ADMIN_UPDATE_CATEGORY, {
            refetchQueries: [{ query: ADMIN_CATEGORIES }],
        });

    const [deleteCategoryMutation, { loading: isDeletingCategory }] =
        useMutation(ADMIN_DELETE_CATEGORY, {
            refetchQueries: [
                { query: ADMIN_CATEGORIES },
                { query: ADMIN_STATS },
            ],
        });

    return {
        deleteUser: (id: string) =>
            deleteUserMutation({ variables: { id } }),
        deleteBook: (bookId: string) =>
            deleteBookMutation({ variables: { bookId } }),
        deleteAuthor: (authorId: string) =>
            deleteAuthorMutation({ variables: { authorId } }),
        deleteReview: (id: string) =>
            deleteReviewMutation({ variables: { id } }),
        createCategory: (name: string) =>
            createCategoryMutation({ variables: { data: { name } } }),
        renameCategory: (id: string, name: string) =>
            updateCategoryMutation({ variables: { id, data: { name } } }),
        deleteCategory: (id: string) =>
            deleteCategoryMutation({ variables: { id } }),
        isDeletingUser,
        isDeletingBook,
        isDeletingAuthor,
        isDeletingReview,
        isCreatingCategory,
        isUpdatingCategory,
        isDeletingCategory,
    };
}
