import { GoldLink } from "@/components/sections/shared/ornaments";
import { FicheRow } from "./types";

// Fiche d'identité - « notice de catalogue » monospace.
// Libellé doré atténué à gauche, valeur parchemin à droite, en grille.
export default function FicheCatalogue({
    label,
    rows,
}: {
    label: string;
    rows: FicheRow[];
}) {
    return (
        <div className="grain bg-popover/70 border-primary/30 relative my-6 overflow-hidden rounded-xl border-2 shadow-[inset_0_1px_0_hsl(43_59%_81%/0.05)]">
            {/* entête de fiche : libellé de catalogue */}
            <div className="border-primary/20 bg-primary/6 flex items-center justify-between gap-3 border-b px-5 py-2.5">
                <span className="text-primary/80 font-mono text-xxs font-semibold uppercase tracking-[0.28em]">
                    {label}
                </span>
                <span className="text-primary/50 rotate-45 text-xxxs leading-none">
                    ◆
                </span>
            </div>

            <dl className="grid gap-x-8 px-5 py-1.5 sm:grid-cols-2">
                {rows.map((r) => (
                    <div
                        key={r.k}
                        className="border-border/40 flex flex-col gap-0.5 border-b py-3 last:border-b-0 sm:flex-row sm:items-baseline sm:gap-4"
                    >
                        <dt className="text-primary/55 shrink-0 font-mono text-xxs font-medium uppercase tracking-[0.14em] sm:w-[42%]">
                            {r.k}
                        </dt>
                        <dd className="text-foreground/90 font-mono text-xs leading-relaxed">
                            {r.email ? (
                                <GoldLink href={`mailto:${r.v}`}>{r.v}</GoldLink>
                            ) : r.link ? (
                                <GoldLink href={r.link} external>
                                    {r.v}
                                </GoldLink>
                            ) : (
                                r.v
                            )}
                        </dd>
                    </div>
                ))}
            </dl>
        </div>
    );
}
