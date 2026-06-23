import { FaMoon } from "react-icons/fa6";

/**
 * Médaillon lunaire doré - sceau de marque « Nuit d'Encre ».
 * `ring` ajoute un liseré intérieur (traitement d'en-tête de document).
 */
export default function MoonMedallion({
    size = 36,
    ring = false,
}: {
    size?: number;
    ring?: boolean;
}) {
    return (
        <span
            className="border-primary/55 text-primary relative grid shrink-0 place-items-center rounded-full border-2 bg-linear-to-b from-[hsl(43_59%_81%/0.25)] to-transparent shadow-[0_0_18px_-3px_hsl(43_59%_70%/0.55)]"
            style={{ width: size, height: size }}
        >
            {ring && (
                <span className="border-primary/25 absolute inset-1.5 rounded-full border" />
            )}
            <FaMoon size={size * 0.45} />
        </span>
    );
}
