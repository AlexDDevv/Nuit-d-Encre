import { LuBookOpen, LuCheck, LuHash, LuPencil, LuX } from "react-icons/lu";
import type { AdminCategoryRow } from "@/types/types";
import { atelierInlineClass } from "@/components/sections/shared/atelierField";
import { cn } from "@/lib/utils";
import { DeleteBtn } from "@/components/sections/admin/ui/DataTable";

type Editing = { id: string; value: string } | null;

/** Tableau des catégories (vue bureau + liste mobile) avec renommage inline. */
export default function CategoriesTable({
    categories,
    editing,
    setEditing,
    onSaveRename,
    onDelete,
}: {
    categories: AdminCategoryRow[];
    editing: Editing;
    setEditing: (v: Editing) => void;
    onSaveRename: () => void;
    onDelete: (c: AdminCategoryRow) => void;
}) {
    return (
        <div className="border-border bg-card overflow-hidden rounded-xl border-2">
            {/* Bureau */}
            <table className="hidden w-full border-collapse text-left sm:table">
                <thead>
                    <tr className="border-border bg-muted/30 border-b-2">
                        <th className="font-body text-muted-foreground px-4 py-3 text-xs font-bold uppercase tracking-[0.13em]">
                            Nom
                        </th>
                        <th className="font-body text-muted-foreground px-4 py-3 text-center text-xs font-bold uppercase tracking-[0.13em]">
                            Livres associés
                        </th>
                        <th className="font-body text-muted-foreground px-4 py-3 text-xs font-bold uppercase tracking-[0.13em]">
                            Créée par
                        </th>
                        <th className="font-body text-muted-foreground px-4 py-3 text-xs font-bold uppercase tracking-[0.13em]">
                            Créée le
                        </th>
                        <th className="font-body text-muted-foreground px-4 py-3 text-right text-xs font-bold uppercase tracking-[0.13em]">
                            Actions
                        </th>
                    </tr>
                </thead>
                <tbody className="divide-border/45 divide-y-2">
                    {categories.map((c) => (
                        <tr
                            key={c.id}
                            className="hover:bg-muted/20 group transition-colors"
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
                                                    onSaveRename();
                                                if (e.key === "Escape")
                                                    setEditing(null);
                                            }}
                                            className={cn(
                                                atelierInlineClass,
                                                "font-quote w-48 text-base",
                                            )}
                                        />
                                        <button
                                            onClick={onSaveRename}
                                            aria-label="Valider"
                                            className="border-success bg-success/80 hover:text-success grid h-7 w-7 place-items-center rounded-md border-2 text-white transition-colors hover:bg-transparent"
                                        >
                                            <LuCheck />
                                        </button>
                                        <button
                                            onClick={() => setEditing(null)}
                                            aria-label="Annuler"
                                            className="border-border text-muted-foreground hover:text-foreground grid h-7 w-7 place-items-center rounded-md border-2 transition-colors"
                                        >
                                            <LuX />
                                        </button>
                                    </div>
                                ) : (
                                    <span className="font-quote text-foreground inline-flex items-center gap-2 text-base">
                                        <LuHash className="text-primary/50" />
                                        {c.name}
                                    </span>
                                )}
                            </td>
                            <td className="px-4 py-3 text-center">
                                <span className="border-secondary/60 bg-secondary/35 font-title text-secondary-foreground inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-bold">
                                    <LuBookOpen size={12} /> {c.books.length}
                                </span>
                            </td>
                            <td className="font-body text-muted-foreground px-4 py-3 text-xs">
                                {c.createdBy?.userName ?? "-"}
                            </td>
                            <td className="font-body text-muted-foreground whitespace-nowrap px-4 py-3 text-xs">
                                {new Date(c.createdAt).toLocaleDateString(
                                    "fr-FR",
                                )}
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
                                        className="border-border text-muted-foreground hover:border-primary hover:text-primary grid h-8 w-8 place-items-center rounded-md border-2 transition-all"
                                    >
                                        <LuPencil />
                                    </button>
                                    <DeleteBtn onClick={() => onDelete(c)} />
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* Mobile */}
            <ul className="divide-border/45 divide-y-2 sm:hidden">
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
                                        className={cn(
                                            atelierInlineClass,
                                            "font-quote w-32 px-2 text-base",
                                        )}
                                    />
                                    <button
                                        onClick={onSaveRename}
                                        aria-label="Valider"
                                        className="border-success bg-success/80 grid h-7 w-7 place-items-center rounded-md border-2 text-white"
                                    >
                                        <LuCheck />
                                    </button>
                                </div>
                            ) : (
                                <>
                                    <div className="font-quote text-foreground text-base">
                                        {c.name}
                                    </div>
                                    <div className="font-body text-muted-foreground text-xs">
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
                                    setEditing({ id: c.id, value: c.name })
                                }
                                aria-label="Renommer"
                                className="border-border text-muted-foreground hover:border-primary hover:text-primary grid h-8 w-8 place-items-center rounded-md border-2"
                            >
                                <LuPencil />
                            </button>
                            <DeleteBtn onClick={() => onDelete(c)} />
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
}
