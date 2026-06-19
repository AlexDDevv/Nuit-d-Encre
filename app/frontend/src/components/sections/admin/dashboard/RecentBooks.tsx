import { Link } from "react-router-dom";
import { LuBookOpen } from "react-icons/lu";
import { slugify } from "@/lib/utils";
import type { AdminRecentActivity } from "@/types/types";
import { formatDate } from "@/components/sections/admin/adminFormat";
import DashBlock from "./DashBlock";

export default function RecentBooks({
    books,
}: {
    books: AdminRecentActivity["recentBooks"];
}) {
    return (
        <DashBlock icon={LuBookOpen} title="Livres ajoutés" meta="5 derniers">
            <ul className="divide-y-2 divide-border/55">
                {books.map((b) => (
                    <li
                        key={b.id}
                        className="flex items-center gap-3.5 px-5 py-3 transition-colors hover:bg-muted/25"
                    >
                        <span className="grid h-11 w-8 shrink-0 place-items-center rounded border-2 border-border bg-gradient-to-b from-secondary/30 to-popover text-[9px] text-primary/55">
                            ◆
                        </span>
                        <div className="min-w-0 flex-1">
                            <Link
                                to={`/books/${b.id}-${slugify(b.title)}`}
                                className="block truncate font-quote text-[15.5px] text-foreground hover:text-primary"
                            >
                                {b.title}
                            </Link>
                            <span className="block truncate font-body text-[12.5px] text-muted-foreground">
                                {b.author.firstname} {b.author.lastname}
                            </span>
                        </div>
                        <div className="hidden shrink-0 flex-col items-end gap-1 sm:flex">
                            {b.category && (
                                <span className="inline-flex items-center rounded-full border border-border bg-muted/70 px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-[0.12em] text-muted-foreground">
                                    {b.category.name}
                                </span>
                            )}
                            <span className="font-body text-[11.5px] text-muted-foreground/75">
                                {formatDate(b.createdAt)}
                            </span>
                        </div>
                    </li>
                ))}
            </ul>
        </DashBlock>
    );
}
