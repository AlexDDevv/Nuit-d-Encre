/**
 * @fileoverview Cartouche « accès scellé » partagé - coquille centrée façon
 * sceau de bibliothèque, réutilisée par les écrans « Authentification requise »
 * et « Accès refusé ». Expose aussi l'emblème et le bouton d'action.
 * @module SealedAccessCard
 */

import { Link } from "react-router-dom";
import Icon from "@/components/UI/Icon/Icon";

const GOLD = "hsl(43 59% 81%)";
const GOLD_FG = "hsl(43 59% 21%)";

/**
 * Emblème « accès scellé » - médaillon lunaire à la chandelle : bord double
 * doré, croissant gravé, trou de serrure embossé, flamme qui vacille au sommet.
 */
export function SealEmblem() {
    return (
        <div
            className="relative mx-auto"
            style={{ width: 104, height: 104 }}
            aria-hidden="true"
        >
            <span className="seal-glow absolute inset-0 rounded-full" />

            <span className="-top-2.25 absolute left-1/2 z-20 -translate-x-1/2">
                <span
                    className="candle block"
                    style={{
                        width: 7,
                        height: 11,
                        borderRadius: "50% 50% 46% 46%",
                        background:
                            "radial-gradient(50% 60% at 50% 35%, hsl(43 90% 88%), hsl(25 85% 58%) 70%, hsl(3 70% 42%))",
                        boxShadow: "0 0 12px 3px hsl(38 90% 70% / 0.55)",
                    }}
                />
            </span>

            <span
                className="absolute inset-0 rounded-full"
                style={{
                    border: "2px solid hsl(43 59% 81% / 0.85)",
                    boxShadow:
                        "inset 0 0 0 4px hsl(20 3% 12%), inset 0 0 0 5px hsl(43 59% 81% / 0.4), 0 16px 34px -16px hsl(20 3% 2% / 0.9)",
                    background:
                        "radial-gradient(58% 58% at 50% 38%, hsl(43 30% 25% / 0.45), hsl(20 3% 13%) 78%)",
                }}
            />

            <span
                className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
                style={{ opacity: 0.5 }}
            >
                <Icon
                    name="moon"
                    size={46}
                    strokeWidth={1.25}
                    style={{ color: "hsl(43 59% 81% / 0.5)" }}
                />
            </span>

            <span className="absolute left-1/2 top-1/2 z-10 flex -translate-x-1/2 -translate-y-1/2 flex-col items-center">
                <span
                    className="block rounded-full"
                    style={{
                        width: 14,
                        height: 14,
                        background: "hsl(20 3% 8%)",
                        boxShadow:
                            "inset 0 1px 2px hsl(20 3% 2%), 0 1px 0 hsl(43 59% 81% / 0.45)",
                    }}
                />
                <span
                    className="block"
                    style={{
                        width: 8,
                        height: 14,
                        marginTop: -2,
                        clipPath: "polygon(50% 0, 100% 100%, 0 100%)",
                        background: "hsl(20 3% 8%)",
                        boxShadow: "0 1px 0 hsl(43 59% 81% / 0.4)",
                    }}
                />
            </span>

            <span className="absolute -bottom-2 left-1/2 z-0 flex -translate-x-1/2 gap-3">
                <span
                    style={{
                        width: 12,
                        height: 16,
                        background: "hsl(43 30% 25%)",
                        clipPath:
                            "polygon(0 0, 100% 0, 100% 100%, 50% 78%, 0 100%)",
                        transform: "rotate(-8deg)",
                        boxShadow: "inset 0 0 0 1px hsl(43 59% 81% / 0.3)",
                    }}
                />
                <span
                    style={{
                        width: 12,
                        height: 16,
                        background: "hsl(43 30% 25%)",
                        clipPath:
                            "polygon(0 0, 100% 0, 100% 100%, 50% 78%, 0 100%)",
                        transform: "rotate(8deg)",
                        boxShadow: "inset 0 0 0 1px hsl(43 59% 81% / 0.3)",
                    }}
                />
            </span>
        </div>
    );
}

/**
 * Bouton de cartouche - plein doré qui s'inverse (primaire) ou contour doré
 * atténué qui se remplit (secondaire) au survol. Rendu en `Link`.
 */
export function AuthButton({
    children,
    kind,
    to,
    ariaLabel,
}: {
    children: React.ReactNode;
    kind: "primary" | "secondary";
    to: string;
    ariaLabel: string;
}) {
    const isPrimary = kind === "primary";

    const base: React.CSSProperties = isPrimary
        ? {
              background: GOLD,
              color: GOLD_FG,
              border: "2px solid transparent",
              boxShadow: "0 12px 26px -14px hsl(43 59% 60% / 0.85)",
          }
        : {
              background: "transparent",
              color: "hsl(43 30% 85%)",
              border: "2px solid hsl(43 30% 38%)",
              boxShadow: "none",
          };
    const hover: React.CSSProperties = isPrimary
        ? {
              background: "transparent",
              color: GOLD,
              border: `2px solid ${GOLD}`,
              boxShadow: "none",
          }
        : {
              background: "hsl(43 30% 25%)",
              color: "hsl(43 30% 92%)",
              border: "2px solid hsl(43 30% 38%)",
              boxShadow: "none",
          };
    const apply = (el: HTMLElement, style: React.CSSProperties) =>
        Object.assign(el.style, style);

    return (
        <Link
            to={to}
            aria-label={ariaLabel}
            className="focus-visible:ring-primary focus-visible:ring-offset-card font-body inline-flex w-full items-center justify-center gap-2.5 whitespace-nowrap rounded-lg px-5 py-3 text-sm font-bold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
            style={base}
            onMouseEnter={(e) => apply(e.currentTarget, hover)}
            onMouseLeave={(e) => apply(e.currentTarget, base)}
        >
            {children}
        </Link>
    );
}

interface SealedAccessCardProps {
    /** Eyebrow en petites capitales (ex. « Accès scellé ») */
    eyebrow: string;
    /** Titre principal */
    title: string;
    /** Identifiant du titre, lié via `aria-labelledby` */
    titleId?: string;
    /** Texte descriptif sous le filet */
    description: React.ReactNode;
    /** Région d'actions / notes / liens sous la description */
    children: React.ReactNode;
}

/**
 * SealedAccessCard - coquille du cartouche scellé : coins ornementés, emblème,
 * eyebrow, titre, filet doré, description, puis la région d'actions fournie.
 */
export default function SealedAccessCard({
    eyebrow,
    title,
    titleId = "sealed-access-title",
    description,
    children,
}: SealedAccessCardProps) {
    return (
        <div className="flex w-full items-center justify-center px-4">
            <section
                role="dialog"
                aria-modal="false"
                aria-labelledby={titleId}
                className="fade-up relative w-full max-w-md overflow-hidden rounded-2xl border-2 px-7 pb-8 pt-10 text-center sm:px-9"
                style={{
                    borderColor: "hsl(43 59% 81% / 0.28)",
                    background:
                        "radial-gradient(120% 80% at 50% -10%, hsl(43 30% 22% / 0.4), hsl(20 3% 16%) 60%)",
                    boxShadow:
                        "0 40px 80px -30px hsl(20 3% 2% / 0.92), inset 0 1px 0 hsl(43 59% 81% / 0.08)",
                }}
            >
                <span
                    aria-hidden="true"
                    className="font-quote pointer-events-none absolute left-4 top-4 text-sm"
                    style={{ color: "hsl(43 59% 81% / 0.45)" }}
                >
                    ◆
                </span>
                <span
                    aria-hidden="true"
                    className="font-quote pointer-events-none absolute right-4 top-4 text-sm"
                    style={{ color: "hsl(43 59% 81% / 0.45)" }}
                >
                    ◆
                </span>

                <SealEmblem />

                <p
                    className="text-xxs mt-6 font-mono uppercase tracking-[0.26em]"
                    style={{ color: "hsl(43 30% 60%)" }}
                >
                    {eyebrow}
                </p>

                <h1
                    id={titleId}
                    className="text-foreground font-title mt-2 text-2xl font-bold leading-tight"
                >
                    {title}
                </h1>

                <span
                    aria-hidden="true"
                    className="filet mx-auto mt-4 block h-px w-28"
                />

                <p
                    className="font-quote max-w-62.5 mx-auto mt-4 text-base leading-relaxed"
                    style={{ color: "hsl(20 12% 76%)" }}
                >
                    {description}
                </p>

                {children}
            </section>
        </div>
    );
}
