import MoonMedallion from "@/components/sections/shared/MoonMedallion";
import Ornament from "@/components/sections/shared/Ornament";
import { MonoEyebrow } from "@/components/sections/shared/ornaments";

/** Contact page editorial header — moon seal + ornamented title. */
export default function ContactHero() {
    return (
        <header className="grain bg-card/60 border-border relative overflow-hidden rounded-2xl border-2 px-6 py-12 text-center md:px-12 md:py-16">
            <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 bg-[radial-gradient(620px_280px_at_50%_-8%,hsl(43_45%_55%/0.18),transparent_62%)]"
            />
            <div className="relative flex flex-col items-center">
                <MoonMedallion size={66} ring />
                <MonoEyebrow className="mt-5">Nous écrire</MonoEyebrow>

                <div className="mt-5 flex flex-col items-center">
                    <Ornament width="w-12" />
                    <h1 className="text-gradient-gold mt-3 font-title text-4xl font-black leading-[1.04] tracking-tight md:text-6xl">
                        Prendre contact
                    </h1>
                    <Ornament className="mt-3" width="w-12" />
                </div>

                <p className="text-muted-foreground mt-5 max-w-lg font-quote text-lg italic leading-relaxed">
                    Une question, une suggestion, un grain de sable dans les
                    rouages ? Écrivez-nous — la bibliothèque ne dort jamais,
                    quelqu'un tient la lampe.
                </p>
            </div>
        </header>
    );
}
