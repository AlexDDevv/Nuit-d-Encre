import { FaTrashCan } from "react-icons/fa6";
import Button from "@/components/UI/Button";
import { cn } from "@/lib/utils";

type ConfirmRemoveOverlayProps = {
    title: string;
    onConfirm: () => void;
    onCancel: () => void;
    loading?: boolean;
    /** `row` : voile compact sur une ligne de la vue Liste (hauteur réduite). */
    layout?: "card" | "row";
};

/**
 * Voile de confirmation de retrait d'un ouvrage de la bibliothèque, superposé à
 * la carte/ligne. Partagé par les vues Grille et Liste.
 */
export default function ConfirmRemoveOverlay({
    title,
    onConfirm,
    onCancel,
    loading,
    layout = "card",
}: ConfirmRemoveOverlayProps) {
    const isRow = layout === "row";

    return (
        <div
            className={cn(
                "absolute inset-0 z-40 flex items-center justify-center rounded-xl bg-[hsl(20_3%_9%/0.92)] px-4 text-center backdrop-blur-sm",
                isRow
                    ? "flex-col gap-2 sm:flex-row sm:justify-between sm:gap-4 sm:text-left"
                    : "flex-col gap-3",
            )}
        >
            {!isRow && (
                <span className="border-destructive/40 grid h-10 w-10 place-items-center rounded-full border-2 text-[hsl(3_84%_64%)]">
                    <FaTrashCan aria-hidden="true" />
                </span>
            )}
            {isRow ? (
                <p className="text-foreground font-quote min-w-0 max-w-full truncate text-sm italic">
                    Retirer{" "}
                    <span className="text-muted-foreground font-body text-xs not-italic">
                        « {title} »
                    </span>{" "}
                    de vos rayons ?
                </p>
            ) : (
                <p className="text-foreground font-quote text-sm italic leading-snug">
                    Retirer
                    <br />
                    <span className="text-muted-foreground font-body text-xs not-italic">
                        « {title} »
                    </span>
                    <br />
                    de vos rayons ?
                </p>
            )}
            <div
                className={cn(
                    "flex items-center gap-2",
                    isRow ? "shrink-0 flex-row" : "flex-col",
                )}
            >
                <Button
                    variant="destructiveGhost"
                    size="sm"
                    onClick={onConfirm}
                    disabled={loading}
                    leftIcon={<FaTrashCan size={12} aria-hidden="true" />}
                >
                    Retirer
                </Button>
                <Button variant="text" size="sm" onClick={onCancel}>
                    Annuler
                </Button>
            </div>
        </div>
    );
}
