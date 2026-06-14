import { FaTrashCan } from "react-icons/fa6";

type ConfirmRemoveOverlayProps = {
    title: string;
    onConfirm: () => void;
    onCancel: () => void;
    loading?: boolean;
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
}: ConfirmRemoveOverlayProps) {
    return (
        <div className="absolute inset-0 z-40 flex flex-col items-center justify-center gap-3 rounded-xl bg-[hsl(20_3%_9%/0.92)] px-4 text-center backdrop-blur-sm">
            <span className="border-destructive/50 bg-destructive/15 grid h-10 w-10 place-items-center rounded-full border text-[hsl(3_84%_64%)]">
                <FaTrashCan size={16} aria-hidden="true" />
            </span>
            <p className="text-foreground font-quote text-sm italic leading-snug">
                Retirer
                <br />
                <span className="text-muted-foreground font-body text-xs not-italic">
                    « {title} »
                </span>
                <br />
                de vos rayons ?
            </p>
            <div className="flex items-center gap-2">
                <button
                    type="button"
                    onClick={onConfirm}
                    disabled={loading}
                    className="bg-destructive focus-visible:ring-ring inline-flex cursor-pointer items-center gap-1.5 rounded-lg px-3.5 py-2 font-body text-xs font-bold text-white transition-opacity focus-visible:outline-none focus-visible:ring-2 disabled:opacity-60"
                >
                    <FaTrashCan size={12} aria-hidden="true" /> Retirer
                </button>
                <button
                    type="button"
                    onClick={onCancel}
                    className="border-border text-foreground hover:border-primary/60 focus-visible:ring-ring cursor-pointer rounded-lg border px-3.5 py-2 font-body text-xs transition-colors focus-visible:outline-none focus-visible:ring-2"
                >
                    Annuler
                </button>
            </div>
        </div>
    );
}
