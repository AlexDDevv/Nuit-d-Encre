import "@/styles/loader-nocturne.css";
import { cn } from "@/lib/utils";
import type { NocturneLoaderProps } from "@/types";
import { LOADER_CONCEPTS } from "./concepts";

const GOLD = "hsl(43 59% 81%)";

/**
 * NocturneLoader — enveloppe applicative des quatre concepts « Le battement
 * nocturne ». Sert de fallback de Suspense (en pleine zone via `fullscreen`) ou
 * d'indicateur inline. `role="status"` + `aria-live="polite"` pour les lecteurs
 * d'écran ; prefers-reduced-motion géré dans loader-nocturne.css.
 */
export default function NocturneLoader({
    concept = "chandelle",
    size,
    label = false,
    showDot = true,
    dense = false,
    fullscreen = false,
    className,
}: NocturneLoaderProps) {
    const def = LOADER_CONCEPTS[concept];
    const Comp = def.Comp;
    const text = typeof label === "string" ? label : def.line;

    const loader = (
        <div
            className={cn(
                "loader-anim flex flex-col items-center justify-center",
                !fullscreen && className,
            )}
            role="status"
            aria-live="polite"
        >
            <span className="sr-only">Chargement en cours…</span>
            <Comp size={size ?? def.bigSize} />

            {label && (
                <div
                    className={cn(
                        "flex flex-col items-center",
                        dense ? "mt-3 gap-2" : "mt-6 gap-3",
                    )}
                >
                    <p
                        className="text-center font-serif italic text-balance"
                        style={{
                            color: "hsl(43 30% 72%)",
                            fontSize: dense ? 14 : 17,
                            letterSpacing: "0.01em",
                        }}
                    >
                        {text}
                    </p>
                    {/* pseudo-progression purement décorative (aucun chiffre) */}
                    {!dense && (
                        <span
                            className="relative block h-px w-28 overflow-hidden rounded-full"
                            style={{ background: "hsl(43 59% 81% / 0.14)" }}
                            aria-hidden="true"
                        >
                            <span
                                className="nb-shimmer absolute inset-y-0 left-0 w-8 rounded-full"
                                style={{
                                    background:
                                        "linear-gradient(90deg, transparent, hsl(43 59% 81% / 0.85), transparent)",
                                }}
                            />
                        </span>
                    )}
                </div>
            )}

            {showDot && !label && (
                <span
                    className="nb-dot mt-4 block h-1.5 w-1.5 rounded-full"
                    aria-hidden="true"
                    style={{ background: GOLD, boxShadow: `0 0 8px ${GOLD}` }}
                />
            )}
        </div>
    );

    if (!fullscreen) return loader;

    return (
        <div
            className={cn(
                "flex min-h-[70vh] items-center justify-center",
                className,
            )}
        >
            {loader}
        </div>
    );
}
