import FicheCatalogue from "./FicheCatalogue";
import { LEGAL_ICONS } from "./icons";
import { GoldLink } from "@/components/sections/shared/ornaments";
import { LegalSection as LegalSectionType } from "./types";

export default function LegalSection({
    section,
    lastUpdate,
    registerRef,
}: {
    section: LegalSectionType;
    lastUpdate: string;
    registerRef: (id: string, el: HTMLElement | null) => void;
}) {
    const Icon = LEGAL_ICONS[section.icon];

    return (
        <article
            id={section.id}
            data-section={section.id}
            ref={(el) => registerRef(section.id, el)}
            className="scroll-mt-24"
        >
            {/* titre h2 : numéro doré marqué + intitulé */}
            <div className="flex items-center gap-4">
                <span className="border-primary/30 bg-primary/[0.06] text-primary grid size-12 shrink-0 place-items-center rounded-xl border-2">
                    <Icon size={22} strokeWidth={1.9} />
                </span>
                <div className="min-w-0">
                    <span className="text-primary/70 font-mono text-xs font-semibold tracking-[0.2em]">
                        {section.num}
                    </span>
                    <h2 className="text-foreground font-title text-2xl font-bold leading-tight md:text-3xl">
                        {section.title}
                    </h2>
                </div>
            </div>

            <div className="text-foreground/75 mt-5 max-w-[68ch] space-y-4 text-base leading-[1.85] [text-wrap:pretty]">
                {section.intro && (
                    <p className="text-foreground/80">{section.intro}</p>
                )}

                {section.fiche && section.ficheLabel && (
                    <FicheCatalogue
                        label={section.ficheLabel}
                        rows={section.fiche}
                    />
                )}

                {section.paras?.map((p, i) => <p key={i}>{p}</p>)}

                {/* Section finale : bloc contact + email doré */}
                {section.contact && (
                    <div className="border-primary/25 bg-primary/[0.05] mt-6 flex flex-col gap-3 rounded-xl border-2 px-5 py-5">
                        <div className="flex items-center gap-2">
                            <span className="text-primary/60 rotate-45 text-xxxs leading-none">
                                ◆
                            </span>
                            <span className="text-primary/75 font-quote text-sm uppercase tracking-[0.2em]">
                                Contact
                            </span>
                        </div>
                        <p className="text-foreground/80 font-body text-base">
                            <GoldLink href={`mailto:${section.contact}`}>
                                {section.contact}
                            </GoldLink>
                        </p>
                        <p className="text-muted-foreground/70 font-mono text-xs uppercase tracking-[0.2em]">
                            Dernière mise à jour :{" "}
                            <span className="text-primary/75">{lastUpdate}</span>
                        </p>
                    </div>
                )}
            </div>
        </article>
    );
}
