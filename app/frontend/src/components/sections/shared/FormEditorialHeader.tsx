import { IconType } from "react-icons";
import MoonMedallion from "./MoonMedallion";
import Ornament from "./Ornament";

/**
 * En-tête éditorial des fiches de l'atelier : médaillon lunaire, sur-titre mono,
 * titre, sous-titre manuscrit et ornement de clôture.
 */
export default function FormEditorialHeader({
    icon: Icon,
    eyebrow,
    title,
    subtitle,
}: {
    icon: IconType;
    eyebrow: string;
    title: string;
    subtitle: string;
}) {
    return (
        <header className="fade-up mb-6 flex flex-col items-center text-center">
            <MoonMedallion size={58} ring />
            <span className="text-primary/70 mt-4 flex items-center gap-2 font-mono text-xs font-medium uppercase tracking-[0.3em]">
                <Icon size={13} /> {eyebrow}
            </span>
            <h1 className="text-foreground font-title mt-3 text-3xl font-black leading-tight tracking-tight sm:text-4xl">
                {title}
            </h1>
            <p className="text-muted-foreground font-quote mt-3 max-w-[52ch] text-base italic leading-snug text-pretty">
                {subtitle}
            </p>
            <Ornament className="mt-5" width="w-12" />
        </header>
    );
}
