import { useRef } from "react";
import type { IconType } from "react-icons";
import { LuPencil, LuPower, LuTrash2 } from "react-icons/lu";
import Icon from "@/components/UI/Icon/Icon";
import { Label } from "@/components/UI/form/Label";
import { variantConfig } from "@/components/UI/Banner/Banner.styles";
import type { SiteBannerAudience } from "@/types/types";

/** Variantes éditables d'une bannière de site (hors `completion`, réservée à la gamification). */
export type BannerEditorVariant = "info" | "success" | "warning" | "error";

/** Bannière enregistrée, projetée pour la liste d'historique. */
export interface SavedBanner {
    id: string;
    variant: BannerEditorVariant;
    title: string;
    content: string;
    audience: SiteBannerAudience;
    dismissible: boolean;
    action: { label: string; target: string } | null;
    date: string;
}

/** Brouillon en cours d'édition. */
export interface BannerDraft {
    variant: BannerEditorVariant;
    title: string;
    content: string;
    audience: SiteBannerAudience;
    hasAction: boolean;
    actionLabel: string;
    actionTarget: string;
    dismissible: boolean;
}

export const blankDraft = (): BannerDraft => ({
    variant: "info",
    title: "",
    content: "",
    audience: "ALL",
    hasAction: false,
    actionLabel: "",
    actionTarget: "",
    dismissible: true,
});

/** Ordre d'affichage et libellé/anneau propres à chaque variante. Les couleurs
 * (accent, bordure, teinte, fond d'icône, glyphe) sont reprises du composant
 * Banner pour rester strictement cohérentes. */
export const VARIANT_ORDER: BannerEditorVariant[] = [
    "info",
    "success",
    "warning",
    "error",
];

export const VARIANT_META: Record<
    BannerEditorVariant,
    { label: string; ring: string }
> = {
    info: { label: "Info", ring: "hsl(205 30% 60%)" },
    success: { label: "Succès", ring: "hsl(140 38% 52%)" },
    warning: { label: "Avertissement", ring: "hsl(25 80% 56%)" },
    error: { label: "Erreur", ring: "hsl(3 84% 58%)" },
};

export const inputCls =
    "w-full rounded-lg border-2 border-border bg-popover/70 px-3.5 py-2.5 font-body text-[14px] text-foreground " +
    "placeholder:text-muted-foreground/45 transition-colors duration-200 " +
    "focus:border-primary/60 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/30";

/** Champ étiqueté : intitulé en capitales, icône dorée, indication facultative. */
export function Field({
    icon: I,
    label,
    htmlFor,
    hint,
    optional,
    children,
}: {
    icon?: IconType;
    label: string;
    htmlFor?: string;
    hint?: string;
    optional?: boolean;
    children: React.ReactNode;
}) {
    return (
        <div className="flex flex-col gap-2">
            <Label
                htmlFor={htmlFor}
                className="flex items-center gap-2 font-body text-[12px] font-bold uppercase tracking-[0.14em] text-muted-foreground"
            >
                {I && <I size={14} className="text-primary/70" />}
                {label}
                {optional && (
                    <span className="font-body text-[10px] font-medium normal-case tracking-normal text-muted-foreground/55">
                        facultatif
                    </span>
                )}
            </Label>
            {children}
            {hint && (
                <p className="font-body text-[11.5px] leading-snug text-muted-foreground/55">
                    {hint}
                </p>
            )}
        </div>
    );
}

/** Sélecteur d'état : quatre segments teintés (radiogroup, navigation fléchée). */
export function StateSelector({
    value,
    onChange,
}: {
    value: BannerEditorVariant;
    onChange: (next: BannerEditorVariant) => void;
}) {
    const refs = useRef<(HTMLButtonElement | null)[]>([]);

    const onKey = (e: React.KeyboardEvent) => {
        const i = VARIANT_ORDER.indexOf(value);
        let next: number | null = null;
        if (e.key === "ArrowRight" || e.key === "ArrowDown")
            next = (i + 1) % VARIANT_ORDER.length;
        if (e.key === "ArrowLeft" || e.key === "ArrowUp")
            next = (i - 1 + VARIANT_ORDER.length) % VARIANT_ORDER.length;
        if (next != null) {
            e.preventDefault();
            onChange(VARIANT_ORDER[next]);
            refs.current[next]?.focus();
        }
    };

    return (
        <div
            role="radiogroup"
            aria-label="État de la bannière"
            onKeyDown={onKey}
            className="grid grid-cols-2 gap-2.5 sm:grid-cols-4"
        >
            {VARIANT_ORDER.map((key, idx) => {
                const v = variantConfig[key];
                const meta = VARIANT_META[key];
                const on = value === key;
                return (
                    <button
                        key={key}
                        type="button"
                        role="radio"
                        aria-checked={on}
                        ref={(el) => {
                            refs.current[idx] = el;
                        }}
                        tabIndex={on ? 0 : -1}
                        onClick={() => onChange(key)}
                        className="group relative flex items-center gap-2.5 cursor-pointer rounded-lg border-2 px-3 py-2.5 text-left transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2 focus-visible:ring-offset-card"
                        style={{
                            borderColor: on ? meta.ring : "hsl(0 0% 24%)",
                            background: on ? v.tint : "hsl(20 3% 16% / 0.6)",
                            boxShadow: on
                                ? `0 0 0 1px ${meta.ring} inset, 0 10px 26px -18px ${v.accent}`
                                : "none",
                        }}
                    >
                        <span
                            className="grid h-7 w-7 shrink-0 place-items-center rounded-full transition-transform duration-200 group-hover:scale-105"
                            style={{
                                background: v.iconBg,
                                color: v.accent,
                                border: `1px solid ${v.border}`,
                            }}
                        >
                            <Icon name={v.icon} size={14} />
                        </span>
                        <span
                            className="min-w-0 font-body text-[12.5px] font-bold leading-tight"
                            style={{
                                color: on
                                    ? "hsl(43 59% 88%)"
                                    : "hsl(20 12% 73%)",
                            }}
                        >
                            {meta.label}
                        </span>
                        {on && (
                            <span
                                className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full"
                                style={{ background: v.accent }}
                            />
                        )}
                    </button>
                );
            })}
        </div>
    );
}

/** Ligne d'une bannière enregistrée : médaillon, libellé, statut, actions. */
export function SavedBannerRow({
    item,
    isActive,
    onReactivate,
    onLoad,
    onDelete,
}: {
    item: SavedBanner;
    isActive: boolean;
    onReactivate: () => void;
    onLoad: () => void;
    onDelete: () => void;
}) {
    const v = variantConfig[item.variant];
    const meta = VARIANT_META[item.variant];
    return (
        <div className="group flex items-start gap-3 rounded-xl border-2 border-border bg-popover/50 p-3.5 transition-all duration-200 hover:border-primary/40">
            <span
                className="mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-full"
                style={{
                    background: v.iconBg,
                    color: v.accent,
                    border: `1px solid ${v.border}`,
                }}
            >
                <Icon name={v.icon} size={15} />
            </span>
            <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                    <span
                        className="rounded-full border px-2 py-px font-body text-[10px] font-bold uppercase tracking-[0.1em]"
                        style={{
                            borderColor: v.border,
                            color: v.accent,
                            background: v.tint,
                        }}
                    >
                        {meta.label}
                    </span>
                    {isActive && (
                        <span className="inline-flex items-center gap-1 rounded-full border border-primary/45 bg-primary/12 px-2 py-px font-body text-[10px] font-bold uppercase tracking-[0.1em] text-primary">
                            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-primary" />{" "}
                            En ligne
                        </span>
                    )}
                    <span className="ml-auto shrink-0 font-body text-[11px] text-muted-foreground/55">
                        {item.date}
                    </span>
                </div>
                <p className="mt-1.5 truncate font-body text-[13px] font-bold text-foreground">
                    {item.title}
                </p>
                {item.content && (
                    <p className="mt-0.5 line-clamp-2 font-body text-[12px] leading-snug text-muted-foreground">
                        {item.content}
                    </p>
                )}
                <div className="mt-2.5 flex items-center gap-2">
                    <button
                        type="button"
                        onClick={onLoad}
                        className="inline-flex items-center gap-1.5 rounded-md border-2 border-border bg-transparent px-2.5 py-1 font-body text-[11.5px] font-bold text-muted-foreground transition-colors hover:border-primary/55 hover:text-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
                    >
                        <LuPencil size={12} /> Charger
                    </button>
                    <button
                        type="button"
                        onClick={onDelete}
                        className="inline-flex items-center gap-1.5 rounded-md border-2 border-destructive/45 bg-transparent px-2.5 py-1 font-body text-[11.5px] font-bold text-destructive transition-colors hover:bg-destructive hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-destructive/40"
                    >
                        <LuTrash2 size={12} /> Supprimer
                    </button>
                    {!isActive && (
                        <button
                            type="button"
                            onClick={onReactivate}
                            className="inline-flex items-center gap-1.5 rounded-md border-2 border-primary/55 bg-primary/10 px-2.5 py-1 font-body text-[11.5px] font-bold text-primary transition-colors hover:bg-primary hover:text-primary-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
                        >
                            <LuPower size={12} /> Réactiver
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}
