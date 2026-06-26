import { Link } from "react-router-dom";
import UserLink from "@/components/sections/profile/UserLink";
import { describeAction, formatRelativeDate } from "@/lib/profileActivity";
import { feedTargetHref } from "./feedTargetHref";
import { FeedEntry } from "@/types/types";

/** Une entrée du fil : acteur cliquable + libellé d'action + date + lien cible. */
export default function FeedEntryCard({ entry }: { entry: FeedEntry }) {
    const { label } = describeAction({
        type: entry.type,
        xp: 0,
        createdAt: entry.createdAt,
        metadata: entry.metadata,
    });
    const href = feedTargetHref(entry);

    return (
        <article className="border-border bg-card/60 flex flex-col gap-2 rounded-xl border-2 p-4">
            <div className="flex items-center justify-between gap-3">
                <UserLink
                    id={entry.actor.id}
                    userName={entry.actor.userName}
                    avatar={entry.actor.avatar}
                    size="sm"
                />
                <span className="text-muted-foreground font-body text-xs">
                    {formatRelativeDate(entry.createdAt)}
                </span>
            </div>
            <p className="text-foreground/85 font-body text-sm">
                {label}
                {href && (
                    <>
                        {" — "}
                        <Link to={href} className="text-primary hover:underline">
                            voir la fiche
                        </Link>
                    </>
                )}
            </p>
        </article>
    );
}
