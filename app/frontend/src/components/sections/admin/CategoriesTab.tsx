import { useState } from "react";
import { LuBookOpen, LuCheck, LuHash, LuPencil, LuPlus, LuTag, LuX } from "react-icons/lu";
import { useAdminCategories } from "@/hooks/admin/useAdminCategories";
import { useAdminMutations } from "@/hooks/admin/useAdminMutations";
import { useToast } from "@/hooks/toast/useToast";
import type { AdminCategoryRow } from "@/types/types";
import Button from "@/components/UI/Button/Button";
import { DeleteBtn } from "@/components/sections/admin/ui/DataTable";
import { EmptyState, SkeletonRows } from "@/components/sections/admin/ui/feedback";
import { ConfirmDialog } from "@/components/sections/admin/ui/ConfirmDialog";

/** Onglet Catégories : liste non paginée avec création et renommage inline. */
export function CategoriesTab() {
    const { categories, isLoadingCategories } = useAdminCategories();
    const {
        createCategory,
        renameCategory,
        deleteCategory,
        isCreatingCategory,
        isDeletingCategory,
    } = useAdminMutations();
    const { showToast } = useToast();

    const [draft, setDraft] = useState("");
    const [editing, setEditing] = useState<{ id: string; value: string } | null>(
        null,
    );
    const [pending, setPending] = useState<AdminCategoryRow | null>(null);

    const create = async () => {
        const name = draft.trim();
        if (!name) return;
        try {
            await createCategory(name);
            setDraft("");
            showToast({
                type: "success",
                title: "Catégorie créée",
                description: `« ${name} » a été ajoutée.`,
            });
        } catch (error) {
            showToast({
                type: "error",
                title: "Création impossible",
                description: (error as Error).message,
            });
        }
    };

    const saveRename = async () => {
        if (!editing) return;
        const value = editing.value.trim();
        const target = editing;
        setEditing(null);
        if (!value) return;
        try {
            await renameCategory(target.id, value);
        } catch (error) {
            showToast({
                type: "error",
                title: "Renommage impossible",
                description: (error as Error).message,
            });
        }
    };

    const confirmDelete = async () => {
        if (!pending) return;
        try {
            await deleteCategory(pending.id);
            showToast({
                type: "success",
                title: "Catégorie supprimée",
                description: `« ${pending.name} » a été supprimée.`,
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

    return (
        <section className="fade-up flex flex-col gap-5">
            {/* Création inline */}
            <div className="rounded-xl border-2 border-border bg-card p-4">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                    <div className="flex items-center gap-2.5 sm:flex-1">
                        <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg border-2 border-border bg-popover text-primary/80">
                            <LuTag size={16} />
                        </span>
                        <input
                            value={draft}
                            onChange={(e) => setDraft(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && create()}
                            placeholder="Nom de la nouvelle catégorie…"
                            aria-label="Nom de la catégorie"
                            className="w-full rounded-lg border-2 border-border bg-popover/70 px-3.5 py-2 font-body text-sm text-foreground placeholder:text-muted-foreground/55 transition-colors focus:border-primary/60 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/35"
                        />
                    </div>
                    <Button
                        variant="primary"
                        onClick={create}
                        disabled={isCreatingCategory}
                        loading={isCreatingCategory}
                        leftIcon={<LuPlus size={16} />}
                        className="shrink-0"
                    >
                        Créer la catégorie
                    </Button>
                </div>
            </div>

            {isLoadingCategories ? (
                <div className="rounded-xl border-2 border-border bg-card">
                    <SkeletonRows rows={6} cols={4} />
                </div>
            ) : categories.length === 0 ? (
                <div className="rounded-xl border-2 border-border bg-card">
                    <EmptyState
                        message="Aucune catégorie"
                        hint="Créez la première catégorie ci-dessus."
                    />
                </div>
            ) : (
                <div className="overflow-hidden rounded-xl border-2 border-border bg-card">
                    {/* Bureau */}
                    <table className="hidden w-full border-collapse text-left sm:table">
                        <thead>
                            <tr className="border-b-2 border-border bg-muted/30">
                                <th className="px-4 py-3 font-body text-[11px] font-bold uppercase tracking-[0.13em] text-muted-foreground">
                                    Nom
                                </th>
                                <th className="px-4 py-3 text-center font-body text-[11px] font-bold uppercase tracking-[0.13em] text-muted-foreground">
                                    Livres associés
                                </th>
                                <th className="px-4 py-3 font-body text-[11px] font-bold uppercase tracking-[0.13em] text-muted-foreground">
                                    Créée par
                                </th>
                                <th className="px-4 py-3 font-body text-[11px] font-bold uppercase tracking-[0.13em] text-muted-foreground">
                                    Créée le
                                </th>
                                <th className="px-4 py-3 text-right font-body text-[11px] font-bold uppercase tracking-[0.13em] text-muted-foreground">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y-2 divide-border/45">
                            {categories.map((c) => (
                                <tr
                                    key={c.id}
                                    className="group transition-colors hover:bg-muted/20"
                                >
                                    <td className="px-4 py-3">
                                        {editing?.id === c.id ? (
                                            <div className="flex items-center gap-2">
                                                <input
                                                    autoFocus
                                                    value={editing.value}
                                                    onChange={(e) =>
                                                        setEditing({
                                                            ...editing,
                                                            value: e.target.value,
                                                        })
                                                    }
                                                    onKeyDown={(e) => {
                                                        if (e.key === "Enter")
                                                            saveRename();
                                                        if (e.key === "Escape")
                                                            setEditing(null);
                                                    }}
                                                    className="w-48 rounded-md border-2 border-primary/50 bg-popover px-2.5 py-1 font-quote text-[15px] text-foreground focus:outline-none"
                                                />
                                                <button
                                                    onClick={saveRename}
                                                    aria-label="Valider"
                                                    className="grid h-7 w-7 place-items-center rounded-md border-2 border-success bg-success/80 text-white transition-colors hover:bg-transparent hover:text-success"
                                                >
                                                    <LuCheck size={14} />
                                                </button>
                                                <button
                                                    onClick={() =>
                                                        setEditing(null)
                                                    }
                                                    aria-label="Annuler"
                                                    className="grid h-7 w-7 place-items-center rounded-md border-2 border-border text-muted-foreground transition-colors hover:text-foreground"
                                                >
                                                    <LuX size={14} />
                                                </button>
                                            </div>
                                        ) : (
                                            <span className="inline-flex items-center gap-2 font-quote text-[16px] text-foreground">
                                                <LuHash
                                                    size={14}
                                                    className="text-primary/50"
                                                />
                                                {c.name}
                                            </span>
                                        )}
                                    </td>
                                    <td className="px-4 py-3 text-center">
                                        <span className="inline-flex items-center gap-1.5 rounded-full border border-secondary/60 bg-secondary/35 px-2.5 py-0.5 font-title text-[12.5px] font-bold text-secondary-foreground">
                                            <LuBookOpen size={12} />{" "}
                                            {c.books.length}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3 font-body text-[12.5px] text-muted-foreground">
                                        {c.createdBy?.userName ?? "—"}
                                    </td>
                                    <td className="whitespace-nowrap px-4 py-3 font-body text-[12.5px] text-muted-foreground">
                                        {new Date(
                                            c.createdAt,
                                        ).toLocaleDateString("fr-FR")}
                                    </td>
                                    <td className="px-4 py-3">
                                        <div className="flex items-center justify-end gap-1.5 opacity-75 transition-opacity group-hover:opacity-100">
                                            <button
                                                onClick={() =>
                                                    setEditing({
                                                        id: c.id,
                                                        value: c.name,
                                                    })
                                                }
                                                aria-label="Renommer"
                                                title="Renommer"
                                                className="grid h-8 w-8 place-items-center rounded-md border-2 border-border text-muted-foreground transition-all hover:border-primary hover:text-primary"
                                            >
                                                <LuPencil size={14} />
                                            </button>
                                            <DeleteBtn
                                                onClick={() => setPending(c)}
                                            />
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {/* Mobile */}
                    <ul className="divide-y-2 divide-border/45 sm:hidden">
                        {categories.map((c) => (
                            <li
                                key={c.id}
                                className="flex items-center justify-between gap-3 px-4 py-3.5"
                            >
                                <div className="min-w-0">
                                    {editing?.id === c.id ? (
                                        <div className="flex items-center gap-2">
                                            <input
                                                autoFocus
                                                value={editing.value}
                                                onChange={(e) =>
                                                    setEditing({
                                                        ...editing,
                                                        value: e.target.value,
                                                    })
                                                }
                                                className="w-32 rounded-md border-2 border-primary/50 bg-popover px-2 py-1 font-quote text-[15px] text-foreground focus:outline-none"
                                            />
                                            <button
                                                onClick={saveRename}
                                                aria-label="Valider"
                                                className="grid h-7 w-7 place-items-center rounded-md border-2 border-success bg-success/80 text-white"
                                            >
                                                <LuCheck size={14} />
                                            </button>
                                        </div>
                                    ) : (
                                        <>
                                            <div className="font-quote text-[16px] text-foreground">
                                                {c.name}
                                            </div>
                                            <div className="font-body text-[12px] text-muted-foreground">
                                                {c.books.length} livre(s) ·{" "}
                                                {new Date(
                                                    c.createdAt,
                                                ).toLocaleDateString("fr-FR")}
                                            </div>
                                        </>
                                    )}
                                </div>
                                <div className="flex shrink-0 items-center gap-1.5">
                                    <button
                                        onClick={() =>
                                            setEditing({
                                                id: c.id,
                                                value: c.name,
                                            })
                                        }
                                        aria-label="Renommer"
                                        className="grid h-8 w-8 place-items-center rounded-md border-2 border-border text-muted-foreground hover:border-primary hover:text-primary"
                                    >
                                        <LuPencil size={14} />
                                    </button>
                                    <DeleteBtn onClick={() => setPending(c)} />
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            <ConfirmDialog
                open={!!pending}
                onCancel={() => setPending(null)}
                onConfirm={confirmDelete}
                loading={isDeletingCategory}
                title="Supprimer cette catégorie ?"
                confirmLabel="Supprimer la catégorie"
                warning={
                    pending && pending.books.length > 0
                        ? `${pending.books.length} livre(s) sont rattachés à cette catégorie. Ils se retrouveront sans catégorie.`
                        : undefined
                }
            >
                {pending && (
                    <>
                        La catégorie «{" "}
                        <span className="font-quote text-foreground">
                            {pending.name}
                        </span>{" "}
                        » sera supprimée.
                    </>
                )}
            </ConfirmDialog>
        </section>
    );
}
