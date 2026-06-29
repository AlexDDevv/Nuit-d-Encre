import { cn } from "@/lib/utils";
import { FeedAvatarProps } from "@/types/types";

const TONE_BORDER = {
    gold: "border-primary/45",
    deep: "border-secondary/70",
} as const;

const TONE_MONOGRAM = {
    gold: "from-primary/20 text-primary",
    deep: "from-secondary/45 text-secondary-foreground",
} as const;

/**
 * Médaillon de l'acteur posé sur le filet du fil : avatar s'il existe, sinon
 * monogramme doré (abonnements) ou profond (découverte / communauté).
 */
export default function FeedAvatar({
    userName,
    avatar,
    tone = "gold",
    className,
}: FeedAvatarProps) {
    if (avatar) {
        return (
            <img
                src={avatar}
                alt=""
                className={cn(
                    "relative z-10 h-11 w-11 shrink-0 rounded-full border-2 object-cover",
                    TONE_BORDER[tone],
                    className,
                )}
            />
        );
    }

    const initials = userName
        .trim()
        .split(/\s+/)
        .map((part) => part[0])
        .slice(0, 2)
        .join("")
        .toUpperCase();

    return (
        <span
            aria-hidden="true"
            className={cn(
                "bg-background font-title bg-linear-to-b relative z-10 grid h-11 w-11 shrink-0 place-items-center rounded-full border-2 to-transparent text-base font-black",
                TONE_BORDER[tone],
                TONE_MONOGRAM[tone],
                className,
            )}
        >
            {initials}
        </span>
    );
}
