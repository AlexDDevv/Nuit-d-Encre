type SearchSectionHeadingProps = {
    /** Surtitre italique (ex. « Déjà dans vos rayons »). */
    kicker: string;
    /** Titre de section (ex. « Dans Nuit d'Encre »). */
    title: string;
    /** Compteur affiché à droite (ex. « 3 ouvrages »). */
    count?: string | null;
    /** Note explicative sous le titre. */
    note?: string;
};

/**
 * En-tête de section de la page de recherche : surtitre à filet doré, titre,
 * compteur et note — reprend le langage des en-têtes de l'accueil.
 */
export default function SearchSectionHeading({
    kicker,
    title,
    count,
    note,
}: SearchSectionHeadingProps) {
    return (
        <div className="mb-5">
            <div className="flex items-end justify-between gap-4">
                <div>
                    <div className="mb-2 flex items-center gap-2.5">
                        <span className="bg-primary/50 h-px w-8" />
                        <span className="font-quote text-[13px] italic tracking-wide whitespace-nowrap text-[hsl(43_30%_62%)]">
                            {kicker}
                        </span>
                    </div>
                    <h2 className="text-foreground font-title text-[28px] font-bold leading-none">
                        {title}
                    </h2>
                </div>
                {count && (
                    <span className="text-muted-foreground hidden font-body text-[13px] whitespace-nowrap sm:inline">
                        {count}
                    </span>
                )}
            </div>
            {note && (
                <p className="text-muted-foreground mt-3 max-w-2xl font-body text-[12.5px] leading-relaxed">
                    {note}
                </p>
            )}
        </div>
    );
}
