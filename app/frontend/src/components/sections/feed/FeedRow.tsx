import { Link } from "react-router-dom";
import FeedAvatar from "./FeedAvatar";
import FeedTargetLink from "./FeedTargetLink";
import LevelBadge from "@/components/sections/shared/LevelBadge";
import {
    CATEGORY_ICON,
    CATEGORY_LABEL,
} from "@/components/sections/shared/activityCategory";
import { describeFeedEntry, formatRelativeDate } from "@/lib/profileActivity";
import { FeedRowProps } from "@/types/types";

/**
 * Une entrée du fil : médaillon de l'acteur sur le filet, nom cliquable + niveau,
 * repère catégoriel, libellé d'action, chip de cible et horodatage relatif.
 */
export default function FeedRow({ entry, discovery }: FeedRowProps) {
    const { label, kind } = describeFeedEntry(entry);
    const Icon = CATEGORY_ICON[kind];
    const created = new Date(entry.createdAt);

    return (
        <li className="fade-up relative flex items-start gap-4">
            <FeedAvatar
                userName={entry.actor.userName}
                avatar={entry.actor.avatar}
                tone={discovery ? "deep" : "gold"}
            />
            <div className="min-w-0 flex-1 pb-1">
                <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1">
                    <Link
                        to={`/profil/${entry.actor.id}`}
                        className="text-foreground hover:text-primary focus-visible:ring-primary/70 font-body text-base font-bold underline-offset-4 transition-colors duration-200 hover:underline focus-visible:rounded focus-visible:outline-none focus-visible:ring-2"
                    >
                        {entry.actor.userName}
                    </Link>
                    <LevelBadge level={entry.actor.level} />
                </div>

                <div className="mt-1.5 flex items-start gap-2.5">
                    <span
                        aria-hidden="true"
                        title={CATEGORY_LABEL[kind]}
                        className="border-border bg-popover text-primary/80 grid h-7 w-7 shrink-0 place-items-center rounded-md border"
                    >
                        <Icon size={15} />
                    </span>
                    <div className="min-w-0 pt-0.5">
                        <p className="text-foreground/85 font-body text-base leading-snug text-pretty">
                            {label}
                        </p>
                        <FeedTargetLink entry={entry} />
                        <p className="mt-1.5 flex flex-wrap items-center gap-x-2 gap-y-0.5">
                            <span className="text-primary/65 font-title text-xxs font-bold uppercase tracking-[0.16em]">
                                {CATEGORY_LABEL[kind]}
                            </span>
                            <span
                                aria-hidden="true"
                                className="text-muted-foreground/40"
                            >
                                ·
                            </span>
                            <time
                                dateTime={created.toISOString()}
                                title={created.toLocaleString("fr-FR", {
                                    dateStyle: "long",
                                    timeStyle: "short",
                                })}
                                className="text-muted-foreground font-body text-xs"
                            >
                                {formatRelativeDate(entry.createdAt)}
                            </time>
                        </p>
                    </div>
                </div>
            </div>
        </li>
    );
}
