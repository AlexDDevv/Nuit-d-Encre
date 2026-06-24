import type {
    ButtonSize,
    ButtonVariant,
} from "@/components/UI/Button/Button.types";

/**
 * Cartouche des sceaux - système de boutons (thème nocturne).
 *
 * Contrat de composition : `cn(baseClasses, variantClasses, sizeClasses, …, className)`.
 * Avec tailwind-merge, la **taille** pilote la hauteur, le padding horizontal et la
 * fonte, la **variante** pilote les couleurs / bordures / effets (survol · pression ·
 * focus), et le `className` du site d'appel a toujours le dernier mot. On ne met donc
 * jamais de dimension ni de taille de fonte dans `variantClasses`.
 */

/**
 * Classes de base pour tous les boutons (le « sceau »).
 * Bordure transparente de 2px sur tout le monde pour aligner les hauteurs entre
 * variantes pleines et variantes sans contour ; anneau de focus doré (offset sur
 * le fond) ; surface muette à l'état désactivé.
 */
export const baseClasses =
    "font-body font-bold leading-none inline-flex items-center whitespace-nowrap rounded-lg border-2 border-transparent cursor-pointer transition-all duration-200 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/80 focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:bg-muted/60 disabled:text-muted-foreground/45 disabled:border-border/70 disabled:shadow-none";

/**
 * Classes spécifiques aux variantes - uniquement couleurs, bordures et effets.
 */
export const variantClasses: Record<ButtonVariant, string> = {
    // Actions pleines (inversion plein ↔ contour au survol)
    primary:
        "justify-center bg-primary text-primary-foreground border-primary shadow-[0_10px_26px_-14px_hsl(43_59%_55%/0.9)] hover:bg-transparent hover:text-primary hover:-translate-y-px hover:shadow-none active:bg-primary/15 active:text-primary active:scale-[0.97] active:shadow-none",
    secondary:
        "justify-center bg-secondary text-secondary-foreground border-secondary hover:bg-transparent hover:border-[hsl(43_30%_42%)] hover:-translate-y-px active:bg-secondary/35 active:border-[hsl(43_30%_42%)] active:scale-[0.97]",
    destructive:
        "justify-center bg-destructive text-destructive-foreground border-destructive shadow-[0_10px_26px_-14px_hsl(3_84%_45%/0.8)] hover:bg-transparent hover:text-[hsl(3_84%_64%)] hover:border-[hsl(3_84%_54%)] hover:-translate-y-px hover:shadow-none active:bg-destructive/15 active:text-[hsl(3_84%_66%)] active:border-[hsl(3_84%_54%)] active:scale-[0.97] active:shadow-none focus-visible:ring-destructive/80",
    outline:
        "justify-center bg-transparent text-primary border-primary hover:bg-primary hover:text-primary-foreground hover:-translate-y-px active:bg-[hsl(43_59%_70%)] active:text-primary-foreground active:border-[hsl(43_59%_70%)] active:scale-[0.97]",

    // Discrètes (sans contour)
    text: "justify-center bg-transparent text-muted-foreground hover:bg-muted/60 hover:text-primary active:bg-muted active:text-primary active:scale-[0.98]",
    ghost: "justify-center bg-transparent text-muted-foreground hover:bg-muted/50 hover:text-primary active:bg-muted active:scale-[0.98]",
    underlineText:
        "justify-center bg-transparent text-muted-foreground rounded-md underline decoration-2 decoration-transparent underline-offset-4 hover:text-primary hover:decoration-primary active:text-primary active:decoration-primary/70",

    // Cote cochable
    checkable:
        "justify-between bg-transparent text-muted-foreground border-border hover:border-primary/50 hover:text-primary active:scale-[0.98]",

    // Cachets icône (sans contour : teinte dorée + léger enfoncement)
    icon: "justify-center bg-transparent text-muted-foreground hover:text-primary active:scale-[0.95]",
    iconUnderlined:
        "justify-center bg-transparent text-muted-foreground rounded-none hover:text-primary hover:shadow-[inset_0_-2px_0_hsl(43_59%_81%)] active:scale-[0.95]",
    hamburger:
        "justify-center bg-transparent text-primary border-border hover:bg-muted/50 hover:border-primary/50 active:scale-[0.95]",

    // Navigation
    nav: "justify-start bg-transparent text-muted-foreground font-medium hover:bg-muted/50 hover:text-primary active:scale-[0.98]",
    layout: "justify-center bg-transparent text-muted-foreground hover:bg-muted/50 hover:text-primary active:scale-[0.95]",

    // OAuth & partage
    google: "justify-center bg-transparent text-primary border-primary/45 tracking-wide hover:bg-primary/10 hover:border-primary hover:-translate-y-px hover:shadow-[0_12px_30px_-14px_hsl(43_59%_60%/0.7)] active:bg-primary/15 active:scale-[0.98] active:shadow-none",
    social: "justify-center bg-popover text-muted-foreground border-border hover:bg-muted/50 hover:text-primary hover:border-primary/50 hover:-translate-y-px active:scale-[0.95]",

    // Conteneurs cliquables « reliures » (bordure dorée + élévation)
    card: "justify-center bg-card text-card-foreground border-border rounded-xl hover:border-primary/60 hover:-translate-y-0.5 hover:shadow-[0_22px_44px_-26px_hsl(20_3%_2%/0.95)] active:scale-[0.99]",
    bookCard:
        "relative overflow-hidden flex-col items-center justify-center gap-5 bg-card border-border rounded-xl hover:border-primary/60 hover:-translate-y-0.5 hover:shadow-[0_22px_44px_-26px_hsl(20_3%_2%/0.95)] active:scale-[0.99]",
    authorCard:
        "group relative overflow-hidden items-center justify-center gap-4 bg-card border-border rounded-xl hover:border-primary/60 hover:-translate-y-0.5 hover:shadow-[0_22px_44px_-26px_hsl(20_3%_2%/0.95)] active:scale-[0.99]",
    searchResultCard:
        "items-end justify-between bg-card border-border rounded-xl w-full hover:border-primary/60 hover:-translate-y-0.5 hover:shadow-[0_22px_44px_-26px_hsl(20_3%_2%/0.95)] active:scale-[0.99]",
};

/**
 * État sélectionné (`isNavBtnSelected`), spécifique à la variante.
 * `nav` : item de route courant (pastille dorée, libellé gras).
 * `layout` : bascule de disposition active (surface dorée enfoncée).
 */
export const navSelectedClasses: Record<ButtonVariant, string> = {
    nav: "bg-accent text-foreground font-bold hover:bg-accent hover:text-foreground",
    layout: "bg-secondary/35 text-primary border-primary/40",
    primary: "",
    secondary: "",
    destructive: "",
    outline: "",
    text: "",
    ghost: "",
    underlineText: "",
    checkable: "",
    icon: "",
    iconUnderlined: "",
    hamburger: "",
    google: "",
    social: "",
    card: "",
    bookCard: "",
    authorCard: "",
    searchResultCard: "",
};

/**
 * État coché du conteneur `checkable` (cercle vide → ✓ doré, bordure et fond dorés).
 */
export const checkedClasses = "border-primary text-primary bg-secondary/30";

export const IconClasses: Record<ButtonVariant, string> = {
    icon: "w-4 h-4",
    iconUnderlined: "cursor-pointer w-4 h-4 text-foreground",
    primary: "",
    secondary: "",
    outline: "",
    card: "cursor-pointer w-4 h-4 text-card-foreground group-hover:text-foreground text-lg",
    bookCard: "",
    underlineText: "",
    text: "",
    checkable: "",
    destructive: "",
    nav: "",
    layout: "",
    ghost: "",
    google: "",
    social: "",
    hamburger: "",
    searchResultCard: "",
    authorCard: "",
};

/**
 * Classes spécifiques aux tailles - hauteur fixe + padding horizontal + fonte.
 * L'échelle de hauteurs progresse par paliers de 4px ; `md` (h-10) s'aligne sur la
 * hauteur des champs de formulaire. Les tailles conteneur (icon, card, bookCard,
 * searchResultCard, authorCard) restent dimensionnées au padding, sans hauteur fixe.
 */
export const sizeClasses: Record<ButtonSize, string> = {
    xxs: "h-7 px-2 text-xxs",
    xs: "h-8 px-2.5 text-xs",
    sm: "h-9 px-3 text-sm",
    md: "h-10 px-4 text-base",
    lg: "h-11 px-6 text-lg",
    xl: "h-12 px-8 text-xl",
    icon: "size-10 p-0",
    card: "p-4",
    bookCard: "p-5",
    searchResultCard: "p-4",
    authorCard: "px-10 py-4",
};
