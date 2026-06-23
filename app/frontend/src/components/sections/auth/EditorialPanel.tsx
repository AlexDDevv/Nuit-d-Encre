import Ornament from "@/components/sections/shared/Ornament";
import MoonMedallion from "@/components/sections/shared/MoonMedallion";
import { AuthMode, EditorialPanelProps } from "@/types/types";

const COPY: Record<
    AuthMode,
    { quote: [string, string]; quoteBy: string; panel: string }
> = {
    connexion: {
        quote: ["« On n'entre pas dans un livre,", "on y est attendu. »"],
        quoteBy: "- Veillée de la bibliothèque",
        panel: "Des milliers de lectrices et lecteurs veillent déjà. Présentez votre carte d'accès - la lampe est allumée.",
    },
    inscription: {
        quote: [
            "« Tout lecteur, quand il lit,",
            "est le propre lecteur de soi-même. »",
        ],
        quoteBy: "- Au seuil de la bibliothèque",
        panel: "Choisissez votre nom de plume et scellez votre carte d'accès. La veillée n'attend plus que vous.",
    },
};

/** Panneau latéral éditorial des écrans d'authentification (desktop). */
export default function EditorialPanel({ mode }: EditorialPanelProps) {
    const c = COPY[mode];

    return (
        <aside className="lg:border-border relative hidden overflow-hidden lg:flex lg:flex-col lg:justify-between lg:rounded-l-3xl lg:border-2 lg:border-r-0">
            <div aria-hidden="true" className="bg-card/70 absolute inset-0" />
            <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0"
                style={{
                    background:
                        "radial-gradient(520px 360px at 22% 0%, hsl(43 45% 50% / 0.22), transparent 62%), linear-gradient(180deg, transparent, hsl(20 3% 12% / 0.55))",
                }}
            />
            <div
                aria-hidden="true"
                className="border-primary/15 pointer-events-none absolute inset-5 rounded-xl border"
            />

            <div className="relative z-10 flex items-center gap-2.5 px-9 pt-9">
                <MoonMedallion size={36} />
                <span className="font-quote text-foreground text-lg font-medium tracking-wide">
                    Nuit d'Encre
                </span>
            </div>

            <div className="relative z-10 px-9 pb-2">
                <Ornament width="w-10" />
                <blockquote className="font-quote text-foreground/90 mt-5 text-pretty text-3xl italic leading-[1.4]">
                    {c.quote[0]}
                    <br />
                    {c.quote[1]}
                </blockquote>
                <p className="font-body text-primary/55 mt-4 text-xs uppercase tracking-[0.22em]">
                    {c.quoteBy}
                </p>
            </div>

            <div className="relative z-10 flex items-center gap-3 px-9 pb-9">
                <p className="font-quote text-muted-foreground/75 text-sm italic leading-relaxed">
                    {c.panel}
                </p>
            </div>
        </aside>
    );
}
