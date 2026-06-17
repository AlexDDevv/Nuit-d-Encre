import { createPortal } from 'react-dom'
import {
  cloneElement,
  forwardRef,
  isValidElement,
  useId,
  useLayoutEffect,
  useRef,
  useState,
} from 'react'
import { tooltipContentClass } from './Tooltip.style'
import type { TooltipProps } from './Tooltip.type'
import { cn } from '@/lib/utils'

export const Tooltip = forwardRef<HTMLDivElement, TooltipProps>(
  (
    {
      content,
      position = 'top',
      children,
      className,
      delay = 0,
      fullWidth = true,
      gap = 6,
    },
    ref,
  ) => {
    const [coords, setCoords] = useState<React.CSSProperties | null>(null)
    const tooltipId = useId()
    const isOpen = Boolean(coords && content)
    const triggerRef = useRef<HTMLDivElement>(null)
    const tooltipRef = useRef<HTMLDivElement>(null)
    const timeoutRef = useRef<ReturnType<typeof setTimeout>>(null)

    const show = () => {
      timeoutRef.current = setTimeout(() => {
        const rect = triggerRef.current?.getBoundingClientRect()
        if (!rect) return
        const positions = {
          top: {
            top: rect.top - gap,
            left: rect.left + rect.width / 2,
            transform: 'translate(-50%, -100%)',
          },
          bottom: {
            top: rect.bottom + gap,
            left: rect.left + rect.width / 2,
            transform: 'translate(-50%, 0)',
          },
          left: {
            top: rect.top + rect.height / 2,
            left: rect.left - gap,
            transform: 'translate(-100%, -50%)',
          },
          right: {
            top: rect.top + rect.height / 2,
            left: rect.right + gap,
            transform: 'translate(0, -50%)',
          },
        }
        setCoords(positions[position])
      }, delay)
    }

    const hide = () => {
      clearTimeout(timeoutRef.current!)
      setCoords(null)
    }

    useLayoutEffect(() => {
      if (!coords || !tooltipRef.current) return
      const el = tooltipRef.current
      const elRect = el.getBoundingClientRect()
      const margin = 8

      if (elRect.right > window.innerWidth - margin) {
        el.style.left = `${(coords.left as number) - (elRect.right - window.innerWidth + margin)}px`
      } else if (elRect.left < margin) {
        el.style.left = `${margin}px`
        el.style.transform = (coords.transform as string).replace('-50%', '0')
      }

      if (elRect.top < margin) {
        el.style.top = `${(coords.top as number) + (margin - elRect.top)}px`
      }
    }, [coords])

    return (
      <div
        ref={(node) => {
          triggerRef.current = node
          if (typeof ref === 'function') ref(node)
          else if (ref) ref.current = node
        }}
        className={cn('relative inline-block', fullWidth ? 'w-full' : 'w-fit')}
        onMouseEnter={show}
        onMouseLeave={hide}
        onFocus={show}
        onBlur={hide}
        onClick={hide}
        onKeyDown={(e) => {
          if (e.key === 'Escape') hide()
        }}
      >
        {isValidElement(children) && isOpen
          ? cloneElement(children, { 'aria-describedby': tooltipId } as Partial<
              React.HTMLAttributes<HTMLElement>
            >)
          : children}
        {isOpen &&
          createPortal(
            <div
              ref={tooltipRef}
              id={tooltipId}
              role="tooltip"
              className={cn(tooltipContentClass, className)}
              style={{ position: 'fixed', ...coords }}
            >
              {content}
            </div>,
            document.body,
          )}
      </div>
    )
  },
)

Tooltip.displayName = 'Tooltip'
