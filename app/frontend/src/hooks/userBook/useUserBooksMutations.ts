import { useMutation } from "@apollo/client";
import { useToast } from "@/hooks/toast/useToast";
import { DELETE_USER_BOOK, GET_USER_BOOKS } from "@/graphql/user/userBook";

/**
 * Hook providing all userBooks-related GraphQL mutations.
 *
 * @description
 * This hook encapsulates the logic to delete many userBooks.
 * It uses Apollo Client's `useMutation` and provides loading states, errors, and error reset functions.
 *
 * @returns {Object} An object containing mutation functions and their corresponding states.
 *
 * @example
 * ```ts
 * const {
 *   deleteUserBooks,
 *   isDeletingUserBooks,
 *   deleteUserBooksError,
 *   resetDeleteUserBooksError,
 * } = useUserBooksMutations();
 *
 * // Delete userBooks
 * await deleteUserBooks([userBookId1, userBookId2]);
 * ```
 */

export function useUserBooksMutations() {
    const { showToast } = useToast();

    // ************************ DELETE ************************
    const [
        deleteUserBooksMutation,
        {
            loading: isDeletingUserBooks,
            error: deleteUserBooksError,
            reset: resetDeleteUserBooksError,
        },
    ] = useMutation(DELETE_USER_BOOK, { refetchQueries: [GET_USER_BOOKS] });

    const deleteUserBooks = async (selectedUserBookIds: number[]) => {
        try {
            await Promise.all(
                selectedUserBookIds.map((id) =>
                    deleteUserBooksMutation({
                        variables: { userBookId: id.toString() },
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
            if (error instanceof Error) {
                if (
                    error.message.includes(
                        "Access denied! You don't have permission for this action!",
                    )
                ) {
                    showToast({
                        type: "error",
                        title: "Échec de la suppression",
                        description: "Vous n'avez pas les droits nécessaires.",
                    });
                } else {
                    showToast({
                        type: "error",
                        title: "Un problème est survenu pendant la suppression des livres...",
                        description:
                            "Veuillez réessayer dans quelques instants.",
                    });
                }
            } else {
                showToast({
                    type: "error",
                    title: "Erreur inattendue",
                    description: "Une erreur inconnue est survenue.",
                });
            }
        }
    };

    return {
        // delete
        deleteUserBooks,
        isDeletingUserBooks,
        deleteUserBooksError,
        resetDeleteUserBooksError,
    };
}
