import React, {
  createContext,
  memo,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react'

import {
  TabsButtonClass,
  TabsContentClass,
  TabsLabelTextClass,
  TabsTriggerClass,
  TabsWrapperClass,
  labelClassName,
  stateButtonClass,
} from '@/components/UI/Tabs/Tab.styles'
import type { TabsContentProps, TabsProps, TabsTriggerProps } from '@/components/UI/Tabs/Tab.types'
import { cn } from '@/lib/utils'
import { Tooltip } from '@/components/UI/Tooltip/Tooltip'


/**
 * Button component
 * @param {React.ReactNode} props.children - Button children (texte ou icone)
 * @param {string} props.className - Button className (optionnel)
 * @param {boolean} props.fullWidth - Tabs taille 100% (par défaut : false)
 * @param {string} props.defaultValue - value par défaut
 * @param {boolean} props.disabled - Button disabled (par défaut : false)
 */

// Create a context to manage tabs state
const TabsContext = createContext<{
  activeTab: string
  setActiveTab: (value: string) => void
}>({
  activeTab: '',
  setActiveTab: () => { },
})

// Tabs Root Component
const Tabs: React.FC<TabsProps> = ({
  children,
  className,
  fullWidth,
  tabs,
  leftComponent,
  rightComponent,
  leftComponentClassname,
  rightComponentClassname,
  setCurrentStep,
  isAllowed = true,
  tabBgColor,
  value,
  variant = 'onglet',
  onChange,
}) => {
  // Use controlled value if provided, otherwise use internal state
  const [internalTab, setInternalTab] = useState(value || '')
  const activeTab = value !== undefined ? value : internalTab
  const width = fullWidth && 'w-full'

  // Custom setter that also calls the onChange prop
  const handleSetActiveTab = useCallback(
    (newValue: string) => {
      if (value === undefined) {
        setInternalTab(newValue)
      }
      setCurrentStep?.(tabs.findIndex((tab) => tab.value === newValue))
      onChange?.(newValue)
    },
    [value, tabs, setCurrentStep, onChange],
  )

  const contextValue = useMemo(
    () => ({ activeTab, setActiveTab: handleSetActiveTab }),
    [activeTab, handleSetActiveTab],
  )

  return (
    <TabsContext.Provider value={contextValue}>
      <div
        className={cn('flex shrink-0 items-center justify-between', className)}
      >
        {leftComponent && (
          <div className={leftComponentClassname}>{leftComponent}</div>
        )}
        <div className={cn(TabsWrapperClass[variant], tabBgColor, width)}>
          {tabs.map((tab) => (
            <TabsTrigger
              key={tab.value}
              icon={tab.icon}
              disabled={tab.disabled}
              stepLabel={tab.stepLabel}
              value={tab.value}
              variant={variant}
              fullWidth={fullWidth}
              isAllowed={isAllowed}
              tooltip={tab.tooltip}
            >
              {tab.label}
            </TabsTrigger>
          ))}
        </div>
        {rightComponent && (
          <div className={rightComponentClassname}>{rightComponent}</div>
        )}
      </div>
      <div className="flex min-h-0 flex-1 flex-col">{children}</div>
    </TabsContext.Provider>
  )
}

// Tabs Trigger Component
const TabsTriggerComponent: React.FC<TabsTriggerProps> = ({
  children,
  value,
  disabled,
  fullWidth,
  variant,
  stepLabel,
  isAllowed = true,
  icon,
  tooltip,
  ...props
}) => {
  const { activeTab, setActiveTab } = useContext(TabsContext)

  const handleClick = () => {
    if (value && !disabled && isAllowed) {
      setActiveTab(value)
    }
  }

  const isActive = activeTab === value

  // Déterminer les classes d'état
  const getActiveClasses = () => {
    if (isActive) return stateButtonClass[variant].active
    if (disabled) return stateButtonClass[variant].disabled
    return stateButtonClass[variant].default
  }

  // La variante `panel` rend une barre d'onglets plate : bouton sans habillage,
  // icône colorée indépendamment du texte et soulignement doré absolu (glow).
  const panelTrigger = (
    <button
      type="button"
      role="tab"
      aria-selected={isActive}
      disabled={disabled}
      onClick={handleClick}
      className={cn(
        'group relative flex shrink-0 items-center gap-2 whitespace-nowrap px-4 py-3 font-body text-[14px] font-bold tracking-wide transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 disabled:cursor-default disabled:opacity-40 cursor-pointer',
        isActive
          ? 'text-foreground'
          : 'text-muted-foreground hover:text-foreground/85',
      )}
      {...props}
    >
      {icon && (
        <span
          className={
            isActive
              ? 'text-primary'
              : 'text-muted-foreground/70 group-hover:text-primary/70'
          }
        >
          {React.createElement(icon, { size: 16 })}
        </span>
      )}
      {children}
      <span
        className={cn(
          'absolute inset-x-2 -bottom-0.5 h-[3px] rounded-full transition-all duration-200',
          isActive
            ? 'bg-primary shadow-[0_0_12px_hsl(43_59%_70%/0.6)]'
            : 'bg-transparent',
        )}
      />
    </button>
  )

  const trigger =
    variant === 'panel' ? (
      panelTrigger
    ) : (
      <div className={cn(TabsTriggerClass[variant], fullWidth && 'w-full')}>
        {stepLabel && <div className={cn(labelClassName)}>{stepLabel}</div>}
        <div>
          <button
            type="button"
            role="tab"
            aria-selected={isActive}
            className={cn(TabsButtonClass[variant], getActiveClasses())}
            onClick={handleClick}
            {...props}
          >
            {icon && <span>{React.createElement(icon, { size: 14 })}</span>}
            <span className={cn(TabsLabelTextClass[variant])}>{children}</span>
          </button>
        </div>
      </div>
    )

  if (tooltip) {
    return (
      <Tooltip content={tooltip} fullWidth={false} delay={200}>
        {trigger}
      </Tooltip>
    )
  }

  return trigger
}

const TabsTrigger = memo(TabsTriggerComponent)

// Tabs Content Component
const TabsContentComponent: React.FC<TabsContentProps> = ({
  children,
  value,
  className,
  keepMounted = false,
  ...props
}) => {
  const { activeTab } = useContext(TabsContext)
  const isActive = value === activeTab

  if (!isActive && !keepMounted) {
    return null
  }

  return (
    <div
      role="tabpanel"
      className={cn(TabsContentClass, className)}
      style={!isActive ? { display: 'none' } : undefined}
      {...props}
    >
      {children}
    </div>
  )
}

const TabsContent = memo(TabsContentComponent)

export { Tabs, TabsTrigger, TabsContent }
