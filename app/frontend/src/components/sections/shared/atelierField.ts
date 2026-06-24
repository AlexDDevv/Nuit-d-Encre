/**
 * Classes de présentation « atelier du scribe » appliquées par-dessus les
 * composants de formulaire conservés (Input, Textarea, TypeSelect).
 * Bordure 2px qui s'illumine, fond popover, halo doré au focus.
 */
export const atelierControlClass =
    "h-10 rounded-lg border-2 border-border bg-popover/70 text-foreground placeholder:not-italic placeholder:text-muted-foreground/45 transition-all duration-200 hover:border-primary/40 focus-visible:border-primary focus-visible:bg-popover focus-visible:ring-0 focus-visible:shadow-[0_0_0_3px_hsl(43_59%_81%/0.16)]";

export const atelierTextareaClass =
    "h-auto min-h-32 resize-y rounded-lg border-2 border-border bg-popover/70 leading-relaxed text-foreground placeholder:not-italic placeholder:text-muted-foreground/45 transition-all duration-200 hover:border-primary/40 focus-visible:border-primary focus-visible:bg-popover focus-visible:ring-0 focus-visible:shadow-[0_0_0_3px_hsl(43_59%_81%/0.16)]";

/** Variante compacte pour l'édition inline (cellules de tableau) : mêmes tokens
 * que le contrôle atelier, sans la hauteur fixe ni le padding pleine taille. */
export const atelierInlineClass =
    "rounded-md border-2 border-border bg-popover/70 px-2.5 py-1 text-foreground transition-all duration-200 hover:border-primary/40 focus-visible:border-primary focus-visible:outline-none focus-visible:ring-0 focus-visible:shadow-[0_0_0_3px_hsl(43_59%_81%/0.16)]";

export const atelierSelectTriggerClass =
    "h-10 rounded-lg border-2 border-border bg-popover/70 pr-3.5 text-sm text-foreground transition-all duration-200 hover:border-primary/40 focus:border-primary focus:ring-0 focus:shadow-[0_0_0_3px_hsl(43_59%_81%/0.16)] data-placeholder:text-muted-foreground/45 data-[state=open]:border-primary data-[state=open]:shadow-[0_0_0_3px_hsl(43_59%_81%/0.16)]";
