import type {
    ButtonSize,
    ButtonVariant,
} from "@/components/UI/Button/Button.types";

/**
 * Classes de base pour tous les boutons
 */
export const baseClasses =
    "font-body font-semibold inline-flex items-center transition-colors focus-visible:outline-none focus-visible:ring-2 cursor-pointer disabled:pointer-events-none disabled:bg-muted disabled:text-muted-foreground";

/**
 * Classes spécifiques aux variantes
 */
export const variantClasses: Record<ButtonVariant, string> = {
    primary:
        "justify-center rounded-lg bg-primary text-primary-foreground hover:bg-transparent hover:text-primary border-2 border-primary focus-visible:ring-primary active:bg-primary-foreground active:text-primary font-[Switzer-SemiBold]",
    secondary:
        "justify-center rounded-lg bg-secondary text-secondary-foreground border-2 border-secondary hover:bg-transparent hover:text-secondary focus-visible:ring-primary active:bg-primary active:text-primary-foreground font-[Switzer-SemiBold]",
    outline:
        "justify-center rounded-lg border-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground focus-visible:ring-primary active:bg-primary-foreground active:text-primary font-[Switzer-medium]",
    card: "justify-center border border-border hover:border-foreground rounded-lg bg-card text-card-foreground hover:text-foreground focus-visible:ring-primary active:bg-accent active:text-accent-foreground font-[Switzer-regular] text-xs group",
    underlineText:
        "justify-center text-foreground underline-offset-4 hover:underline active:no-underline focus-visible:ring-transparent focus-visible:ring-offset-transparent focus-visible:ring-offset-0 focus-visible:underline cursor-pointer font-[Switzer-SemiBold]",
    text: "text-foreground underline-offset-4 hover:bg-muted active:no-underline focus-visible:ring-transparent focus-visible:ring-offset-transparent focus-visible:ring-offset-0 focus-visible:underline cursor-pointer font-[Switzer-regular] bg-transparent rounded-lg px-0 disabled:bg-transparent disabled:text-muted-foreground/50",
    checkable:
        "justify-start focus-visible:ring-transparent focus-visible:ring-offset-transparent focus-visible:ring-offset-0 text-muted-foreground justify-between font-[Switzer-light] bg-transparent hover:bg-muted text-sm rounded-lg disabled:text-muted-foreground/50 disabled:bg-transparent",
    icon: "justify-center text-foreground underline-offset-4 hover:underline active:no-underline disabled:bg-transparent disabled:text-muted-foreground focus-visible:ring-transparent focus-visible:ring-offset-transparent focus-visible:ring-offset-0 focus-visible:underline font-[Switzer-SemiBold]",
    iconUnderlined:
        "justify-center text-foreground underline-offset-4 hover:underline active:no-underline focus-visible:ring-transparent focus-visible:ring-offset-transparent focus-visible:ring-offset-0 focus-visible:underline cursor-pointer hover:border-b rounded-none border-foreground font-[Switzer-SemiBold]",
    destructive:
        "justify-center rounded-lg bg-button-destructive-bg text-button-destructive-fg border-2 border-transparent hover:bg-transparent hover:text-button-destructive-bg hover:border-button-destructive-bg focus-visible:ring-destructive active:bg-button-destructive-bg font-[Switzer-SemiBold]",
    nav: "justify-start bg-transparent border-none text-muted-foreground hover:bg-accent hover:text-foreground focus-visible:ring-primary rounded-md px-2 py-1.5 text-sm font-[Switzer-regular]",
    layout: "bg-transparent border-none text-accent-foreground [&_svg]:h-7 [&_svg]:w-7 transition-all hover:scale-105 hover:text-foreground focus-visible:ring-primary",
    ghost: "bg-transparent border-none text-primary hover:underline focus:ring-primary disabled:bg-transparent",
    social: "justify-center rounded-sm border border-popover-foreground/50 text-popover-foreground/50 hover:text-popover-foreground hover:border-popover-foreground w-10",
    hamburger:
        "justify-center bg-card border-border text-card-foreground fixed top-5 left-5 z-50 rounded-md border p-2 shadow-md w-10",
};

export const IconClasses: Record<ButtonVariant, string> = {
    icon: "w-4 h-4",
    iconUnderlined: "cursor-pointer w-4 h-4 text-foreground",
    primary: "",
    secondary: "",
    outline: "",
    card: "cursor-pointer w-4 h-4 text-card-foreground group-hover:text-foreground text-lg",
    underlineText: "",
    text: "",
    checkable: "",
    destructive: "",
    nav: "",
    layout: "",
    ghost: "",
    social: "",
    hamburger: "",
};

/**
 * Classes spécifiques aux tailles
 */
export const sizeClasses: Record<ButtonSize, string> = {
    xxs: "h-5 px-2 text-[10px]",
    xs: "h-6 px-2 text-xs",
    sm: "h-8 px-3 text-sm",
    md: "h-10 px-4 py-2 text-base",
    lg: "h-12 px-6 py-3 text-lg",
    xl: "h-14 px-8 py-4 text-xl",
    icon: "h-4 px-1 mt-1 pb-2 text-lg",
    card: "h-15 py-4",
};
