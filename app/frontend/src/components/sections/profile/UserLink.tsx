import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { UserLinkProps } from "@/types/types";

/**
 * Lien réutilisable vers le profil public d'un lecteur : monogramme
 * (ou avatar) + nom, cliquable vers /profil/:id. Point d'entrée social.
 */
export default function UserLink({
    id,
    userName,
    avatar,
    size = "md",
    className,
}: UserLinkProps) {
    const initials = userName.slice(0, 2).toUpperCase();
    const box = size === "sm" ? "h-8 w-8 text-sm" : "h-12 w-12 text-lg";

    return (
        <Link
            to={`/profil/${id}`}
            className={cn(
                "group inline-flex items-center gap-2.5 rounded-full",
                "focus-visible:ring-primary/50 focus-visible:ring-2 focus-visible:outline-none",
                className,
            )}
        >
            {avatar ? (
                <img
                    src={avatar}
                    alt=""
                    className={cn("shrink-0 rounded-full object-cover", box)}
                />
            ) : (
                <span
                    className={cn(
                        "text-primary font-quote grid shrink-0 place-items-center rounded-full leading-none",
                        "bg-[radial-gradient(circle_at_32%_26%,hsl(43_30%_31%),hsl(20_3%_13%)_82%)]",
                        "shadow-[inset_0_0_0_1px_hsl(43_59%_81%/0.28)]",
                        box,
                    )}
                >
                    {initials}
                </span>
            )}
            <span className="text-foreground group-hover:text-primary font-title text-sm font-medium transition-colors">
                {userName}
            </span>
        </Link>
    );
}
