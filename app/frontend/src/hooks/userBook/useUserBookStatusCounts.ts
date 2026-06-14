import { useQuery } from "@apollo/client";
import { GET_USER_BOOK_STATUS_COUNTS } from "@/graphql/user/userBook";
import { UserBookStatus } from "@/types/types";

type StatusCounts = {
    total: number;
    toRead: number;
    reading: number;
    read: number;
    paused: number;
};

const EMPTY: StatusCounts = {
    total: 0,
    toRead: 0,
    reading: 0,
    read: 0,
    paused: 0,
};

/**
 * Compteurs d'ouvrages de la bibliothèque par statut (toute la collection),
 * pour l'en-tête « Vos rayons » et les segments de filtre.
 */
export function useUserBookStatusCounts() {
    const { data, loading, error, refetch } = useQuery<{
        userBookStatusCounts: StatusCounts;
    }>(GET_USER_BOOK_STATUS_COUNTS);

    const counts = data?.userBookStatusCounts ?? EMPTY;

    /** Compteur par statut d'énumération (TO_READ, READING, READ, PAUSED). */
    const countByStatus: Record<UserBookStatus, number> = {
        TO_READ: counts.toRead,
        READING: counts.reading,
        READ: counts.read,
        PAUSED: counts.paused,
    };

    return { counts, countByStatus, isLoadingCounts: loading, countsError: error, refetchCounts: refetch };
}
