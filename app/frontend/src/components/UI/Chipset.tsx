import { cva, type VariantProps } from "class-variance-authority"
import * as React from "react"
import { cn } from "@/lib/utils"

export interface ChipsetProps
	extends React.HTMLAttributes<HTMLDivElement>,
	VariantProps<typeof chipsetVariants> {
	rounded?: boolean
	ariaLabel: string
}

const chipsetVariants = cva(
	"inline-flex items-center gap-1 border h-fit w-fit rounded-sm px-3 py-1 text-xs font-medium transition-colors",
	{
		variants: {
			variant: {
				primary:
					"bg-primary text-primary-foreground border-primary",

				secondary:
					"bg-secondary text-secondary-foreground border-secondary",

				muted:
					"bg-muted text-muted-foreground border-border",

				outline:
					"bg-transparent text-foreground border-primary",

				destructive:
					"bg-destructive text-destructive-foreground border-destructive",
			},
		},
		defaultVariants: {
			variant: "primary",
		},
	}
)

function Chipset({
	className,
	variant,
	ariaLabel,
	rounded = false,
	...props
}: ChipsetProps) {
	return (
		<div
			aria-label={ariaLabel}
			className={cn(
				chipsetVariants({ variant }),
				rounded && "rounded-full",
				className
			)}
			{...props}
		/>
	)
}

export { Chipset }
