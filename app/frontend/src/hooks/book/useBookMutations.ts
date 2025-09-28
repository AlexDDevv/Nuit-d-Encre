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
 * Hook providing all GraphQL mutations related to books.
 *
 * @description
 * This hook encapsulates the logic for creating, updating, and deleting a book.
 * It uses Apollo Client's `useMutation` and exposes loading states,
 * errors, as well as functions to reset them.
 *
 * @returns {Object} An object containing mutation functions and their states.
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
 * import { useBookMutations } from "@/hooks/...";
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
 * // Create a book
 * const created = await createBook({
 *   title: "The Cat and the Code",
 *   description: "A guide for feline developers.",
 *   public: true,
 *   category: 1,
 * } as CreateBookInput);
 * console.log(created?.id);
 *
 * // Update a book
 * await updateBook("bookId", { title: "Updated title" });
 *
 * // Delete a book
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
