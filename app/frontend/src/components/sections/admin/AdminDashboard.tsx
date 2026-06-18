import type { IconType } from "react-icons";
import { Link } from "react-router-dom";
import {
    LuAward,
    LuBookOpen,
    LuCircleCheck,
    LuFeather,
    LuSquarePen,
    LuStar,
    LuThumbsUp,
    LuUserPlus,
} from "react-icons/lu";
import type { ReactNode } from "react";
import { cn, slugify } from "@/lib/utils";
import type { AdminRecentActivity, UserActionType } from "@/types/types";
import { Avatar } from "@/components/sections/admin/ui/Avatar";
import { NoteBadge } from "@/components/sections/admin/ui/chips";
import { SkeletonRows } from "@/components/sections/admin/ui/feedback";
import {
    actionLabel,
    formatDate,
    formatRelative,
} from "@/components/sections/admin/adminFormat";

/** En-tête d'un bloc du dashboard. */
function BlockHead({
    icon: Icon,
    title,
    meta,
}: {
    icon: IconType;
    title: string;
    meta?: string;
}) {
    return (
        <div className="flex items-center justify-between gap-3 border-b-2 border-border px-5 py-3.5">
            <div className="flex items-center gap-2.5">
                <span className="grid h-8 w-8 place-items-center rounded-lg border-2 border-border bg-popover text-primary/80">
                    <Icon size={16} />
                </span>
                <h3 className="font-quote text-[16px] font-medium uppercase tracking-[0.16em] text-foreground/90">
                    {title}
                </h3>
            </div>
            {meta && (
                <span className="font-body text-[11px] uppercase tracking-[0.14em] text-muted-foreground/70">
                    {meta}
                </span>
            )}
        </div>
    );
}

function DashBlock({
    icon,
    title,
    meta,
    children,
}: {
    icon: IconType;
    title: string;
    meta?: string;
    children: ReactNode;
}) {
    return (
        <div className="overflow-hidden rounded-xl border-2 border-border bg-card">
            <BlockHead icon={icon} title={title} meta={meta} />
            {children}
        </div>
    );
}

function RecentUsers({ users }: { users: AdminRecentActivity["recentUsers"] }) {
    return (
        <DashBlock icon={LuUserPlus} title="Inscriptions récentes" meta="5 derniers">
            <ul className="divide-y-2 divide-border/55">
                {users.map((u) => (
                    <li
                        key={u.id}
                        className="flex items-center gap-3.5 px-5 py-3 transition-colors hover:bg-muted/25"
                    >
                        <Avatar name={u.userName} avatar={u.avatar} size={40} />
                        <div className="min-w-0 flex-1">
                            <span className="truncate font-body text-[14.5px] font-bold text-foreground">
                                {u.userName}
                            </span>
                            <span className="block truncate font-body text-[12.5px] text-muted-foreground">
                                {u.email}
                            </span>
                        </div>
                        <span className="shrink-0 font-body text-[12px] text-muted-foreground/80">
                            {formatDate(u.createdAt)}
                        </span>
                    </li>
                ))}
            </ul>
        </DashBlock>
    );
}

function RecentBooks({ books }: { books: AdminRecentActivity["recentBooks"] }) {
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

function RecentReviews({
    reviews,
}: {
    reviews: AdminRecentActivity["recentReviews"];
}) {
    return (
        <DashBlock icon={LuSquarePen} title="Critiques récentes" meta="5 dernières">
            <ul className="divide-y-2 divide-border/55">
                {reviews.map((r) => (
                    <li
                        key={r.id}
                        className="px-5 py-3.5 transition-colors hover:bg-muted/25"
                    >
                        <div className="flex items-start justify-between gap-3">
                            <div className="min-w-0">
                                <span className="block truncate font-quote text-[15px] text-foreground">
                                    « {r.book.title} »
                                </span>
                                <span className="font-body text-[12.5px] text-muted-foreground">
                                    par{" "}
                                    <span className="text-foreground/75">
                                        {r.user.userName}
                                    </span>{" "}
                                    · {formatDate(r.createdAt)}
                                </span>
                            </div>
                            <NoteBadge note={r.rating} />
                        </div>
                        {r.reviewText && (
                            <p className="mt-1.5 line-clamp-2 font-body text-[13px] italic leading-snug text-muted-foreground/90">
                                {r.reviewText}
                            </p>
                        )}
                    </li>
                ))}
            </ul>
        </DashBlock>
    );
}

const XP_ICON: Record<UserActionType, IconType> = {
    BOOK_ADDED: LuBookOpen,
    AUTHOR_ADDED: LuFeather,
    BOOK_ADDED_TO_LIBRARY: LuBookOpen,
    BOOK_FINISHED: LuCircleCheck,
    BOOK_RECOMMENDED: LuThumbsUp,
    REVIEW_CREATED: LuSquarePen,
    DETAILED_REVIEW_BONUS: LuSquarePen,
    REVIEW_VOTED_HELPFUL: LuThumbsUp,
    BOOK_IMPORTED: LuBookOpen,
    BOOK_COMPLETED: LuStar,
    AUTHOR_COMPLETED: LuStar,
};

const XP_VERB: Record<UserActionType, string> = {
    BOOK_ADDED: "a ajouté",
    AUTHOR_ADDED: "a ajouté l'auteur",
    BOOK_ADDED_TO_LIBRARY: "a ajouté à sa bibliothèque",
    BOOK_FINISHED: "a terminé",
    BOOK_RECOMMENDED: "a recommandé",
    REVIEW_CREATED: "a critiqué",
    DETAILED_REVIEW_BONUS: "a détaillé sa critique de",
    REVIEW_VOTED_HELPFUL: "a soutenu une critique de",
    BOOK_IMPORTED: "a importé",
    BOOK_COMPLETED: "a complété",
    AUTHOR_COMPLETED: "a complété l'auteur",
};

function XpJournal({
    actions,
}: {
    actions: AdminRecentActivity["recentActions"];
}) {
    return (
        <DashBlock
            icon={LuAward}
            title="Journal de bord — XP"
            meta="10 dernières actions"
        >
            <div className="relative px-5 py-4">
                <span className="absolute bottom-5 left-[39px] top-5 w-px bg-border" />
                <ul className="flex flex-col gap-4">
                    {actions.map((ev) => {
                        const Icon = XP_ICON[ev.type] ?? LuBookOpen;
                        const verb = XP_VERB[ev.type] ?? "a contribué";
                        const label = actionLabel(ev.metadata);
                        return (
                            <li
                                key={ev.id}
                                className="relative flex items-start gap-3.5"
                            >
                                <span className="relative z-10 grid h-9 w-9 shrink-0 place-items-center rounded-full border-2 border-border bg-popover text-primary/70">
                                    <Icon size={15} />
                                </span>
                                <div className="min-w-0 flex-1 pt-1">
                                    <p className="font-body text-[13.5px] leading-snug text-foreground/90">
                                        <span className="font-bold text-foreground">
                                            {ev.userName}
                                        </span>{" "}
                                        <span className="text-muted-foreground">
                                            {verb}
                                        </span>{" "}
                                        {label && (
                                            <span className="text-foreground/85">
                                                « {label} »
                                            </span>
                                        )}
                                    </p>
                                    <div className="mt-1 flex items-center gap-2.5">
                                        {ev.xp > 0 && (
                                            <span className="inline-flex items-center rounded-full border border-primary/40 bg-primary/10 px-2 py-0.5 font-title text-[11.5px] font-bold text-primary">
                                                +{ev.xp} XP
                                            </span>
                                        )}
                                        <span className="font-body text-[11.5px] text-muted-foreground/75">
                                            {formatRelative(ev.createdAt)}
                                        </span>
                                    </div>
                                </div>
                            </li>
                        );
                    })}
                </ul>
            </div>
        </DashBlock>
    );
}

/** Onglet Dashboard : vue d'ensemble de l'activité récente. */
export function AdminDashboard({
    activity,
    loading,
}: {
    activity?: AdminRecentActivity;
    loading?: boolean;
}) {
    if (loading || !activity) {
        return (
            <div
                className={cn(
                    "grid grid-cols-1 items-start gap-6 lg:grid-cols-2",
                )}
            >
                {Array.from({ length: 4 }).map((_, i) => (
                    <div
                        key={i}
                        className="overflow-hidden rounded-xl border-2 border-border bg-card"
                    >
                        <SkeletonRows rows={5} cols={4} />
                    </div>
                ))}
            </div>
        );
    }

    return (
        <div className="fade-up grid grid-cols-1 items-start gap-6 lg:grid-cols-2">
            <div className="flex flex-col gap-6">
                <RecentUsers users={activity.recentUsers} />
                <RecentReviews reviews={activity.recentReviews} />
            </div>
            <div className="flex flex-col gap-6">
                <RecentBooks books={activity.recentBooks} />
                <XpJournal actions={activity.recentActions} />
            </div>
        </div>
    );
}
