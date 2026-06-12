import { ReactNode } from "react";

type SectionLeadProps = {
    /** Surtitre italique serif (ex. « La veillée des lecteurs »). */
    kicker: string;
    /** Titre de section. */
    title: string;
    /** Contenu optionnel aligné à droite (ex. sélecteur de tri). */
    right?: ReactNode;
};

/**
 * En-tête de section éditorial de la page de détail : filet doré + surtitre
 * italique + titre. Voix commune à toutes les sections (résumé, critiques,
 * découverte).
 */
export default function SectionLead({ kicker, title, right }: SectionLeadProps) {
    return (
        <div className="mb-5 flex items-end justify-between gap-4">
            <div>
                <div className="mb-2 flex items-center gap-2.5">
                    <span className="bg-primary/50 h-px w-8" />
                    <span className="font-quote text-sm italic tracking-wide whitespace-nowrap text-[hsl(43_30%_62%)]">
                        {kicker}
                    </span>
                </div>
                <h2 className="text-foreground font-title text-2xl font-bold leading-none">
                    {title}
                </h2>
            </div>
            {right}
        </div>
    );
}
