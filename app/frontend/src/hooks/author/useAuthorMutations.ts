import { CreateAuthorInput, UpdateAuthorInput } from "@/types/types";
import { useMutation } from "@apollo/client";
import { useToast } from "@/hooks/toast/useToast";
import {
    CREATE_AUTHOR,
    DELETE_AUTHOR,
    GET_AUTHORS,
    UPDATE_AUTHOR,
} from "@/graphql/author/author";

/**
 * Hook providing all GraphQL mutations related to authors.
 *
 * @description
 * This hook encapsulates the logic for creating, updating, and deleting an author.
 * It uses Apollo Client's `useMutation` and exposes loading states,
 * errors, as well as functions to reset them.
 *
 * @returns {Object} An object containing mutation functions and their states.
 * - createAuthor(author: CreateAuthorInput): Promise<{ id: string } | undefined>
 * - isCreatingAuthor: boolean
 * - createAuthorError: ApolloError | undefined
 * - resetCreateAuthorError(): void
 * - updateAuthor(id: string, author: Omit<UpdateAuthorInput, "id">): Promise<any>
 * - isUpdatingAuthor: boolean
 * - updateAuthorError: ApolloError | undefined
 * - resetUpdateAuthorError(): void
 * - deleteAuthor(authorId: string): Promise<void>
 * - isDeletingAuthor: boolean
 * - deleteAuthorError: ApolloError | undefined
 * - resetDeleteAuthorError(): void
 *
 * @example
 * ```ts
 * import { useAuthorMutations } from "@/hooks/...";
 *
 * const {
 *   createAuthor,
 *   isCreatingAuthor,
 *   createAuthorError,
 *   resetCreateAuthorError,
 *   updateAuthor,
 *   isUpdatingAuthor,
 *   updateAuthorError,
 *   resetUpdateAuthorError,
 *   deleteAuthor,
 *   isDeletingAuthor,
 *   deleteAuthorError,
 *   resetDeleteAuthorError,
 * } = useAuthorMutations();
 *
 * // Create an author
 * const created = await createAuthor({
 *   name: "John Doe",
 *   bio: "Writer of modern classics.",
 *   nationality: "American",
 * } as CreateAuthorInput);
 * console.log(created?.id);
 *
 * // Update an author
 * await updateAuthor("authorId", { bio: "Updated biography" });
 *
 * // Delete an author
 * await deleteAuthor("authorId");
 * ```
 */

export function useAuthorMutations() {
    const { showToast } = useToast();

    // ************************ CREATE ************************
    const [
        createAuthorMutation,
        {
            loading: isCreatingAuthor,
            error: createAuthorError,
            reset: resetCreateAuthorError,
        },
    ] = useMutation(CREATE_AUTHOR, {
        refetchQueries: [{ query: GET_AUTHORS }],
    });

    const addAuthor = async (
        author: CreateAuthorInput,
    ): Promise<{ id: string } | undefined> => {
        const result = await createAuthorMutation({
            variables: { data: author },
        });
        return result.data?.createAuthor;
    };

    // ************************ UPDATE ************************
    const [
        updateAuthorMutation,
        {
            loading: isUpdatingAuthor,
            error: updateAuthorError,
            reset: resetUpdateAuthorError,
        },
    ] = useMutation(UPDATE_AUTHOR, {
        refetchQueries: [{ query: GET_AUTHORS }],
    });

    const updateAuthor = async (
        id: string,
        author: Omit<UpdateAuthorInput, "id">,
    ) => {
        const result = await updateAuthorMutation({
            variables: {
                data: {
                    ...author,
                    id,
                },
            },
        });
        return result.data?.updateAuthor;
    };

    // ************************ DELETE ************************
    const [
        deleteAuthorMutation,
        {
            loading: isDeletingAuthor,
            error: deleteAuthorError,
            reset: resetDeleteAuthorError,
        },
    ] = useMutation(DELETE_AUTHOR, {
        refetchQueries: [GET_AUTHORS],
    });

    const deleteAuthor = async (authorId: string) => {
        try {
            await deleteAuthorMutation({
                variables: {
                    authorId: authorId,
                },
            });

            showToast({
                type: "success",
                title: "L'auteur a bien été supprimé !",
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
                        title: "Erreur lors de la suppression",
                        description:
                            "Une erreur est survenue. Veuillez réessayer plus tard.",
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
        // create
        createAuthor: addAuthor,
        isCreatingAuthor,
        createAuthorError,
        resetCreateAuthorError,

        // update
        updateAuthor,
        isUpdatingAuthor,
        updateAuthorError,
        resetUpdateAuthorError,

        // delete
        deleteAuthor,
        isDeletingAuthor,
        deleteAuthorError,
        resetDeleteAuthorError,
    };
}
