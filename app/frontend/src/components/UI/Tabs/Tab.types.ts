import type { HTMLAttributes, ReactNode } from 'react'
import type { IconType } from 'react-icons'

// Define possible sides for the modal
export type TabsVariant = 'onglet' | 'white' | 'step' | 'panel'

export type tabBgColor =
  | 'bg-background'
  | 'bg-muted'
  | 'bg-card'
  | 'bg-popover'
  | 'bg-accent'
  | 'bg-secondary'

export type TabConfiguration = {
  label: string
  stepLabel?: string
  value: string
  disabled?: boolean
  icon?: IconType
  availableFor?: Array<string>
  tooltip?: string
}

export interface TabsProps {
  children?: ReactNode
  className?: string
  fullWidth?: boolean
  value?: string
  triggerWidth?: string
  tabs: Array<TabConfiguration>
  disabled?: boolean
  variant?: TabsVariant
  tabBgColor?: string
  leftComponent?: ReactNode
  rightComponent?: ReactNode
  setCurrentStep?: (step: number) => void // Optional setter for current step
  isAllowed?: boolean
  wrapperClassName?: string
  leftComponentClassname?: string
  rightComponentClassname?: string
  icon?: IconType
  onChange?: (value: string) => void // New onChange prop
}

export interface TabsTriggerProps extends HTMLAttributes<HTMLButtonElement> {
  value: string
  disabled?: boolean
  children?: ReactNode
  variant: TabsVariant
  stepLabel?: string
  icon?: IconType
  fullWidth?: boolean
  isAllowed?: boolean
  tooltip?: string
}

export interface TabsContentProps extends HTMLAttributes<HTMLDivElement> {
  label?: string
  value: string
  children?: ReactNode
  /**
   * When true, the tab content stays mounted in the DOM even when inactive
   * (rendered with `display:none`). Useful when child components (e.g. Highcharts)
   * need to remain alive for off-screen capture or state preservation.
   */
  keepMounted?: boolean
}

export interface TabsListProps extends HTMLAttributes<HTMLDivElement> {
  children?: ReactNode
}
