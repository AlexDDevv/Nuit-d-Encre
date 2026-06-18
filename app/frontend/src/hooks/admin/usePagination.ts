import { useEffect, useState } from "react";

/**
 * Pagination côté client pour les tableaux du panel admin.
 *
 * @param items - Collection complète à paginer.
 * @param perPage - Nombre d'éléments par page (20 par défaut).
 * @returns La page courante, son setter, le nombre total de pages et la tranche affichée.
 */
export function usePagination<T>(items: T[], perPage = 20) {
    const [page, setPage] = useState(1);
    const totalPages = Math.max(1, Math.ceil(items.length / perPage));

    useEffect(() => {
        if (page > totalPages) setPage(1);
    }, [items.length, totalPages, page]);

    const slice = items.slice((page - 1) * perPage, page * perPage);

    return { page, setPage, totalPages, slice, perPage };
}
