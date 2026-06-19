import { CreateUserBookInput, UpdateUserBookInput, UserBook } from "@/types/types";
import { useMutation } from "@apollo/client";
import { useToast } from "@/hooks/toast/useToast";
import { parseGraphQLError } from "@/utils/graphql-error";
import {
    CREATE_USER_BOOK,
    UPDATE_USER_BOOK,
    DELETE_USER_BOOK,
    GET_USER_BOOKS,
} from "@/graphql/user/userBook";

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
 * - updateUserBook(userBook: UpdateUserBookInput): Promise<UserBook | undefined>
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

export function useUserBookMutations() {
    const { showToast } = useToast();

    // ************************ CREATE ************************
    const [
        createUserBookMutation,
        {
            loading: isCreatingUserBook,
            error: createUserBookError,
            reset: resetCreateUserBookError,
        },
    ] = useMutation(CREATE_USER_BOOK, {
        refetchQueries: [{ query: GET_USER_BOOKS }],
        awaitRefetchQueries: true,
    });

    const addUserBook = async (
        userBook: CreateUserBookInput,
    ): Promise<{ id: string } | undefined> => {
        const { bookId, ...rest } = userBook;
        const result = await createUserBookMutation({
            variables: {
                data: {
                    ...rest,
                    bookId,
                },
            },
        });
        return result.data?.createUserBook;
    };

    // ************************ UPDATE ************************
    const [
        updateUserBookMutation,
        {
            loading: isUpdatingUserBook,
            error: updateUserBookError,
            reset: resetUpdateUserBookError,
        },
    ] = useMutation<{ updateUserBook: UserBook }, { data: UpdateUserBookInput }>(UPDATE_USER_BOOK, {
        update(cache, { data }) {
            const updated = data?.updateUserBook;
            if (!updated) return;

            cache.modify({
                id: cache.identify({ __typename: "UserBook", id: updated.id }),
                fields: {
                    status() {
                        return updated.status;
                    },
                    updatedAt() {
                        return updated.updatedAt;
                    },
                },
            });
        },
    });

    const editUserBook = async (
        userBook: UpdateUserBookInput,
    ): Promise<UserBook | undefined> => {
        const { id, ...rest } = userBook;

        const result = await updateUserBookMutation({
            variables: {
                data: {
                    ...rest,
                    ...(id && { id }),
                },
            },
        });
        return result.data?.updateUserBook;
    };

    // ************************ DELETE ************************
    const [
        deleteUserBooksMutation,
        {
            loading: isDeletingUserBook,
            error: deleteUserBookError,
            reset: resetDeleteUserBookError,
        },
    ] = useMutation(DELETE_USER_BOOK, {
        update(cache, { data }) {
            const deletedUserBook = data?.deleteUserBook;
            if (!deletedUserBook) return;

            // Supprimer l'entrée du cache
            cache.evict({
                id: cache.identify({
                    __typename: "UserBook",
                    id: deletedUserBook.id,
                }),
            });

            // Nettoyer les références orphelines
            cache.gc();
        },
        refetchQueries: [{ query: GET_USER_BOOKS }],
        awaitRefetchQueries: true,
    });

    const deleteUserBook = async (userBookId: string) => {
        try {
            await deleteUserBooksMutation({
                variables: {
                    userBookId: userBookId,
                },
            });

            showToast({
                type: "success",
                title: "Le livre a bien été supprimée !",
                description:
                    "Vous pouvez poursuivre votre lecture du tableau de bord.",
            });
        } catch (error) {
            const { title, description } = parseGraphQLError(error, "deleteUserBook");
            showToast({ type: "error", title, description });
        }
    };

    return {
        // create
        createUserBook: addUserBook,
        isCreatingUserBook,
        createUserBookError,
        resetCreateUserBookError,

        // update
        updateUserBook: editUserBook,
        isUpdatingUserBook,
        updateUserBookError,
        resetUpdateUserBookError,

        // delete
        deleteUserBook,
        isDeletingUserBook,
        deleteUserBookError,
        resetDeleteUserBookError,
    };
}
