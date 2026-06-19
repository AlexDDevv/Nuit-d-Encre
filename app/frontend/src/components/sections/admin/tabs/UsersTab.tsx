import { useState } from "react";
import { useAdminUsers } from "@/hooks/admin/useAdminUsers";
import { useAdminMutations } from "@/hooks/admin/useAdminMutations";
import { usePagination } from "@/hooks/admin/usePagination";
import { useToast } from "@/hooks/toast/useToast";
import type { AdminUserRow } from "@/types/types";
import { Avatar } from "@/components/sections/admin/ui/Avatar";
import { RoleChip } from "@/components/sections/admin/ui/chips";
import { SearchInput } from "@/components/sections/admin/ui/SearchInput";
import Pagination from "@/components/UI/Pagination";
import { EmptyState, SkeletonRows } from "@/components/sections/admin/ui/feedback";
import { ConfirmDialog } from "@/components/sections/admin/ui/ConfirmDialog";
import { DataTable, type Column } from "@/components/sections/admin/ui/DataTable";

/** Onglet Utilisateurs : liste recherchable, paginée, avec suppression de compte. */
export function UsersTab() {
    const { users, isLoadingUsers } = useAdminUsers();
    const { deleteUser, isDeletingUser } = useAdminMutations();
    const { showToast } = useToast();

    const [query, setQuery] = useState("");
    const [pending, setPending] = useState<AdminUserRow | null>(null);

    const term = query.toLowerCase();
    const filtered = users.filter(
        (u) =>
            u.userName.toLowerCase().includes(term) ||
            u.email.toLowerCase().includes(term),
    );
    const { page, setPage, slice, perPage } = usePagination(filtered, 20);

    const confirmDelete = async () => {
        if (!pending) return;
        try {
            await deleteUser(pending.id);
            showToast({
                type: "success",
                title: "Compte supprimé",
                description: `Le compte de ${pending.userName} a été supprimé.`,
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

    const columns: Column<AdminUserRow>[] = [
        {
            key: "user",
            header: "Utilisateur",
            primary: true,
            cell: (u) => (
                <div className="flex items-center gap-3">
                    <Avatar name={u.userName} avatar={u.avatar} size={38} />
                    <div className="min-w-0">
                        <div className="truncate font-body text-sm font-bold text-foreground">
                            {u.userName}
                        </div>
                    </div>
                </div>
            ),
        },
        {
            key: "email",
            header: "Email",
            cell: (u) => (
                <span className="font-body text-sm text-muted-foreground">
                    {u.email}
                </span>
            ),
        },
        {
            key: "role",
            header: "Rôle",
            cell: (u) => <RoleChip role={u.role} />,
        },
        {
            key: "level",
            header: "Niveau",
            thClass: "text-center",
            tdClass: "text-center",
            cell: (u) => (
                <span className="inline-grid h-7 w-7 place-items-center rounded-full border-2 border-primary/35 bg-primary/10 font-title text-sm font-black text-primary">
                    {u.level}
                </span>
            ),
        },
        {
            key: "xp",
            header: "XP",
            thClass: "text-right",
            tdClass: "text-right",
            cell: (u) => (
                <span className="font-title text-sm font-bold text-foreground/85">
                    {u.xp.toLocaleString("fr-FR")}
                </span>
            ),
        },
        {
            key: "inscrit",
            header: "Inscrit le",
            cell: (u) => (
                <span className="whitespace-nowrap font-body text-xs text-muted-foreground">
                    {new Date(u.createdAt).toLocaleDateString("fr-FR")}
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
                    placeholder="Rechercher par nom ou email…"
                    className="min-w-80"
                />
            </div>

            {isLoadingUsers ? (
                <div className="rounded-xl border-2 border-border bg-card">
                    <SkeletonRows rows={8} cols={6} />
                </div>
            ) : filtered.length === 0 ? (
                <div className="rounded-xl border-2 border-border bg-card">
                    <EmptyState
                        message="Aucun utilisateur trouvé"
                        hint="Affinez votre recherche pour retrouver un lecteur."
                    />
                </div>
            ) : (
                <>
                    <DataTable
                        columns={columns}
                        rows={slice}
                        viewLabel="Voir le profil"
                        viewHref={(u) => `/profil/${u.id}`}
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
                loading={isDeletingUser}
                title="Supprimer ce compte ?"
                confirmLabel="Supprimer le compte"
                warning="Cette action est irréversible. Les critiques et contributions personnelles du lecteur seront supprimées."
            >
                {pending && (
                    <>
                        Le compte de{" "}
                        <span className="font-bold text-foreground">
                            {pending.userName}
                        </span>{" "}
                        sera définitivement supprimé de la bibliothèque.
                    </>
                )}
            </ConfirmDialog>
        </section>
    );
}
