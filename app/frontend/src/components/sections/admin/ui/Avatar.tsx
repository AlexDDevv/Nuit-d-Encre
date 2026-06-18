import { cn } from "@/lib/utils";

/** Teintes d'avatars nocturnes (chaudes, faiblement saturées). */
const AVATAR_TINTS: [string, string][] = [
    ["hsl(8 30% 30%)", "hsl(10 26% 18%)"],
    ["hsl(140 18% 28%)", "hsl(150 20% 16%)"],
    ["hsl(218 24% 30%)", "hsl(222 28% 17%)"],
    ["hsl(34 36% 32%)", "hsl(28 32% 18%)"],
    ["hsl(280 16% 30%)", "hsl(286 20% 17%)"],
    ["hsl(190 22% 28%)", "hsl(196 26% 16%)"],
];

/** Initiales (2 lettres max) à partir d'un nom. */
function initialsOf(name: string): string {
    return name
        .split(/[ .]/)
        .filter(Boolean)
        .map((part) => part[0])
        .slice(0, 2)
        .join("")
        .toUpperCase();
}

/** Teinte déterministe dérivée d'une chaîne (nom ou id). */
function tintFor(seed: string): [string, string] {
    let acc = 0;
    for (const char of seed) acc = (acc + char.charCodeAt(0)) % 997;
    return AVATAR_TINTS[acc % AVATAR_TINTS.length];
}

type AvatarProps = {
    name: string;
    avatar?: string | null;
    size?: number;
    ring?: boolean;
};

/**
 * Avatar utilisateur : affiche l'image si disponible, sinon les initiales sur
 * un dégradé teinté déterministe.
 */
export function Avatar({ name, avatar, size = 38, ring = true }: AvatarProps) {
    const ringClass = ring ? "border-2 border-primary/35" : "";

    if (avatar) {
        return (
            <img
                src={avatar}
                alt=""
                className={cn("shrink-0 rounded-full object-cover", ringClass)}
                style={{ width: size, height: size }}
            />
        );
    }

    const [from, to] = tintFor(name);

    return (
        <span
            className={cn(
                "grid shrink-0 place-items-center rounded-full font-title font-bold text-foreground/95",
                ringClass,
            )}
            style={{
                width: size,
                height: size,
                backgroundImage: `linear-gradient(150deg, ${from}, ${to})`,
                fontSize: Math.round(size * 0.36),
            }}
        >
            {initialsOf(name)}
        </span>
    );
}
