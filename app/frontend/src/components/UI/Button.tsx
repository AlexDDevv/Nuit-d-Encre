import { cn } from "@/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";
import { LucideIcon } from "lucide-react";
import { ButtonHTMLAttributes, forwardRef, Ref } from "react";
import { Link } from "react-router-dom";

const buttonVariants = cva(
    "inline-flex items-center gap-2 w-fit justify-center rounded-lg transition-colors duration-200 ease-in-out font-bold focus:outline-none focus:ring-2 focus:ring-offset-2 cursor-pointer border-2",
    {
        variants: {
            variant: {
                primary:
                    "bg-primary border-primary text-primary-foreground focus:ring-primary",
                secondary:
                    "bg-secondary border-secondary text-secondary-foreground focus:ring-secondary",
                tertiary:
                    "bg-white border-white text-primary hover:bg-primary hover:border-primary hover:text-white focus:ring-primary",
                pagination_btn:
                    "bg-transparent text-foreground border-none hover:bg-foreground hover:text-background focus:ring-primary rounded-md",
                outline:
                    "border-primary text-primary hover:bg-primary hover:text-white focus:ring-primary",
                transparent:
                    "bg-transparent border-white text-white hover:bg-primary hover:text-white focus:ring-primary hover:border-transparent",
                destructive:
                    "bg-destructive border-destructive text-destructive-foreground hover:bg-destructive-foreground hover:text-destructive focus:ring-destructive",
                disabled:
                    "bg-black-400 border-black-400 text-white focus:ring-black-400 pointer-events-none cursor-not-allowed",
                ghost: "bg-transparent border-none text-primary hover:underline focus:ring-primary",
                ghost_destructive:
                    "bg-transparent border-none text-destructive-medium hover:underline focus:ring-primary active:outline-none hover:bg-destructive-medium hover:text-white active:bg-transparent",
            },
            size: {
                sm: "px-3 py-1 text-sm",
                md: "px-5 py-2 text-base",
                lg: "px-6 py-3 text-lg",
                square: "w-12 h-12",
                square_sm: "w-10 h-10",
            },
            pagination: {
                selected: "bg-foreground text-background",
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
            isNavBtnSelected = false,
            role = "button",
            children,
            to,
            onClick,
            ...props
        },
        ref,
    ) => {
        const classNameContent = cn(
            buttonVariants({
                variant,
                size,
            }),
            isNavBtnSelected &&
            "text-primary hover:bg-primary-default bg-white hover:text-white",
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
                    onClick={onClick}
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
                    {...props}
                >
                    {childrenContent}
                </button>
            );
        }
    },
);

Button.displayName = "Button";

export { Button, buttonVariants };
