import MoonMedallion from "@/components/sections/shared/MoonMedallion";
import { AuthCardHeaderProps } from "@/types/types";

/** En-tête de la carte d'accès : médaillon, titre, accroche serif et eyebrow orné. */
export default function AuthCardHeader({
    welcome,
    eyebrow,
}: AuthCardHeaderProps) {
    return (
        <div className="flex flex-col items-center text-center">
            <MoonMedallion size={64} ring />
            <h1 className="font-title text-foreground mt-4 text-3xl font-black leading-none tracking-tight sm:text-4xl">
                Nuit d'Encre
            </h1>
            <p className="font-quote text-muted-foreground mt-2.5 max-w-[34ch] text-pretty text-base italic leading-snug">
                {welcome}
            </p>
            <div className="mt-5 inline-flex items-center gap-2.5">
                <span className="to-primary/45 bg-linear-to-r h-px w-7 from-transparent" />
                <span className="text-primary/80 font-mono text-xs font-semibold uppercase tracking-[0.28em]">
                    {eyebrow}
                </span>
                <span className="to-primary/45 bg-linear-to-l h-px w-7 from-transparent" />
            </div>
        </div>
    );
}
