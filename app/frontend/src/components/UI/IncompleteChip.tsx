import { FaCircleInfo } from "react-icons/fa6";
import { cn } from "@/lib/utils";

type IncompleteChipProps = {
    className?: string;
};

/**
 * Chip sobre « Incomplet » (ambre), commun aux cartes livre et auteur.
 * Remplace l'ancien ruban diagonal. Placé en superposition dans un coin.
 */
export default function IncompleteChip({ className }: IncompleteChipProps) {
    return (
        <span
            className={cn(
                "font-body inline-flex items-center gap-1 rounded-full px-2 p-0.75 text-xxs font-bold tracking-wide backdrop-blur-sm",
                className,
            )}
            style={{
                background: "hsl(20 3% 10% / 0.78)",
                color: "hsl(25 80% 66%)",
                border: "1px solid hsl(25 78% 51% / 0.45)",
            }}
            title="Fiche incomplète - informations manquantes"
        >
            <FaCircleInfo size={11} aria-hidden="true" /> Incomplet
        </span>
    );
}
