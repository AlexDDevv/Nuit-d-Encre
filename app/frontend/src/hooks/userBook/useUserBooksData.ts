import { useQuery } from "@apollo/client";
import { useState } from "react";
import { BookFormat, UseBooksMode, UserBookStatus } from "@/types/types";
import { useSearchParams } from "react-router-dom";
import { GET_USER_BOOKS } from "@/graphql/user/userBook";

/**
 * Hook to fetch and manage a list of user books with pagination and label-based filters.
 *
 * @description
 * Uses Apollo Client's `useQuery` to fetch the user's books from the GraphQL API.
 * It supports:
 * - Pagination
 * - Text search (via `search` query param in the URL)
 * - Category filtering (via `categoryId` query param in the URL)
 * - Rating range filtering (via `ratingRange` state)
 * - Label-based UI filters that are translated to API filters:
 *    • Format → GraphQL `format` (derived from `formatLabelMap`)
 *    • Language → GraphQL `language` (derived from `languageLabelMap`)
 *    • Status → GraphQL `status` (derived from `statusLabelMap`)
 *    • Visibility (Public/Private) → GraphQL `isPublic`
 *    • Recommendation (Recommended/Not recommended) → GraphQL `recommended`
 *
 * The hook expects you to manage a single `string[]` of labels in your UI and pass it to `setFilters`.
 * Internally, those labels are mapped to the API variables.
 *
 * Accepted label values (examples):
 * - Format: "Livre relié", "Livre broché", "Livre de poche"
 * - Language: "Français", "Anglais", "Espagnol", "Allemand", "Italien"
 * - Status: "À lire", "En cours", "Lu", "En pause"
 * - Visibility: "Public", "Privé"
 * - Recommendation: "Recommandé", "Non recommandé"
 *
 * Usage modes control page size:
 * - `home`   → 12 items per page
 * - `library`→ 24 items per page
 *
 * @param {UseBooksMode} mode - UI mode that drives pagination size (`home` | `library`).
 *
 * @returns {Object} An object with:
 * @property {Book[]} userBooks - The list of books for the current page (empty while loading).
 * @property {boolean} isLoadingUserBooks - Loading state of the query.
 * @property {Error | undefined} userBooksError - GraphQL error, if any.
 * @property {number} currentPage - Current page number (1-based).
 * @property {(page: number) => void} setCurrentPage - Setter to change the page.
 * @property {{ library: number; home: number }} PER_PAGE - Page sizes by mode.
 * @property {number} totalCount - Total number of books matching active filters.
 * @property {(filters: string[]) => void} setFilters - Setter that accepts a `string[]` of labels (see lists above).
 * @property {[number | null, number | null]} ratingRange - Current rating range filter [min, max].
 * @property {(min: number | null, max: number | null) => void} setRatingRange - Setter for rating range.
 *
 * @example
 * ```tsx
 * const {
 *   userBooks,
 *   isLoadingUserBooks,
 *   userBooksError,
 *   currentPage,
 *   setCurrentPage,
 *   totalCount,
 *   PER_PAGE,
 *   setFilters,
 *   ratingRange,
 *   setRatingRange,
 * } = useUserBooksData({ mode: "library" });
 *
 * // Set filters using labels only:
 * useEffect(() => {
 *   setFilters([
 *     "Livre broché",   // format → format: ["paperback"]
 *     "Français",       // language → language: "fr"
 *     "En cours",       // status → status: ["reading"]
 *     "Public",         // isPublic → isPublic: true
 *     "Recommandé",     // recommended → recommended: true
 *   ]);
 * }, [setFilters]);
 *
 * // Set rating range (e.g., books rated between 3 and 5)
 * setRatingRange(3, 5);
 *
 * // Reset rating filter
 * setRatingRange(null, null);
 *
 * if (isLoadingUserBooks) return <p>Loading...</p>;
 * if (userBooksError) return <p>Error: {userBooksError.message}</p>;
 *
 * return (
 *   <div>
 *     <h1>User Books ({totalCount})</h1>
 *     <ul>
 *       {userBooks.map((b) => (
 *         <li key={b.id}>{b.title}</li>
 *       ))}
 *     </ul>
 *     <button
 *       disabled={userBooks.length < PER_PAGE.library}
 *       onClick={() => setCurrentPage(currentPage + 1)}
 *     >
 *       Next Page
 *     </button>
 *   </div>
 * );
 * ```
 */

const formatLabelMap: Record<BookFormat, string> = {
    hardcover: "Livre relié",
    paperback: "Livre broché",
    softcover: "Livre de poche",
    pocket: "Livre de poche",
};

const languageLabelMap: Record<string, string> = {
    fr: "Français",
    en: "Anglais",
    es: "Espagnol",
    de: "Allemand",
    it: "Italien",
};

const statusLabelMap: Record<UserBookStatus, string> = {
    TO_READ: "À lire",
    READING: "En cours",
    READ: "Lu",
    PAUSED: "En pause",
};

const booleanLabelMap: Record<
    "isPublic" | "recommended",
    Record<"true" | "false", string>
> = {
    isPublic: {
        true: "Public",
        false: "Privé",
    },
    recommended: {
        true: "Recommandé",
        false: "Non recommandé",
    },
};

export function useUserBooksData({ mode }: UseBooksMode) {
    const [searchParams] = useSearchParams();
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [filters, setFilters] = useState<string[]>([]);
    const [ratingRange, setRatingRangeState] = useState<
        [number | null, number | null]
    >([null, null]);

    const PER_PAGE = {
        library: 24,
        home: 12,
    };

    const getLimit = () => {
        if (!mode || mode === "home") return PER_PAGE.home;
        if (mode === "library") return PER_PAGE.library;
        return PER_PAGE.home;
    };

    const categoryId = searchParams.get("categoryId");

    const selectedFormat = filters.filter((f) =>
        Object.values(formatLabelMap).includes(f),
    );

    const selectedLanguage = filters.find((f) =>
        Object.values(languageLabelMap).includes(f),
    );

    const languageLabelToCode = Object.fromEntries(
        Object.entries(languageLabelMap).map(([code, label]) => [label, code]),
    );

    const selectedStatus = filters.filter((f) =>
        Object.values(statusLabelMap).includes(f),
    );

    const selectedIsPublic = Object.entries(booleanLabelMap.isPublic).find(
        ([, label]) => filters.includes(label),
    )?.[0];

    const selectedRecommended = Object.entries(
        booleanLabelMap.recommended,
    ).find(([, label]) => filters.includes(label))?.[0];

    // Helper function to set rating range
    const setRatingRange = (min: number | null, max: number | null) => {
        setRatingRangeState([min, max]);
        setCurrentPage(1); // Reset to first page when filter changes
    };

    const {
        data: userBooksData,
        loading: isLoadingUserBooks,
        error: userBooksError,
    } = useQuery(GET_USER_BOOKS, {
        variables: {
            filters: {
                page: currentPage,
                limit: getLimit(),
                search: searchParams.get("search") || "",
                categoryIds: categoryId ? [parseInt(categoryId, 10)] : [],
                format: selectedFormat.map(
                    (label) =>
                        Object.entries(formatLabelMap).find(
                            ([, v]) => v === label,
                        )?.[0],
                ),
                language: selectedLanguage
                    ? languageLabelToCode[selectedLanguage]
                    : undefined,
                status: selectedStatus.map(
                    (label) =>
                        Object.entries(statusLabelMap).find(
                            ([, v]) => v === label,
                        )?.[0],
                ),
                isPublic: selectedIsPublic
                    ? selectedIsPublic === "true"
                    : undefined,
                recommended: selectedRecommended
                    ? selectedRecommended === "true"
                    : undefined,
                ratingMin: ratingRange[0] ?? undefined,
                ratingMax: ratingRange[1] ?? undefined,
            },
        },
    });

    return {
        userBooks: userBooksData?.userBooks.userBooks || [],
        isLoadingUserBooks,
        userBooksError,
        currentPage,
        setCurrentPage,
        PER_PAGE,
        totalCount: userBooksData?.userBooks.totalCount ?? 0,
        setFilters,
        ratingRange,
        setRatingRange,
    };
}
