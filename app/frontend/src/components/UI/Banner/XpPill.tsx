import Icon from "@/components/UI/Icon/Icon";

interface XpPillProps {
    amount?: number;
}

/**
 * Pastille XP dorée — à insérer dans le contenu riche d'une bannière pour
 * signaler une récompense de gamification.
 */
export default function XpPill({ amount = 50 }: XpPillProps) {
    return (
        <span
            className="mx-0.5 inline-flex items-center gap-1 rounded-full px-2 py-px align-middle font-mono text-xs font-medium"
            style={{
                background: "hsl(43 59% 81% / 0.16)",
                color: "hsl(43 59% 81%)",
                border: "1px solid hsl(43 59% 81% / 0.4)",
            }}
        >
            <Icon name="sparkles" size={10} /> +{amount} XP
        </span>
    );
}
