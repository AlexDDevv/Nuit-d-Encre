import { useMutation } from "@apollo/client";
import { useToast } from "@/hooks/toast/useToast";
import { DELETE_AUTHOR, GET_AUTHORS } from "@/graphql/author/author";

/**
 * Hook providing all authors-related GraphQL mutations.
 *
 * @description
 * This hook encapsulates the logic to delete multiple authors.
 * It uses Apollo Client's `useMutation` and provides loading states, errors, and error reset functions.
 *
 * @returns {Object} An object containing mutation functions and their corresponding states.
 *
 * @example
 * ```ts
 * const {
 *   deleteAuthors,
 *   isDeletingAuthors,
 *   deleteAuthorsError,
 *   resetDeleteAuthorsError,
 * } = useAuthorsMutations();
 *
 * // Delete authors
 * await deleteAuthors([authorId1, authorId2]);
 * ```
 */

export function useBooksMutations() {
    const { showToast } = useToast();

    // ************************ DELETE ************************
    const [
        deleteAuthorMutation,
        {
            loading: isDeletingAuthors,
            error: deleteAuthorsError,
            reset: resetDeleteAuthorsError,
        },
    ] = useMutation(DELETE_AUTHOR, {
        refetchQueries: [GET_AUTHORS],
    });

    const deleteAuthors = async (selectedAuthorIds: number[]) => {
        try {
            await Promise.all(
                selectedAuthorIds.map((id) =>
                    deleteAuthorMutation({
                        variables: { authorId: id.toString() },
                    }),
                ),
            );

            showToast({
                type: "success",
                title: "Les auteurs ont bien été supprimés !",
                description:
                    "Vous pouvez poursuivre votre lecture du tableau de bord.",
            });
        } catch (error) {
            console.error("Erreur lors de la suppression :", error);

            showToast({
                type: "error",
                title: "Un problème est survenu pendant la suppression des auteurs...",
                description: "Veuillez réessayer dans quelques instants.",
            });
        }
    };

    return {
        // delete
        deleteAuthors,
        isDeletingAuthors,
        deleteAuthorsError,
        resetDeleteAuthorsError,
    };
}
