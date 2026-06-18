/**
 * Classes de base pour tous les inputs
 */
export const baseClass =
  'peer inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full border-2 shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60 focus-visible:ring-offset-2 focus-visible:ring-offset-card'

/**
 * Classes pour les différents états
 */
export const stateClass = {
  checked: 'bg-primary/85 border-primary',
  checkedDisabled: 'bg-primary/85 border-primary opacity-50 cursor-not-allowed',
  default: 'bg-popover/70 border-border',
  disabled: 'cursor-not-allowed bg-popover/70 border-border opacity-50',
}

/**
 * Classes de base pour tous les inputs
 */
export const spanClass =
  'pointer-events-none block h-4 w-4 rounded-full shadow-lg ring-0'

/**
 * Classes de base pour tous les inputs
 */
export const spanStateClass = {
  checked: 'transition-transform translate-x-4 bg-primary-foreground',
  default: 'transition-transform -translate-x-0 bg-muted-foreground/70',
}
