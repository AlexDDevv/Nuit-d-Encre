import * as React from 'react'
import {
  baseClass,
  spanClass,
  spanStateClass,
  stateClass,
} from './Switch.styles'
import type { SwitchProps } from './Switch.type'
import { cn } from '@/lib/utils'

export const Switch = React.forwardRef<HTMLButtonElement, SwitchProps>(
  (
    { className, checked, onCheckedChange, disabled, ...props },
    ref,
  ) => {
    // Déterminer les classes d'état
    const getStateClass = () => {
      if (checked && disabled) return stateClass.checkedDisabled
      if (checked) return stateClass.checked
      if (disabled) return stateClass.disabled
      return stateClass.default
    }

    const getSpanStateClass = () => {
      if (checked) return spanStateClass.checked
      return spanStateClass.default
    }

    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      e.preventDefault() // Prevent form submission
      e.stopPropagation() // Prevent event bubbling

      if (!disabled && onCheckedChange) {
        onCheckedChange(!checked)
      }
    }

    return (
      <button
        type="button"
        role="switch"
        className={cn(baseClass, getStateClass(), className)}
        aria-checked={checked}
        aria-disabled={disabled}
        onClick={handleClick}
        {...props}
        ref={ref}
      >
        <span className={cn(spanClass, getSpanStateClass())} />
      </button>
    )
  },
)
Switch.displayName = 'Switch'
