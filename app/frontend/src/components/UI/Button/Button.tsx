import { forwardRef, Ref } from 'react'
import { Link } from 'react-router-dom'
import { cn } from '@/lib/utils'
import {
    IconClasses,
    baseClasses,
    sizeClasses,
    variantClasses,
} from '@/components/UI/Button/Button.styles'
import type { ButtonProps } from '@/components/UI/Button/Button.types'

/**
 * Button component
 * @param {React.ReactNode} props.children - Button children (texte ou icone)
 * @param {string} props.className - Button className (optionnel)
 * @param {string} props.variant - Button variant (primary, secondary, danger, outline, text, checkable, icon, iconUnderlined, card, underlineText, nav, layout) (par défaut : primary)
 * @param {string} props.size - Button size (xxs, xs, sm, md, lg, xl, icon, card) (par défaut : md)
 * @param {boolean} props.fullWidth - Button taille 100% (par défaut : false)
 * @param {boolean} props.disabled - Button disabled (par défaut : false)
 * @param {boolean} props.loading - Button loading (par défaut : false)
 * @param {boolean} props.isChecked - Button isChecked (par défaut : false)
 * @param {boolean} props.isNavBtnSelected - Indique si le bouton de navigation est actif (par défaut : false)
 * @param {string} props.ariaLabel - Label d'accessibilité
 * @param {string} props.to - Route react-router (rend le bouton comme un lien)
 * @param {React.ReactNode} props.leftIcon - Icône à gauche du texte (optionnel)
 * @param {React.ReactNode} props.rightIcon - Icône à droite du texte (optionnel)
 * @param {React.ReactNode} props.icon - Icône centrée, pour les boutons icon (optionnel)
 * @param {React.MouseEventHandler<HTMLButtonElement>} props.handleCheck - Fonction de clic sur l'icône de droite
 */
const Button = forwardRef<HTMLElement, ButtonProps>(
    (
        {
            children,
            className,
            variant = 'primary',
            size = 'md',
            fullWidth = false,
            disabled = false,
            handleClick: _handleClick,
            handleCheck,
            loading = false,
            isChecked,
            isNavBtnSelected = false,
            ariaLabel,
            to,
            leftIcon,
            icon,
            rightIcon,
            checkedRightIcon,
            type = 'button',
            onClick,
            ...props
        },
        ref,
    ) => {
        const classNameContent = cn(
            baseClasses,
            variantClasses[variant],
            sizeClasses[size],
            fullWidth ? 'w-full' : '',
            isNavBtnSelected && 'bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground',
            className,
        )

        const childrenContent = (
            <>
                {loading && (
                    <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent mr-2" />
                )}

                {!loading && leftIcon && <span className="mr-2">{leftIcon}</span>}

                <div
                    className={cn(variant === 'checkable' && 'w-4/6 flex justify-start')}
                >
                    {!loading && icon && (
                        <span className={cn(IconClasses[variant], className)}>
                            {icon}
                        </span>
                    )}
                    {children}
                </div>

                {!loading && (rightIcon || checkedRightIcon) && (
                    <span
                        onClick={handleCheck}
                        className={cn(
                            'ml-2',
                            checkedRightIcon && 'text-muted-foreground hover:text-foreground',
                            isChecked && 'text-foreground',
                        )}
                    >
                        {isChecked ? checkedRightIcon : rightIcon}
                    </span>
                )}
            </>
        )

        if (to) {
            return (
                <Link
                    to={to}
                    ref={ref as Ref<HTMLAnchorElement>}
                    aria-label={ariaLabel}
                    className={classNameContent}
                    onClick={onClick as unknown as React.MouseEventHandler<HTMLAnchorElement>}
                >
                    {childrenContent}
                </Link>
            )
        }

        return (
            <button
                ref={ref as Ref<HTMLButtonElement>}
                type={type}
                disabled={disabled || loading}
                aria-label={ariaLabel}
                className={classNameContent}
                onClick={onClick}
                {...props}
            >
                {childrenContent}
            </button>
        )
    },
)

Button.displayName = 'Button'

export default Button
