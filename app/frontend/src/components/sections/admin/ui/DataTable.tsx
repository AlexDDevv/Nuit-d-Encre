import { Fragment, type ReactNode } from "react";
import { Link } from "react-router-dom";
import { LuEye, LuTrash2 } from "react-icons/lu";
import { cn } from "@/lib/utils";

export type Column<T> = {
    key: string;
    header: string;
    cell: (row: T) => ReactNode;
    primary?: boolean;
    hideOnMobile?: boolean;
    thClass?: string;
    tdClass?: string;
};

type DataTableProps<T extends { id: string }> = {
    columns: Column<T>[];
    rows: T[];
    viewLabel: string;
    viewHref: (row: T) => string;
    onDelete: (row: T) => void;
};

/** Lien « voir » d'une ligne (profil, livre, auteur…). */
function ViewLink({ label, href }: { label: string; href: string }) {
    return (
        <Link
            to={href}
            className="inline-flex items-center gap-1.5 whitespace-nowrap rounded-md px-2 py-1 font-body text-[12.5px] font-bold text-muted-foreground transition-colors duration-200 hover:text-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
        >
            <LuEye size={14} /> {label}
        </Link>
    );
}

/** Bouton de suppression d'une ligne. */
export function DeleteBtn({
    onClick,
    label = "Supprimer",
}: {
    onClick: () => void;
    label?: string;
}) {
    return (
        <button
            onClick={onClick}
            aria-label={label}
            title={label}
            className="grid h-8 w-8 place-items-center rounded-md border-2 border-border text-muted-foreground transition-all duration-200 hover:border-destructive hover:bg-destructive/12 hover:text-destructive focus:outline-none focus-visible:ring-2 focus-visible:ring-destructive/50"
        >
            <LuTrash2 size={15} />
        </button>
    );
}

/**
 * Tableau de données générique du panel admin : vrai tableau dense sur grand
 * écran, cartes empilées sur mobile.
 */
export function DataTable<T extends { id: string }>({
    columns,
    rows,
    viewLabel,
    viewHref,
    onDelete,
}: DataTableProps<T>) {
    const primary = columns.find((c) => c.primary);
    const rest = columns.filter((c) => !c.primary && !c.hideOnMobile);

    return (
        <>
            {/* Bureau : tableau dense */}
            <div className="hidden overflow-hidden rounded-xl border-2 border-border bg-card lg:block">
                <div className="overflow-x-auto">
                    <table className="w-full border-collapse text-left">
                        <thead>
                            <tr className="border-b-2 border-border bg-muted/30">
                                {columns.map((c) => (
                                    <th
                                        key={c.key}
                                        className={cn(
                                            "px-4 py-3 font-body text-[11px] font-bold uppercase tracking-[0.13em] text-muted-foreground",
                                            c.thClass,
                                        )}
                                    >
                                        {c.header}
                                    </th>
                                ))}
                                <th className="px-4 py-3 text-right font-body text-[11px] font-bold uppercase tracking-[0.13em] text-muted-foreground">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y-2 divide-border/45">
                            {rows.map((row) => (
                                <tr
                                    key={row.id}
                                    className="group transition-colors duration-150 hover:bg-muted/20"
                                >
                                    {columns.map((c) => (
                                        <td
                                            key={c.key}
                                            className={cn(
                                                "px-4 py-3 align-middle",
                                                c.tdClass ??
                                                    "font-body text-[13.5px] text-foreground/90",
                                            )}
                                        >
                                            {c.cell(row)}
                                        </td>
                                    ))}
                                    <td className="px-4 py-3 align-middle">
                                        <div className="flex items-center justify-end gap-1.5 opacity-75 transition-opacity duration-150 group-hover:opacity-100">
                                            <ViewLink
                                                label={viewLabel}
                                                href={viewHref(row)}
                                            />
                                            <DeleteBtn
                                                onClick={() => onDelete(row)}
                                            />
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Mobile : cartes empilées */}
            <div className="flex flex-col gap-3 lg:hidden">
                {rows.map((row) => (
                    <div
                        key={row.id}
                        className="rounded-xl border-2 border-border bg-card p-4"
                    >
                        {primary && (
                            <div className="mb-3 border-b-2 border-border/50 pb-3">
                                {primary.cell(row)}
                            </div>
                        )}
                        <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-2">
                            {rest.map((c) => (
                                <Fragment key={c.key}>
                                    <dt className="font-body text-[11px] font-bold uppercase tracking-[0.1em] text-muted-foreground/70">
                                        {c.header}
                                    </dt>
                                    <dd className="text-right font-body text-[13px] text-foreground/90">
                                        {c.cell(row)}
                                    </dd>
                                </Fragment>
                            ))}
                        </dl>
                        <div className="mt-4 flex items-center justify-end gap-2 border-t-2 border-border/50 pt-3">
                            <ViewLink label={viewLabel} href={viewHref(row)} />
                            <DeleteBtn onClick={() => onDelete(row)} />
                        </div>
                    </div>
                ))}
            </div>
        </>
    );
}
