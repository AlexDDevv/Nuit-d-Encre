import type { GlyphName } from "@/components/UI/Icon/Icon";

export type BannerVariant =
    | "success"
    | "error"
    | "warning"
    | "info"
    | "completion";

export interface BannerAction {
    label: string;
    to?: string;
    onClick?: () => void;
    ariaLabel: string;
    /**
     * Montant d'XP affiché dans une pastille à droite du libellé (optionnel)
     */
    xp?: number;
}

/**
 * Configuration sémantique d'une variante. Toutes les variantes restent sur
 * surface sombre — la couleur sémantique habille la bordure, l'icône et l'accent.
 */
export interface BannerVariantConfig {
    /** Icône par défaut de la variante */
    icon: GlyphName;
    /** Rôle ARIA — `alert` (assertif) pour les erreurs, `status` (poli) sinon */
    role: "status" | "alert";
    /** Couleur d'accent (icône, liseré, bouton d'action) */
    accent: string;
    /** Couleur de texte sur fond accentué (bouton plein) */
    onAccent: string;
    /** Couleur de bordure */
    border: string;
    /** Teinte de surface superposée au fond sombre */
    tint: string;
    /** Fond de la pastille d'icône */
    iconBg: string;
    /** Variante dorée « complétion · XP » (ornements supplémentaires) */
    gold?: boolean;
}

export interface BannerProps {
    /**
     * Variante de la bannière
     * @default 'info'
     */
    variant?: BannerVariant;

    /**
     * Titre principal de la bannière
     */
    title: string;

    /**
     * Contenu riche affiché sous le titre (optionnel)
     */
    children?: React.ReactNode;

    /**
     * Bouton d'action affiché à droite (optionnel)
     */
    action?: BannerAction;

    /**
     * Icône affichée à gauche du titre — surcharge l'icône par défaut de la variante
     */
    icon?: GlyphName;

    /**
     * Affiche un bouton de fermeture — la bannière gère son propre état dismissed
     * @default false
     */
    dismissible?: boolean;

    /**
     * Callback appelé quand l'utilisateur ferme la bannière (ex: persister en localStorage)
     */
    onDismiss?: () => void;

    /**
     * Classes CSS supplémentaires
     */
    className?: string;
}
