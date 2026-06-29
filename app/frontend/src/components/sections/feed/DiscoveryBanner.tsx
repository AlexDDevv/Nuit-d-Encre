import { LuCompass } from "react-icons/lu";

/** Encart d'invitation affiché en mode découverte (aucun abonnement). */
export default function DiscoveryBanner() {
    return (
        <div className="border-secondary/60 bg-secondary/15 relative mb-7 overflow-hidden rounded-xl border-2 p-5 md:p-6">
            <div className="flex items-start gap-4">
                <span className="border-secondary/70 bg-secondary/30 text-primary/80 grid h-11 w-11 shrink-0 place-items-center rounded-full border-2">
                    <LuCompass size={20} />
                </span>
                <div className="min-w-0">
                    <h2 className="text-foreground font-title text-sm font-bold uppercase tracking-[0.14em]">
                        Activité de la communauté
                    </h2>
                    <p className="text-secondary-foreground/90 font-quote mt-1.5 max-w-prose text-base italic leading-relaxed">
                        Vous ne suivez encore personne - voici ce que lisent les
                        veilleurs de Nuit d'Encre. Suivez des lecteurs pour
                        personnaliser votre fil&nbsp;: cliquez sur un nom pour
                        découvrir son profil et l'ajouter à vos lectures
                        suivies.
                    </p>
                </div>
            </div>
        </div>
    );
}
