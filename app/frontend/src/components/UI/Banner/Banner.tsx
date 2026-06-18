import { useState } from "react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import Icon from "@/components/UI/Icon/Icon";
import {
    GOLD,
    baseClasses,
    variantConfig,
} from "@/components/UI/Banner/Banner.styles";
import type {
    BannerAction,
    BannerVariantConfig,
    BannerProps,
} from "@/components/UI/Banner/Banner.types";

/**
 * Bouton d'action de la bannière : plein qui s'inverse au survol, teinté avec
 * la couleur sémantique de la variante. Rendu en `Link` si `action.to`, sinon
 * en `button`.
 */
function BannerActionButton({
    action,
    config,
}: {
    action: BannerAction;
    config: BannerVariantConfig;
}) {
    const { accent, onAccent, gold } = config;

    const base: React.CSSProperties = {
        background: accent,
        color: onAccent,
        border: "2px solid transparent",
        boxShadow: gold ? "0 10px 24px -12px hsl(43 59% 60% / 0.8)" : "none",
    };
    const hover: React.CSSProperties = {
        background: "transparent",
        color: accent,
        border: `2px solid ${accent}`,
        boxShadow: "none",
    };
    const apply = (el: HTMLElement, style: React.CSSProperties) =>
        Object.assign(el.style, style);

    const className =
        "inline-flex shrink-0 items-center justify-center gap-2 whitespace-nowrap rounded-lg px-4 py-2.5 font-body text-[13.5px] font-bold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background";

    const content = (
        <>
            {gold && <Icon name="pencil" size={14} />}
            {action.label}
            {action.xp != null && (
                <span
                    className="rounded-full px-2 py-[1px] font-mono text-[10.5px] font-medium"
                    style={{
                        background: gold
                            ? "hsl(43 59% 21% / 0.18)"
                            : "hsl(20 3% 8% / 0.22)",
                    }}
                >
                    +{action.xp} XP
                </span>
            )}
        </>
    );

    const sharedProps = {
        className,
        style: base,
        "aria-label": action.ariaLabel,
        onMouseEnter: (e: React.MouseEvent<HTMLElement>) =>
            apply(e.currentTarget, hover),
        onMouseLeave: (e: React.MouseEvent<HTMLElement>) =>
            apply(e.currentTarget, base),
    };

    if (action.to) {
        return (
            <Link to={action.to} onClick={action.onClick} {...sharedProps}>
                {content}
            </Link>
        );
    }

    if (action.href) {
        return (
            <a
                href={action.href}
                target="_blank"
                rel="noreferrer"
                onClick={action.onClick}
                {...sharedProps}
            >
                {content}
            </a>
        );
    }

    return (
        <button type="button" onClick={action.onClick} {...sharedProps}>
            {content}
        </button>
    );
}

/**
 * Banner — bandeau contextuel générique et réutilisable (annonces, alertes,
 * jalons de gamification). Chaque variante reste sur surface sombre ; la couleur
 * sémantique habille la bordure, l'icône et l'accent.
 */
const Banner = ({
    variant = "info",
    title,
    children,
    action,
    icon,
    dismissible = false,
    onDismiss,
    className,
}: BannerProps) => {
    const [dismissed, setDismissed] = useState(false);

    if (dismissed) return null;

    const v = variantConfig[variant];
    const glyph = icon ?? v.icon;

    const handleDismiss = () => {
        setDismissed(true);
        onDismiss?.();
    };

    return (
        <div
            role={v.role}
            aria-live={v.role === "alert" ? "assertive" : "polite"}
            className={cn(baseClasses, v.gold && "xp-sweep", className)}
            style={{
                borderColor: v.border,
                background: `linear-gradient(0deg, ${v.tint}, ${v.tint}), hsl(20 3% 17%)`,
                boxShadow: v.gold
                    ? "0 18px 40px -24px hsl(43 59% 50% / 0.4), inset 0 1px 0 hsl(43 59% 81% / 0.08)"
                    : "0 14px 34px -26px hsl(20 3% 2% / 0.9)",
            }}
        >
            <span
                aria-hidden="true"
                className="pointer-events-none absolute inset-y-0 left-0 w-[3px]"
                style={{
                    background: `linear-gradient(180deg, transparent, ${v.accent}, transparent)`,
                    opacity: v.gold ? 0.9 : 0.55,
                }}
            />

            {v.gold && (
                <span
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-0 z-0"
                >
                    <span
                        className="twinkle absolute"
                        style={{
                            top: "18%",
                            right: "16%",
                            width: 4,
                            height: 4,
                            borderRadius: 99,
                            background: GOLD,
                        }}
                    />
                    <span
                        className="twinkle absolute"
                        style={{
                            top: "62%",
                            right: "9%",
                            width: 3,
                            height: 3,
                            borderRadius: 99,
                            background: GOLD,
                            animationDelay: ".8s",
                        }}
                    />
                    <span
                        className="twinkle absolute"
                        style={{
                            top: "38%",
                            right: "26%",
                            width: 2.5,
                            height: 2.5,
                            borderRadius: 99,
                            background: GOLD,
                            animationDelay: "1.4s",
                        }}
                    />
                </span>
            )}

            <div className="relative z-10 flex min-w-0 flex-1 items-start gap-3.5 pr-7 sm:pr-0">
                <span
                    className="mt-0.5 grid h-9 w-9 shrink-0 place-items-center rounded-full"
                    style={{
                        background: v.iconBg,
                        color: v.accent,
                        border: `1px solid ${v.border}`,
                    }}
                >
                    <Icon
                        name={glyph}
                        size={17}
                        className={v.gold ? "candle" : ""}
                    />
                </span>
                <div className="min-w-0">
                    {v.gold && (
                        <span
                            className="mb-1 inline-flex items-center gap-1.5 font-mono text-[9.5px] uppercase tracking-[0.18em]"
                            style={{ color: "hsl(43 30% 64%)" }}
                        >
                            <Icon name="sparkles" size={10} /> Récompense
                        </span>
                    )}
                    <p
                        className="text-foreground font-body text-[14px] font-bold leading-snug"
                        style={{ textWrap: "pretty" }}
                    >
                        {title}
                    </p>
                    {children && (
                        <div
                            className="font-body mt-1 text-[12.5px] leading-relaxed"
                            style={{ color: "hsl(20 12% 73%)" }}
                        >
                            {children}
                        </div>
                    )}
                </div>
            </div>

            {action && (
                <div className="relative z-10 sm:self-center">
                    <BannerActionButton action={action} config={v} />
                </div>
            )}

            {dismissible && (
                <button
                    type="button"
                    onClick={handleDismiss}
                    aria-label="Fermer la bannière"
                    className="text-muted-foreground hover:text-foreground focus-visible:ring-primary absolute right-3 top-3 z-20 grid h-7 w-7 place-items-center rounded-md transition-colors focus-visible:outline-none focus-visible:ring-2"
                    style={{ background: "hsl(20 3% 10% / 0.35)" }}
                >
                    <Icon name="x" size={15} />
                </button>
            )}
        </div>
    );
};

Banner.displayName = "Banner";

export default Banner;
