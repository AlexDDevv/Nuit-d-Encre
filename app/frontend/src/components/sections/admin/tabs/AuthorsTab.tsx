import { useState } from "react";
import { LuBookOpen, LuFeather, LuGlobe } from "react-icons/lu";
import { useAdminAuthors } from "@/hooks/admin/useAdminAuthors";
import { useAdminMutations } from "@/hooks/admin/useAdminMutations";
import { usePagination } from "@/hooks/admin/usePagination";
import { useToast } from "@/hooks/toast/useToast";
import { slugify } from "@/lib/utils";
import type { AdminAuthorRow } from "@/types/types";
import { SearchInput } from "@/components/sections/admin/ui/SearchInput";
import Pagination from "@/components/UI/Pagination";
import { EmptyState, SkeletonRows } from "@/components/sections/admin/ui/feedback";
import { ConfirmDialog } from "@/components/sections/admin/ui/ConfirmDialog";
import { DataTable, type Column } from "@/components/sections/admin/ui/DataTable";

/** Onglet Auteurs : recherche par nom, suppression (refusée si livres associés). */
export function AuthorsTab() {
    const { authors, isLoadingAuthors } = useAdminAuthors();
    const { deleteAuthor, isDeletingAuthor } = useAdminMutations();
    const { showToast } = useToast();

    const [query, setQuery] = useState("");
    const [pending, setPending] = useState<AdminAuthorRow | null>(null);

    const term = query.toLowerCase();
    const filtered = authors.filter(
        (a) =>
            a.firstname.toLowerCase().includes(term) ||
            a.lastname.toLowerCase().includes(term),
    );
    const { page, setPage, slice, perPage } = usePagination(filtered, 20);

    const confirmDelete = async () => {
        if (!pending) return;
        try {
            await deleteAuthor(pending.id);
            showToast({
                type: "success",
                title: "Auteur supprimé",
                description: `${pending.firstname} ${pending.lastname} a été retiré.`,
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

    const columns: Column<AdminAuthorRow>[] = [
        {
            key: "auteur",
            header: "Auteur",
            primary: true,
            cell: (a) => (
                <div className="flex items-center gap-3">
                    <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full border-2 border-border bg-popover text-primary/70">
                        <LuFeather size={16} />
                    </span>
                    <span className="font-quote text-base text-foreground">
                        {a.firstname}{" "}
                        <span className="font-medium">{a.lastname}</span>
                    </span>
                </div>
            ),
        },
        {
            key: "prenom",
            header: "Prénom",
            hideOnMobile: true,
            cell: (a) => (
                <span className="font-body text-sm text-foreground/85">
                    {a.firstname}
                </span>
            ),
        },
        {
            key: "nom",
            header: "Nom",
            hideOnMobile: true,
            cell: (a) => (
                <span className="font-body text-sm font-bold text-foreground/90">
                    {a.lastname}
                </span>
            ),
        },
        {
            key: "nat",
            header: "Nationalité",
            cell: (a) => (
                <span className="inline-flex items-center gap-1.5 font-body text-sm text-muted-foreground">
                    <LuGlobe size={13} className="text-primary/55" />
                    {a.nationality || "—"}
                </span>
            ),
        },
        {
            key: "nb",
            header: "Livres",
            thClass: "text-center",
            tdClass: "text-center",
            cell: (a) => (
                <span className="inline-flex items-center gap-1.5 rounded-full border border-secondary/60 bg-secondary/35 px-2.5 py-0.5 font-title text-xs font-bold text-secondary-foreground">
                    <LuBookOpen size={12} /> {a.books.length}
                </span>
            ),
        },
        {
            key: "par",
            header: "Ajouté par",
            cell: (a) => (
                <span className="font-body text-xs text-muted-foreground">
                    {a.user?.userName ?? "—"}
                </span>
            ),
        },
        {
            key: "le",
            header: "Ajouté le",
            cell: (a) => (
                <span className="whitespace-nowrap font-body text-xs text-muted-foreground">
                    {new Date(a.createdAt).toLocaleDateString("fr-FR")}
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
                    placeholder="Rechercher par prénom ou nom…"
                    className="min-w-80"
                />
            </div>

            {isLoadingAuthors ? (
                <div className="rounded-xl border-2 border-border bg-card">
                    <SkeletonRows rows={8} cols={6} />
                </div>
            ) : filtered.length === 0 ? (
                <div className="rounded-xl border-2 border-border bg-card">
                    <EmptyState
                        message="Aucun auteur trouvé"
                        hint="Essayez un autre prénom ou nom de famille."
                    />
                </div>
            ) : (
                <>
                    <DataTable
                        columns={columns}
                        rows={slice}
                        viewLabel="Voir l'auteur"
                        viewHref={(a) =>
                            `/authors/${a.id}-${slugify(a.firstname)}-${slugify(a.lastname)}`
                        }
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
                loading={isDeletingAuthor}
                title="Supprimer cet auteur ?"
                confirmLabel="Supprimer l'auteur"
                warning={
                    pending && pending.books.length > 0
                        ? `${pending.books.length} livre(s) sont associés à cet auteur ; détachez-les d'abord, la suppression sera refusée tant qu'ils existent.`
                        : undefined
                }
            >
                {pending && (
                    <>
                        L'auteur{" "}
                        <span className="font-quote text-foreground">
                            {pending.firstname} {pending.lastname}
                        </span>{" "}
                        sera retiré de la bibliothèque.
                    </>
                )}
            </ConfirmDialog>
        </section>
    );
}
