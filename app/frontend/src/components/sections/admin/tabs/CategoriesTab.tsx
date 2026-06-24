import { useState } from "react";
import { LuPlus, LuTag } from "react-icons/lu";
import { useAdminCategories } from "@/hooks/admin/useAdminCategories";
import { useAdminMutations } from "@/hooks/admin/useAdminMutations";
import { useToast } from "@/hooks/toast/useToast";
import type { AdminCategoryRow } from "@/types/types";
import Button from "@/components/UI/Button/Button";
import { Input } from "@/components/UI/form/Input";
import { atelierControlClass } from "@/components/sections/shared/atelierField";
import {
    EmptyState,
    SkeletonRows,
} from "@/components/sections/admin/ui/feedback";
import { ConfirmDialog } from "@/components/sections/admin/ui/ConfirmDialog";
import CategoriesTable from "../categories/CategoriesTable";

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
    const [editing, setEditing] = useState<{
        id: string;
        value: string;
    } | null>(null);
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
            <div className="border-border bg-card rounded-xl border-2 p-4">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                    <div className="flex items-center gap-2.5 sm:flex-1">
                        <span className="border-border bg-popover text-primary/80 grid h-10 w-10 shrink-0 place-items-center rounded-lg border-2">
                            <LuTag size={16} />
                        </span>
                        <Input
                            value={draft}
                            onChange={(e) => setDraft(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && create()}
                            placeholder="Nom de la nouvelle catégorie…"
                            aria-label="Nom de la catégorie"
                            errorMessage=""
                            hideErrorMessage
                            className={atelierControlClass}
                        />
                    </div>
                    <Button
                        variant="primary"
                        onClick={create}
                        disabled={isCreatingCategory}
                        loading={isCreatingCategory}
                        leftIcon={<LuPlus size={16} />}
                    >
                        Créer la catégorie
                    </Button>
                </div>
            </div>

            {isLoadingCategories ? (
                <div className="border-border bg-card rounded-xl border-2">
                    <SkeletonRows rows={6} cols={4} />
                </div>
            ) : categories.length === 0 ? (
                <div className="border-border bg-card rounded-xl border-2">
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
