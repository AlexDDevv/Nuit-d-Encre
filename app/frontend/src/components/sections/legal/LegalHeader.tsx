import MoonMedallion from "@/components/sections/shared/MoonMedallion";
import Ornament from "@/components/sections/shared/Ornament";
import { MonoEyebrow } from "@/components/sections/shared/ornaments";

export default function LegalHeader({ lastUpdate }: { lastUpdate: string }) {
    return (
        <header className="grain bg-card/60 border-border relative overflow-hidden rounded-2xl border-2 px-6 py-12 text-center md:px-12 md:py-16">
            {/* vignette de chandelle locale */}
            <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 bg-[radial-gradient(620px_280px_at_50%_-8%,hsl(43_45%_55%/0.18),transparent_62%)]"
            />
            <div className="relative flex flex-col items-center">
                <MoonMedallion size={66} ring />
                <MonoEyebrow className="mt-5">Document officiel</MonoEyebrow>

                <div className="mt-5 flex flex-col items-center">
                    <Ornament width="w-12" />
                    <h1 className="text-gradient-gold mt-3 font-title text-4xl font-black leading-[1.04] tracking-tight md:text-6xl">
                        Mentions légales
                    </h1>
                    <Ornament className="mt-3" width="w-12" />
                </div>

                <p className="text-muted-foreground mt-5 max-w-md font-quote text-lg italic leading-relaxed">
                    Informations juridiques relatives au site Nuit d'Encre - sa
                    veillée, sa bibliothèque et ses lecteurs.
                </p>

                <p className="text-muted-foreground/70 mt-6 font-mono text-xs uppercase tracking-[0.22em]">
                    Dernière mise à jour :{" "}
                    <span className="text-primary/75">{lastUpdate}</span>
                </p>
            </div>
        </header>
    );
}
