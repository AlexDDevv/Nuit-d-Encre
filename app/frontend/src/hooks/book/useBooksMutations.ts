import { useMutation } from "@apollo/client";
import { useToast } from "@/hooks/toast/useToast";
import { DELETE_BOOK, GET_BOOKS } from "@/graphql/book/book";

/**
 * Hook providing all books-related GraphQL mutations.
 *
 * @description
 * This hook encapsulates the logic to delete many books.
 * It uses Apollo Client's `useMutation` and provides loading states, errors, and error reset functions.
 *
 * @returns {Object} An object containing mutation functions and their corresponding states.
 *
 * @example
 * ```ts
 * const {
 *   deleteBooks,
 *   isDeletingBooks,
 *   deleteBooksError,
 *   resetDeleteBooksError,
 * } = useBooksMutations();
 *
 * // Delete books
 * await deleteBooks([bookId1, bookId2]);
 * ```
 */

export function useBooksMutations() {
    const { showToast } = useToast();

    // ************************ DELETE ************************
    const [
        deleteBooksMutation,
        {
            loading: isDeletingBooks,
            error: deleteBooksError,
            reset: resetDeleteBooksError,
        },
    ] = useMutation(DELETE_BOOK, { refetchQueries: [GET_BOOKS] });

    const deleteBooks = async (selectedBookIds: number[]) => {
        try {
            await Promise.all(
                selectedBookIds.map((id) =>
                    deleteBooksMutation({
                        variables: { bookId: id.toString() },
                    }),
                ),
            );

            showToast({
                type: "success",
                title: "Les livres ont bien été supprimées !",
                description:
                    "Vous pouvez poursuivre votre lecture du tableau de bord.",
            });
        } catch (error) {
            console.error("Erreur lors de la suppression :", error);

            showToast({
                type: "error",
                title: "Un problème est survenu pendant la suppression des livres...",
                description: "Veuillez réessayer dans quelques instants.",
            });
        }
    };

    return {
        // delete
        deleteBooks,
        isDeletingBooks,
        deleteBooksError,
        resetDeleteBooksError,
    };
}
