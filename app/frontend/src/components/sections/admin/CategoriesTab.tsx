import { useState } from "react";
import { LuPlus, LuTag } from "react-icons/lu";
import { useAdminCategories } from "@/hooks/admin/useAdminCategories";
import { useAdminMutations } from "@/hooks/admin/useAdminMutations";
import { useToast } from "@/hooks/toast/useToast";
import type { AdminCategoryRow } from "@/types/types";
import Button from "@/components/UI/Button/Button";
import { EmptyState, SkeletonRows } from "@/components/sections/admin/ui/feedback";
import { ConfirmDialog } from "@/components/sections/admin/ui/ConfirmDialog";
import CategoriesTable from "./categories/CategoriesTable";

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
                <CategoriesTable
                    categories={categories}
                    editing={editing}
                    setEditing={setEditing}
                    onSaveRename={saveRename}
                    onDelete={setPending}
                />
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
