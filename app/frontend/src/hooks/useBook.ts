import { useQuery, useMutation } from "@apollo/client"
import {
	GET_BOOKS,
	CREATE_BOOK,
	UPDATE_BOOK,
	GET_MY_BOOKS,
	DELETE_BOOK,
	GET_BOOK,
} from "@/graphql/book/book"
import { useState } from "react"
import {
	BookFormat,
	CreateBookInput,
	UpdateBookInput,
} from "@/types/types"
import { useSearchParams } from "react-router-dom"
import { useToast } from "./useToast"
import { GET_CATEGORIES } from "@/graphql/book/category"

const formatLabelMap: Record<BookFormat, string> = {
	hardcover: "Livre relié",
	paperback: "Livre broché",
	softcover: "Livre de poche",
	pocket: "Livre de poche"
}

const languageLabelMap: Record<string, string> = {
	fr: "Français",
	en: "Anglais",
	es: "Espagnol",
	de: "Allemand",
	it: "Italien",
};

/**
 * Hook for the book management.
 */
export function useBook(bookId?: string) {
	const [searchParams] = useSearchParams()
	const [currentPage, setCurrentPage] = useState<number>(1)
	const [filters, setFilters] = useState<string[]>([])
	const [debouncedSearch, setDebouncedSearch] = useState("")
	const PER_PAGE = {
		all: 12,
		mine: 5,
	}
	const { showToast } = useToast()

	const categoryId = searchParams.get("categoryId")

	const selectedFormat = filters.filter(f =>
		Object.values(formatLabelMap).includes(f)
	)

	const selectedLanguage = filters.find(f =>
		Object.values(languageLabelMap).includes(f)
	)

	const languageLabelToCode = Object.fromEntries(
		Object.entries(languageLabelMap).map(([code, label]) => [label, code])
	)

	// Apollo hooks
	const {
		data: allBooksData,
		loading: isFetching,
		error: allBooksError,
		refetch,
	} = useQuery(GET_BOOKS, {
		variables: {
			filters: {
				page: currentPage,
				limit: PER_PAGE.all,
				search: searchParams.get("search") || "",
				categoryIds: categoryId ? [parseInt(categoryId, 10)] : [],
				format: selectedFormat.map(
					label =>
						Object.entries(formatLabelMap).find(
							([, v]) => v === label
						)?.[0]),
				language: selectedLanguage ? languageLabelToCode[selectedLanguage] : undefined,
			},
		},
	})
	const books = allBooksData?.books.allBooks || []

	const {
		data: myBooksData,
		loading,
		error: myBooksError
	} = useQuery(GET_MY_BOOKS, {
		variables: {
			filters: {
				page: currentPage,
				limit: PER_PAGE.mine,
				search: debouncedSearch,
				categoryIds: categoryId ? [parseInt(categoryId, 10)] : [],
				format: selectedFormat.map(
					label =>
						Object.entries(formatLabelMap).find(
							([, v]) => v === label
						)?.[0]),
				language: selectedLanguage ? languageLabelToCode[selectedLanguage] : undefined,

			},
		},
	})
	const myBooks = myBooksData?.myBooks.books || []

	const { data: categoriesData, loading: loadingCategories } =
		useQuery(GET_CATEGORIES);
	const categories = categoriesData?.categories

	const {
		data: bookData,
		loading: bookLoading,
		error: bookError,
	} = useQuery(GET_BOOK, {
		variables: { bookId: bookId },
		skip: !bookId,
	});
	const book = bookData?.book;

	const totalCount = allBooksData?.books.totalCount ?? 0

	const [createBook, { loading: isCreating, error: createError }] =
		useMutation(CREATE_BOOK, {
			refetchQueries: [{ query: GET_BOOKS }],
		})

	const [updateBookMutation, { loading: isUpdating, error: updateError }] =
		useMutation(UPDATE_BOOK, {
			refetchQueries: [{ query: GET_BOOKS }],
		})

	const [doDeleteBook] = useMutation(DELETE_BOOK, {
		refetchQueries: [GET_MY_BOOKS],
	})

	const fetchBooks = async () => {
		await refetch()
	}

	const addBook = async (
		book: CreateBookInput
	): Promise<{ id: string } | undefined> => {
		const result = await createBook({
			variables: { data: book },
		})
		return result.data?.createBook
	}

	const updateBook = async (
		id: string,
		book: Omit<UpdateBookInput, "id">
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

	const deleteBook = async (bookId: string) => {
		try {
			await doDeleteBook({
				variables: {
					bookId: bookId,
				},
			})

			showToast({
				type: "success",
				title: "Le livre a bien été supprimée !",
				description:
					"Vous pouvez poursuivre votre lecture du tableau de bord.",
			})
		} catch (error) {
			if (error instanceof Error) {
				if (
					error.message.includes(
						"Access denied! You don't have permission for this action!"
					)
				) {
					showToast({
						type: "error",
						title: "Échec de la suppression",
						description: "Vous n'avez pas les droits nécessaires.",
					})
				} else {
					showToast({
						type: "error",
						title: "Erreur lors de la suppression",
						description:
							"Une erreur est survenue. Veuillez réessayer plus tard.",
					})
				}
			} else {
				showToast({
					type: "error",
					title: "Erreur inattendue",
					description: "Une erreur inconnue est survenue.",
				})
			}
		}
	}

	const deleteBooks = async (selectedBookIds: number[]) => {
		try {
			await Promise.all(
				selectedBookIds.map(id =>
					doDeleteBook({
						variables: { bookId: id.toString() },
					})
				)
			)

			showToast({
				type: "success",
				title: "Les livres ont bien été supprimées !",
				description:
					"Vous pouvez poursuivre votre lecture du tableau de bord.",
			})
		} catch (error) {
			console.error("Erreur lors de la suppression :", error)

			showToast({
				type: "error",
				title: "Un problème est survenu pendant la suppression des livres...",
				description: "Veuillez réessayer dans quelques instants.",
			})
		}
	}

	return {
		books,
		isFetching,
		allBooksError,
		isCreating,
		isUpdating,
		createError,
		updateError,
		currentPage,
		setCurrentPage,
		PER_PAGE,
		totalCount,
		setDebouncedSearch,
		myBooks,
		loading,
		myBooksError,
		book,
		bookLoading,
		bookError,
		categories,
		loadingCategories,
		filters,
		setFilters,
		formatLabelMap,
		fetchBooks,
		addBook,
		updateBook,
		deleteBook,
		deleteBooks,
	}
}
