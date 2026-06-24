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
            className="font-body text-muted-foreground hover:text-primary focus-visible:ring-primary/40 inline-flex items-center gap-1.5 whitespace-nowrap rounded-md px-2 py-1 text-xs font-bold transition-colors duration-200 focus:outline-none focus-visible:ring-2"
        >
            <LuEye /> {label}
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
            className="border-border text-muted-foreground hover:border-destructive hover:bg-destructive/12 hover:text-destructive focus-visible:ring-destructive/50 grid h-8 w-8 place-items-center rounded-md border-2 transition-all duration-200 focus:outline-none focus-visible:ring-2"
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
            <div className="border-border bg-card hidden overflow-hidden rounded-xl border-2 lg:block">
                <div className="overflow-x-auto">
                    <table className="w-full border-collapse text-left">
                        <thead>
                            <tr className="border-border bg-muted/30 border-b-2">
                                {columns.map((c) => (
                                    <th
                                        key={c.key}
                                        className={cn(
                                            "font-body text-muted-foreground px-4 py-3 text-xs font-bold uppercase tracking-[0.13em]",
                                            c.thClass,
                                        )}
                                    >
                                        {c.header}
                                    </th>
                                ))}
                                <th className="font-body text-muted-foreground px-4 py-3 text-right text-xs font-bold uppercase tracking-[0.13em]">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-border/45 divide-y-2">
                            {rows.map((row) => (
                                <tr
                                    key={row.id}
                                    className="hover:bg-muted/20 group transition-colors duration-150"
                                >
                                    {columns.map((c) => (
                                        <td
                                            key={c.key}
                                            className={cn(
                                                "px-4 py-3 align-middle",
                                                c.tdClass ??
                                                    "font-body text-foreground/90 text-sm",
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
                        className="border-border bg-card rounded-xl border-2 p-4"
                    >
                        {primary && (
                            <div className="border-border/50 mb-3 border-b-2 pb-3">
                                {primary.cell(row)}
                            </div>
                        )}
                        <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-2">
                            {rest.map((c) => (
                                <Fragment key={c.key}>
                                    <dt className="font-body text-muted-foreground/70 text-xs font-bold uppercase tracking-widest">
                                        {c.header}
                                    </dt>
                                    <dd className="font-body text-foreground/90 text-right text-sm">
                                        {c.cell(row)}
                                    </dd>
                                </Fragment>
                            ))}
                        </dl>
                        <div className="border-border/50 mt-4 flex items-center justify-end gap-2 border-t-2 pt-3">
                            <ViewLink label={viewLabel} href={viewHref(row)} />
                            <DeleteBtn onClick={() => onDelete(row)} />
                        </div>
                    </div>
                ))}
            </div>
        </>
    );
}
