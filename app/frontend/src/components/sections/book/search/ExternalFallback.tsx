type ExternalFallbackProps = {
    source: string;
};

/**
 * Couverture de substitution pour un résultat EXTERNE sans couverture :
 * placeholder strié + libellés monospace (« couverture absente / via source »).
 * Volontairement distinct du FallbackCover de marque, réservé à nos ouvrages.
 * Le titre est porté par l'overlay de la carte, pas par ce placeholder.
 */
export default function ExternalFallback({ source }: ExternalFallbackProps) {
    return (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-[repeating-linear-gradient(135deg,hsl(20_3%_12%)_0_9px,hsl(20_3%_15%)_9px_18px)] px-4 text-center">
            <div className="border-foreground/20 pointer-events-none absolute inset-2.5 rounded-md border border-dashed" />
            <span className="text-foreground/40 font-mono text-[8.5px] uppercase tracking-[0.22em]">
                couverture absente
            </span>
            <span className="font-mono text-[9px] tracking-wide text-[hsl(20_12%_52%)]">
                via {source}
            </span>
        </div>
    );
}
