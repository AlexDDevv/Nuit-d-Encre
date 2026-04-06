export type BannerVariant = 'success' | 'error' | 'warning' | 'info' | 'completion';

export interface BannerAction {
    label: string;
    to?: string;
    onClick?: () => void;
    ariaLabel: string;
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
     * Icône affichée à gauche du titre (optionnel, toujours manuel)
     */
    icon?: React.ReactNode;

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
