import { LuBookOpen, LuCheck, LuHash, LuPencil, LuX } from "react-icons/lu";
import type { AdminCategoryRow } from "@/types/types";
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
        <div className="overflow-hidden rounded-xl border-2 border-border bg-card">
            {/* Bureau */}
            <table className="hidden w-full border-collapse text-left sm:table">
                <thead>
                    <tr className="border-b-2 border-border bg-muted/30">
                        <th className="px-4 py-3 font-body text-xs font-bold uppercase tracking-[0.13em] text-muted-foreground">
                            Nom
                        </th>
                        <th className="px-4 py-3 text-center font-body text-xs font-bold uppercase tracking-[0.13em] text-muted-foreground">
                            Livres associés
                        </th>
                        <th className="px-4 py-3 font-body text-xs font-bold uppercase tracking-[0.13em] text-muted-foreground">
                            Créée par
                        </th>
                        <th className="px-4 py-3 font-body text-xs font-bold uppercase tracking-[0.13em] text-muted-foreground">
                            Créée le
                        </th>
                        <th className="px-4 py-3 text-right font-body text-xs font-bold uppercase tracking-[0.13em] text-muted-foreground">
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
                                                    onSaveRename();
                                                if (e.key === "Escape")
                                                    setEditing(null);
                                            }}
                                            className="w-48 rounded-md border-2 border-primary/50 bg-popover px-2.5 py-1 font-quote text-base text-foreground focus:outline-none"
                                        />
                                        <button
                                            onClick={onSaveRename}
                                            aria-label="Valider"
                                            className="grid h-7 w-7 place-items-center rounded-md border-2 border-success bg-success/80 text-white transition-colors hover:bg-transparent hover:text-success"
                                        >
                                            <LuCheck size={14} />
                                        </button>
                                        <button
                                            onClick={() => setEditing(null)}
                                            aria-label="Annuler"
                                            className="grid h-7 w-7 place-items-center rounded-md border-2 border-border text-muted-foreground transition-colors hover:text-foreground"
                                        >
                                            <LuX size={14} />
                                        </button>
                                    </div>
                                ) : (
                                    <span className="inline-flex items-center gap-2 font-quote text-base text-foreground">
                                        <LuHash
                                            size={14}
                                            className="text-primary/50"
                                        />
                                        {c.name}
                                    </span>
                                )}
                            </td>
                            <td className="px-4 py-3 text-center">
                                <span className="inline-flex items-center gap-1.5 rounded-full border border-secondary/60 bg-secondary/35 px-2.5 py-0.5 font-title text-xs font-bold text-secondary-foreground">
                                    <LuBookOpen size={12} /> {c.books.length}
                                </span>
                            </td>
                            <td className="px-4 py-3 font-body text-xs text-muted-foreground">
                                {c.createdBy?.userName ?? "—"}
                            </td>
                            <td className="whitespace-nowrap px-4 py-3 font-body text-xs text-muted-foreground">
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
                                        className="grid h-8 w-8 place-items-center rounded-md border-2 border-border text-muted-foreground transition-all hover:border-primary hover:text-primary"
                                    >
                                        <LuPencil size={14} />
                                    </button>
                                    <DeleteBtn onClick={() => onDelete(c)} />
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
                                        className="w-32 rounded-md border-2 border-primary/50 bg-popover px-2 py-1 font-quote text-base text-foreground focus:outline-none"
                                    />
                                    <button
                                        onClick={onSaveRename}
                                        aria-label="Valider"
                                        className="grid h-7 w-7 place-items-center rounded-md border-2 border-success bg-success/80 text-white"
                                    >
                                        <LuCheck size={14} />
                                    </button>
                                </div>
                            ) : (
                                <>
                                    <div className="font-quote text-base text-foreground">
                                        {c.name}
                                    </div>
                                    <div className="font-body text-xs text-muted-foreground">
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
                                className="grid h-8 w-8 place-items-center rounded-md border-2 border-border text-muted-foreground hover:border-primary hover:text-primary"
                            >
                                <LuPencil size={14} />
                            </button>
                            <DeleteBtn onClick={() => onDelete(c)} />
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
}
