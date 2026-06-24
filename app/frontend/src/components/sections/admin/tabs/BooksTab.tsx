import { useMemo, useState } from "react";
import { useAdminBooks } from "@/hooks/admin/useAdminBooks";
import { useAdminMutations } from "@/hooks/admin/useAdminMutations";
import { usePagination } from "@/hooks/admin/usePagination";
import { useToast } from "@/hooks/toast/useToast";
import { cn, slugify } from "@/lib/utils";
import { atelierSelectTriggerClass } from "@/components/sections/shared/atelierField";
import type { AdminBookRow } from "@/types/types";
import { FormatChip } from "@/components/sections/admin/ui/chips";
import { SearchInput } from "@/components/sections/admin/ui/SearchInput";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/UI/Select";
import Pagination from "@/components/UI/Pagination";
import {
    EmptyState,
    SkeletonRows,
} from "@/components/sections/admin/ui/feedback";
import { ConfirmDialog } from "@/components/sections/admin/ui/ConfirmDialog";
import {
    DataTable,
    type Column,
} from "@/components/sections/admin/ui/DataTable";

/** Onglet Livres : recherche par titre, filtre par catégorie, suppression. */
export function BooksTab() {
    const { books, isLoadingBooks } = useAdminBooks();
    const { deleteBook, isDeletingBook } = useAdminMutations();
    const { showToast } = useToast();

    const [query, setQuery] = useState("");
    const [category, setCategory] = useState("all");
    const [pending, setPending] = useState<AdminBookRow | null>(null);

    const categories = useMemo(() => {
        const names = new Set<string>();
        books.forEach((b) => b.category && names.add(b.category.name));
        return ["all", ...Array.from(names).sort((a, b) => a.localeCompare(b))];
    }, [books]);

    const term = query.toLowerCase();
    const filtered = books.filter(
        (b) =>
            b.title.toLowerCase().includes(term) &&
            (category === "all" || b.category?.name === category),
    );
    const { page, setPage, slice, perPage } = usePagination(filtered, 20);

    const confirmDelete = async () => {
        if (!pending) return;
        try {
            await deleteBook(pending.id);
            showToast({
                type: "success",
                title: "Livre supprimé",
                description: `« ${pending.title} » a été retiré du catalogue.`,
            });
        } catch (error) {
            showToast({
                type: "error",
                title: "Suppression impossible",
                description: (error as Error).message,
            });
        } finally {
            setPending(null);
        }
    };

    const columns: Column<AdminBookRow>[] = [
        {
            key: "titre",
            header: "Titre",
            primary: true,
            cell: (b) => (
                <div className="min-w-0">
                    <div className="font-quote text-foreground truncate text-base">
                        {b.title}
                    </div>
                    <div className="font-body text-muted-foreground truncate text-xs lg:hidden">
                        {b.author.firstname} {b.author.lastname}
                    </div>
                </div>
            ),
        },
        {
            key: "isbn",
            header: "ISBN-13",
            cell: (b) => (
                <span className="font-body text-muted-foreground whitespace-nowrap text-xs tabular-nums">
                    {b.isbn13}
                </span>
            ),
        },
        {
            key: "auteur",
            header: "Auteur",
            cell: (b) => (
                <span className="font-body text-foreground/85 text-sm">
                    {b.author.firstname} {b.author.lastname}
                </span>
            ),
        },
        {
            key: "cat",
            header: "Catégorie",
            cell: (b) =>
                b.category ? (
                    <span className="border-border bg-muted/70 text-muted-foreground inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-bold uppercase tracking-[0.12em]">
                        {b.category.name}
                    </span>
                ) : (
                    <span className="text-muted-foreground/60">-</span>
                ),
        },
        {
            key: "format",
            header: "Format",
            cell: (b) => <FormatChip format={b.format} />,
        },
        {
            key: "par",
            header: "Ajouté par",
            cell: (b) => (
                <span className="font-body text-muted-foreground text-xs">
                    {b.user?.userName ?? "-"}
                </span>
            ),
        },
        {
            key: "le",
            header: "Ajouté le",
            cell: (b) => (
                <span className="font-body text-muted-foreground whitespace-nowrap text-xs">
                    {new Date(b.createdAt).toLocaleDateString("fr-FR")}
                </span>
            ),
        },
    ];

    return (
        <section className="fade-up">
            <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center">
                <SearchInput
                    value={query}
                    onChange={(v) => {
                        setQuery(v);
                        setPage(1);
                    }}
                    placeholder="Rechercher par titre…"
                    className="sm:flex-1"
                />
                <Select
                    value={category}
                    onValueChange={(v) => {
                        setCategory(v);
                        setPage(1);
                    }}
                >
                    <SelectTrigger
                        aria-label="Filtrer par catégorie"
                        className={cn(atelierSelectTriggerClass, "sm:w-56")}
                    >
                        <SelectValue placeholder="Toutes les catégories" />
                    </SelectTrigger>
                    <SelectContent animate>
                        {categories.map((c, index) => (
                            <SelectItem key={c} value={c} index={index} animate>
                                {c === "all" ? "Toutes les catégories" : c}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            {isLoadingBooks ? (
                <div className="border-border bg-card rounded-xl border-2">
                    <SkeletonRows rows={8} cols={7} />
                </div>
            ) : filtered.length === 0 ? (
                <div className="border-border bg-card rounded-xl border-2">
                    <EmptyState
                        message="Aucun livre trouvé"
                        hint="Modifiez le titre recherché ou le filtre de catégorie."
                    />
                </div>
            ) : (
                <>
                    <DataTable
                        columns={columns}
                        rows={slice}
                        viewLabel="Voir le livre"
                        viewHref={(b) => `/books/${b.id}-${slugify(b.title)}`}
                        onDelete={setPending}
                    />
                    <Pagination
                        currentPage={page}
                        totalCount={filtered.length}
                        perPage={perPage}
                        onPageChange={setPage}
                        className="my-6"
                    />
                </>
            )}

            <ConfirmDialog
                open={!!pending}
                onCancel={() => setPending(null)}
                onConfirm={confirmDelete}
                loading={isDeletingBook}
                title="Supprimer ce livre ?"
                confirmLabel="Supprimer le livre"
                warning="Les critiques rattachées à ce livre seront également retirées du catalogue."
            >
                {pending && (
                    <>
                        «{" "}
                        <span className="font-quote text-foreground">
                            {pending.title}
                        </span>{" "}
                        » de {pending.author.firstname}{" "}
                        {pending.author.lastname} sera retiré de la
                        bibliothèque.
                    </>
                )}
            </ConfirmDialog>
        </section>
    );
}
