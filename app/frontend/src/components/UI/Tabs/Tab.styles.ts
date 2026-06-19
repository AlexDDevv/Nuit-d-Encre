import type { TabsVariant } from './Tab.types'

/**
 * Classes de base pour tous les Tabs wrapper
 */
export const TabsWrapperClass: Record<TabsVariant, string> = {
  onglet:
    'inline-flex h-9 items-center justify-center rounded-md border border-border bg-muted p-1 text-muted-foreground',
  white:
    'inline-flex h-10 items-center justify-center rounded-md border border-border bg-muted p-1 text-muted-foreground',
  step: 'px-0 flex flex-auto items-center gap-7',
  panel:
    'flex w-full items-center gap-1 overflow-x-auto no-scrollbar border-b-2 border-border font-body',
}

/**
 * Classes de base pour tous les trigger buttons
 */
export const TabsTriggerClass = {
  onglet: 'flex flex-col justify-between flex-auto',
  white: 'flex flex-col justify-between flex-auto',
  step: 'flex flex-col justify-between',
  panel: 'flex flex-col justify-between',
}

/**
 * Classes de base pour tous les trigger buttons
 */
export const TabsButtonClass = {
  onglet:
    'whitespace-nowrap rounded-sm py-1 font-body text-sm font-medium text-muted-foreground outline-none ring-0 disabled:pointer-events-none disabled:opacity-50 h-7 w-full px-10 transition-colors duration-200 ease-in-out hover:text-foreground flex items-center gap-3',
  white:
    'whitespace-nowrap rounded-sm py-1 font-body text-sm font-medium text-muted-foreground outline-none ring-0 disabled:pointer-events-none disabled:opacity-50 h-8 w-full px-20 transition-colors duration-200 ease-in-out hover:text-foreground flex items-center gap-3',
  step: 'h-10 text-start text-muted-foreground text-sm font-semibold border-b-2 border-border font-body w-full transition-colors duration-200 ease-in-out hover:text-foreground',
  panel:
    'font-bold h-9 text-muted-foreground border-b-2 border-border font-body px-4 transition-colors duration-200 ease-in-out hover:text-foreground',
}

export const labelClassName =
  'flex text-xs font-normal font-body text-muted-foreground'

/**
 * Classes du texte du label à l'intérieur du bouton.
 * Pour la variante `panel`, le label passe en `text-xxs` quand l'écran est
 * petit / zoomé (breakpoints bas : xs, sm, md) et reprend sa taille originelle
 * `text-base` dès `lg`.
 */
export const TabsLabelTextClass: Record<TabsVariant, string> = {
  onglet: '',
  white: '',
  step: '',
  panel: 'text-xxxs md:text-xxs lg:text-sm xl:text-sm 3xl:text-sm',
}

/**
 * Classe d'état actif
 */
export const stateButtonClass = {
  onglet: {
    default: 'cursor-pointer',
    active:
      'bg-primary text-primary-foreground shadow-sm hover:text-primary-foreground',
    disabled:
      'cursor-default text-muted-foreground/40 hover:text-muted-foreground/40',
  },
  white: {
    default: 'cursor-pointer',
    active:
      'bg-primary text-primary-foreground shadow-sm hover:text-primary-foreground',
    disabled:
      'cursor-default text-muted-foreground/40 hover:text-muted-foreground/40',
  },
  step: {
    default: 'cursor-pointer',
    active: 'border-primary text-foreground font-bold',
    disabled:
      'cursor-default text-muted-foreground/40 hover:text-muted-foreground/40',
  },
  panel: {
    default: 'cursor-pointer',
    active: 'border-primary text-foreground',
    disabled:
      'cursor-default text-muted-foreground/40 hover:text-muted-foreground/40',
  },
}
/**
 * Classes de base pour tous les tabs content
 */
export const TabsContentClass =
  'ring-offset-background flex-1 flex flex-col min-h-0'
