import { useQuery, useMutation } from "@apollo/client";
import {
    GET_AUTHOR,
    CREATE_AUTHOR,
    UPDATE_AUTHOR,
    DELETE_AUTHOR,
    GET_AUTHORS,
    GET_MY_AUTHORS,
} from "@/graphql/author/author";
import { useState } from "react";
import { CreateAuthorInput, UpdateAuthorInput } from "@/types/types";
import { useSearchParams } from "react-router-dom";
import { useToast } from "@/hooks/toast/useToast";

/**
 * Hook for the author management.
 */
export function useAuthor(authorId?: string) {
    const [searchParams] = useSearchParams();
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [debouncedSearch, setDebouncedSearch] = useState("");
    const PER_PAGE = {
        all: 12,
        mine: 5,
    };
    const { showToast } = useToast();

    // Apollo hooks
    const {
        data: allAuthorsData,
        loading: isFetching,
        error: allAuthorsError,
        refetch,
    } = useQuery(GET_AUTHORS, {
        variables: {
            filters: {
                page: currentPage,
                limit: PER_PAGE.all,
                search: searchParams.get("search") || "",
            },
        },
    });
    const authors = allAuthorsData?.authors.allAuthors || [];

    const {
        data: myAuthorsData,
        loading,
        error: myAuthorsError,
    } = useQuery(GET_MY_AUTHORS, {
        variables: {
            filters: {
                page: currentPage,
                limit: PER_PAGE.mine,
                search: debouncedSearch,
            },
        },
    });
    const myAuthors = myAuthorsData?.myAuthors.authors || [];

    const {
        data: authorData,
        loading: authorLoading,
        error: authorError,
    } = useQuery(GET_AUTHOR, {
        variables: { authorId: authorId },
        skip: !authorId,
    });
    const author = authorData?.author;

    const totalCount = allAuthorsData?.authors.totalCount ?? 0;

    const [createAuthor, { loading: isCreating, error: createError }] =
        useMutation(CREATE_AUTHOR, {
            refetchQueries: [{ query: GET_AUTHORS }],
        });

    const [updateAuthorMutation, { loading: isUpdating, error: updateError }] =
        useMutation(UPDATE_AUTHOR, {
            refetchQueries: [{ query: GET_AUTHORS }],
        });

    const [doDeleteAuthor] = useMutation(DELETE_AUTHOR, {
        refetchQueries: [GET_MY_AUTHORS],
    });

    const fetchAuthors = async () => {
        await refetch();
    };

    const addAuthor = async (
        author: CreateAuthorInput,
    ): Promise<{ id: string } | undefined> => {
        const result = await createAuthor({
            variables: { data: author },
        });
        return result.data?.createAuthor;
    };

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

    const deleteAuthor = async (authorId: string) => {
        try {
            await doDeleteAuthor({
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

    const deleteAuthors = async (selectedAuthorIds: number[]) => {
        try {
            await Promise.all(
                selectedAuthorIds.map((id) =>
                    doDeleteAuthor({
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
        authors,
        isFetching,
        allAuthorsError,
        isCreating,
        isUpdating,
        createError,
        updateError,
        currentPage,
        setCurrentPage,
        PER_PAGE,
        totalCount,
        setDebouncedSearch,
        myAuthors,
        loading,
        myAuthorsError,
        author,
        authorLoading,
        authorError,
        fetchAuthors,
        addAuthor,
        updateAuthor,
        deleteAuthor,
        deleteAuthors,
    };
}
