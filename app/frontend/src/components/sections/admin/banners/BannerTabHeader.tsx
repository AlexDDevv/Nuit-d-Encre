import { LuMegaphone } from "react-icons/lu";

/** En-tête de l'onglet « Bannières » + pastille d'état actif/inactif. */
export default function BannerTabHeader({ active }: { active: boolean }) {
    return (
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div className="flex items-center gap-3">
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl border-2 border-primary/40 bg-gradient-to-b from-primary/15 to-transparent text-primary">
                    <LuMegaphone size={20} />
                </span>
                <div>
                    <h2 className="font-quote text-2xl font-medium leading-tight text-foreground">
                        Composer une bannière
                    </h2>
                    <p className="mt-0.5 max-w-xl font-body text-sm leading-snug text-muted-foreground">
                        Choisissez l'état, rédigez le message et définissez le
                        lien du bouton. L'aperçu se met à jour en direct.
                    </p>
                </div>
            </div>
            <div className="flex items-center gap-2 sm:pb-1">
                {active ? (
                    <span className="inline-flex items-center gap-2 rounded-full border-2 border-primary/45 bg-primary/10 px-3 py-1.5 font-body text-xs font-bold uppercase tracking-[0.12em] text-primary">
                        <span className="h-2 w-2 animate-pulse rounded-full bg-primary" />{" "}
                        Une bannière est active
                    </span>
                ) : (
                    <span className="inline-flex items-center gap-2 rounded-full border-2 border-border bg-muted/50 px-3 py-1.5 font-body text-xs font-bold uppercase tracking-[0.12em] text-muted-foreground">
                        <span className="h-2 w-2 rounded-full bg-muted-foreground/50" />{" "}
                        Aucune bannière active
                    </span>
                )}
            </div>
        </div>
    );
}
