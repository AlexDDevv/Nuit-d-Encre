import { CreateBookInput, UpdateBookInput } from "@/types/types";
import { useMutation } from "@apollo/client";
import { useToast } from "@/hooks/toast/useToast";
import {
    CREATE_BOOK,
    DELETE_BOOK,
    GET_BOOKS,
    UPDATE_BOOK,
} from "@/graphql/book/book";

/**
 * Hook fournissant toutes les mutations GraphQL liées aux livres.
 *
 * @description
 * Ce hook encapsule la logique de création, mise à jour et suppression d’un livre.
 * Il utilise `useMutation` d’Apollo Client et expose les états de chargement,
 * les erreurs ainsi que des fonctions pour les réinitialiser.
 *
 * @returns {Object} Un objet contenant les fonctions de mutation et leurs états.
 * - createBook(book: CreateBookInput): Promise<{ id: string } | undefined>
 * - isCreatingBook: boolean
 * - createBookError: ApolloError | undefined
 * - resetCreateBookError(): void
 * - updateBook(id: string, book: Omit<UpdateBookInput, "id">): Promise<any>
 * - isUpdatingBook: boolean
 * - updateBookError: ApolloError | undefined
 * - resetUpdateBookError(): void
 * - deleteBook(bookId: string): Promise<void>
 * - isDeletingBook: boolean
 * - deleteBookError: ApolloError | undefined
 * - resetDeleteBookError(): void
 *
 * @example
 * ```ts
 * import { useBookMutations } from "@/hooks/..."; // le nom du hook reste identique dans cet exemple
 *
 * const {
 *   createBook,
 *   isCreatingBook,
 *   createBookError,
 *   resetCreateBookError,
 *   updateBook,
 *   isUpdatingBook,
 *   updateBookError,
 *   resetUpdateBookError,
 *   deleteBook,
 *   isDeletingBook,
 *   deleteBookError,
 *   resetDeleteBookError,
 * } = useBookMutations();
 *
 * // Créer un livre
 * const created = await createBook({
 *   title: "Le chat et le code",
 *   description: "Un guide pour les devs félins.",
 *   public: true,
 *   category: 1,
 * } as CreateBookInput);
 * console.log(created?.id);
 *
 * // Mettre à jour un livre
 * await updateBook("bookId", { title: "Titre mis à jour" });
 *
 * // Supprimer un livre
 * await deleteBook("bookId");
 * ```
 */

export function useBookMutations() {
    const { showToast } = useToast();

    // ************************ CREATE ************************
    const [
        createBookMutation,
        {
            loading: isCreatingBook,
            error: createBookError,
            reset: resetCreateBookError,
        },
    ] = useMutation(CREATE_BOOK, {
        refetchQueries: [{ query: GET_BOOKS }],
    });

    const addBook = async (
        book: CreateBookInput,
    ): Promise<{ id: string } | undefined> => {
        const result = await createBookMutation({
            variables: { data: book },
        });
        return result.data?.createBook;
    };

    // ************************ UPDATE ************************
    const [
        updateBookMutation,
        {
            loading: isUpdatingBook,
            error: updateBookError,
            reset: resetUpdateBookError,
        },
    ] = useMutation(UPDATE_BOOK, {
        refetchQueries: [{ query: GET_BOOKS }],
    });

    const updateBook = async (
        id: string,
        book: Omit<UpdateBookInput, "id">,
    ) => {
        const result = await updateBookMutation({
            variables: {
                data: {
                    ...book,
                    id,
                },
            },
        });
        return result.data?.updateBook;
    };

    // ************************ DELETE ************************
    const [
        deleteBookMutation,
        {
            loading: isDeletingBook,
            error: deleteBookError,
            reset: resetDeleteBookError,
        },
    ] = useMutation(DELETE_BOOK, {
        refetchQueries: [GET_BOOKS],
    });

    const deleteBook = async (bookId: string) => {
        try {
            await deleteBookMutation({
                variables: {
                    bookId: bookId,
                },
            });

            showToast({
                type: "success",
                title: "Le livre a bien été supprimée !",
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
        createBook: addBook,
        isCreatingBook,
        createBookError,
        resetCreateBookError,

        // update
        updateBook,
        isUpdatingBook,
        updateBookError,
        resetUpdateBookError,

        // delete
        deleteBook,
        isDeletingBook,
        deleteBookError,
        resetDeleteBookError,
    };
}
