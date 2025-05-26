import { cn } from "../../lib/utils";
import { cva, type VariantProps } from "class-variance-authority";
import { LucideIcon } from "lucide-react";
import { ButtonHTMLAttributes, forwardRef, Ref } from "react";
import { Link } from "react-router-dom";

const buttonVariants = cva(
    "inline-flex items-center gap-2 w-fit justify-center rounded-lg transition-colors duration-200 ease-in-out font-bold focus:outline-none focus:ring-1 focus:ring-offset-1 cursor-pointer border-2",
    {
        variants: {
            variant: {
                primary:
                    "bg-primary border-primary text-primary-foreground hover:bg-transparent hover:text-card-foreground hover:border-card-foreground focus:ring-ring",
                secondary:
                    "bg-secondary border-secondary text-secondary-foreground hover:bg-transparent hover:text-card-foreground hover:border-card-foreground focus:ring-ring",
                destructive:
                    "bg-destructive border-destructive text-white hover:bg-white hover:text-destructive focus:ring-destructive",
            },
            size: {
                sm: "px-3 py-1 text-sm",
                md: "px-5 py-2 text-base",
                lg: "px-6 py-3 text-lg",
                square: "w-12 h-12",
            },
        },
        defaultVariants: {
            variant: "primary",
            size: "md",
        },
    },
);

export interface ButtonProps
    extends ButtonHTMLAttributes<HTMLButtonElement>,
        VariantProps<typeof buttonVariants> {
    icon?: LucideIcon;
    iconPosition?: "left" | "right";
    ariaLabel: string;
    fullWidth?: boolean;
    isNavBtnSelected?: boolean;
    onClick?: React.MouseEventHandler;
    role?: "button" | "submit" | "link";
    to?: string;
}

const Button = forwardRef<HTMLElement, ButtonProps>(
    (
        {
            className,
            variant,
            size,
            icon: Icon,
            iconPosition = "left",
            ariaLabel,
            fullWidth = false,
            role = "button",
            children,
            to,
            onClick,
        },
        ref,
    ) => {
        const classNameContent = cn(
            buttonVariants({
                variant,
                size,
            }),
            fullWidth && "w-full",
            className,
        );

        const childrenContent = (
            <>
                {Icon && iconPosition === "left" && (
                    <Icon className="h-5 w-5" aria-hidden />
                )}
                {children}
                {Icon && iconPosition === "right" && (
                    <Icon className="h-5 w-5" aria-hidden />
                )}
            </>
        );

        if (to) {
            return (
                <Link
                    to={to}
                    ref={ref as Ref<HTMLAnchorElement>}
                    aria-label={ariaLabel}
                    role={role}
                    className={classNameContent}
                >
                    {childrenContent}
                </Link>
            );
        } else {
            return (
                <button
                    ref={ref as Ref<HTMLButtonElement>}
                    aria-label={ariaLabel}
                    role={role}
                    onClick={onClick}
                    className={classNameContent}
                >
                    {childrenContent}
                </button>
            );
        }
    },
);

Button.displayName = "Button";

export { Button, buttonVariants };
