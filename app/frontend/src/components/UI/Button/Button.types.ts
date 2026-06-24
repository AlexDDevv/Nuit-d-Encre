import type { ButtonHTMLAttributes } from "react";

export type ButtonVariant =
    | "primary"
    | "secondary"
    | "destructive"
    | "destructiveGhost"
    | "outline"
    | "text"
    | "checkable"
    | "icon"
    | "iconUnderlined"
    | "card"
    | "bookCard"
    | "authorCard"
    | "underlineText"
    | "nav"
    | "layout"
    | "ghost"
    | "google"
    | "social"
    | "hamburger"
    | "searchResultCard";

export type ButtonSize =
    | "xxs"
    | "xs"
    | "sm"
    | "md"
    | "lg"
    | "xl"
    | "icon"
    | "card"
    | "bookCard"
    | "authorCard"
    | "searchResultCard";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    /**
     * Variante du bouton
     * @default 'primary'
     */
    variant?: ButtonVariant;

    /**
     * Taille du bouton
     * @default 'md'
     */
    size?: ButtonSize;

    /**
     * Afficher le bouton en pleine largeur
     * @default false
     */
    fullWidth?: boolean;

    /**
     * Désactiver le bouton
     * @default false
     */
    disabled?: boolean;

    /**
     * Afficher un état de chargement
     * @default false
     */
    loading?: boolean;

    /**
     * Indique si le bouton est coché
     * @default false
     */
    isChecked?: boolean;

    /**
     * Indique si le bouton de navigation est sélectionné (route active)
     * @default false
     */
    isNavBtnSelected?: boolean;

    /**
     * Label d'accessibilité du bouton
     */
    ariaLabel?: string;

    /**
     * Route vers laquelle naviguer - rend le bouton comme un lien react-router
     */
    to?: string;

    /**
     * Catégorie du lien pour le tracking analytics (data-category)
     */
    category?: string;

    /**
     * Fonction de clic sur l'icône de droite (état coché)
     */
    handleCheck?: React.MouseEventHandler<HTMLButtonElement>;

    /**
     * Icône à afficher avant le texte
     */
    leftIcon?: React.ReactNode;

    /**
     * Icône à afficher après le texte
     */
    rightIcon?: React.ReactNode;

    /**
     * Icône centrée (boutons icon)
     */
    icon?: React.ReactNode;

    /**
     * Icône de droite affichée quand isChecked est true
     */
    checkedRightIcon?: React.ReactNode;
}
