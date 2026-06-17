// Tooltip.type.ts
import type { ReactNode } from 'react'

export type TooltipPosition = 'top' | 'bottom' | 'left' | 'right'

export interface TooltipProps {
  content: ReactNode
  children: ReactNode
  position?: TooltipPosition
  delay?: number
  className?: string
  fullWidth?: boolean
  /** Écart en px entre le déclencheur et la tooltip (défaut : 6) */
  gap?: number
}

export interface TooltipProviderProps {
  children: ReactNode
  delayDuration?: number
}

export interface TooltipContextType {
  delayDuration: number
}
