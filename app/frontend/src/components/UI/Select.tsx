import {
	Content as SelectContentBase,
	Group as SelectGroup,
	Icon as SelectIcon,
	Item as SelectItemBase,
	ItemIndicator,
	ItemText,
	Label as SelectLabelBase,
	Portal,
	Root as Select,
	ScrollDownButton as SelectScrollDownButtonBase,
	ScrollUpButton as SelectScrollUpButtonBase,
	Separator as SelectSeparatorBase,
	Trigger as SelectTriggerBase,
	Value as SelectValue,
	Viewport,
} from "@radix-ui/react-select"
import { cn } from "@/lib/utils"
import { Check, ChevronDown, ChevronUp } from "lucide-react"
import { forwardRef } from "react"
import { motion, Variants, MotionProps } from "motion/react";

const menuVariants: Variants = {
	closed: {
		scale: 0,
		transition: {
			delay: 0.15,
		},
	},
	open: {
		scale: 1,
		transition: {
			type: "spring",
			duration: 0.4,
			delayChildren: 0.2,
			staggerChildren: 0.05,
		},
	},
};

const itemVariants: MotionProps = {
	variants: {
		closed: { x: -16, opacity: 0 },
		open: { x: 0, opacity: 1 },
	},
	transition: { opacity: { duration: 0.2 } },
};

// Trigger
const SelectTrigger = forwardRef<
	React.ComponentRef<typeof SelectTriggerBase>,
	React.ComponentPropsWithoutRef<typeof SelectTriggerBase> & {
		icon?: React.ReactNode
	}
>(({ className, children, icon, ...props }, ref) => (
	<SelectTriggerBase
		ref={ref}
		className={cn(
			"border-border ring-offset-background data-[placeholder]:text-accent-foreground focus:ring-focus group flex h-10 w-full cursor-pointer items-center justify-between rounded-md border bg-transparent px-3 py-2 text-sm whitespace-nowrap focus:ring-1 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1",
			className
		)}
		{...props}
	>
		{children}
		<SelectIcon asChild>
			{icon ?? (
				<ChevronDown className="h-4 w-4 opacity-50 transition-transform duration-200 group-data-[state=open]:rotate-180" />
			)}
		</SelectIcon>
	</SelectTriggerBase>
))
SelectTrigger.displayName = "SelectTrigger"

// Scroll Up Button
const SelectScrollUpButton = forwardRef<
	React.ComponentRef<typeof SelectScrollUpButtonBase>,
	React.ComponentPropsWithoutRef<typeof SelectScrollUpButtonBase>
>(({ className, ...props }, ref) => (
	<SelectScrollUpButtonBase
		ref={ref}
		className={cn(
			"flex cursor-default items-center justify-center py-1",
			className
		)}
		{...props}
	>
		<ChevronUp className="h-4 w-4" />
	</SelectScrollUpButtonBase>
))
SelectScrollUpButton.displayName = "SelectScrollUpButton"

// Scroll Down Button
const SelectScrollDownButton = forwardRef<
	React.ComponentRef<typeof SelectScrollDownButtonBase>,
	React.ComponentPropsWithoutRef<typeof SelectScrollDownButtonBase>
>(({ className, ...props }, ref) => (
	<SelectScrollDownButtonBase
		ref={ref}
		className={cn(
			"flex cursor-default items-center justify-center py-1",
			className
		)}
		{...props}
	>
		<ChevronDown className="h-4 w-4" />
	</SelectScrollDownButtonBase>
))
SelectScrollDownButton.displayName = "SelectScrollDownButton"

// Content
const SelectContent = forwardRef<
	React.ComponentRef<typeof SelectContentBase>,
	React.ComponentPropsWithoutRef<typeof SelectContentBase> & {
		animate?: boolean
	}
>(({ className, children, position = "popper", animate = false, ...props }, ref) => (
	<Portal>
		{animate ? (
			<motion.div
				initial="closed"
				animate="open"
				exit="closed"
				variants={menuVariants}
			>
				<SelectContentBase
					ref={ref}
					className={cn(
						"text-accent-foreground bg-input border-border shadow-default relative z-50 min-w-[8rem] origin-[--radix-select-content-transform-origin] overflow-hidden rounded-lg border data-[state=open]:ring-2 ring-ring data-[state=close]:ring-0",
						position === "popper" &&
						"data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1",
						className
					)}
					position={position}
					{...props}
				>
					<div className="p-1 w-full min-w-[var(--radix-select-trigger-width)]">
						{children}
					</div>
				</SelectContentBase>
			</motion.div>
		) : (
			<SelectContentBase
				ref={ref}
				className={cn(
					"text-accent-foreground bg-input border-border shadow-default relative z-50 min-w-[8rem] origin-[--radix-select-content-transform-origin] overflow-hidden rounded-lg border data-[state=open]:ring-2 ring-ring data-[state=close]:ring-0",
					"max-h-[--radix-select-content-available-height] overflow-y-auto",
					position === "popper" &&
					"data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1",
					className
				)}
				position={position}
				{...props}
			>
				<SelectScrollUpButton />
				<Viewport
					className={cn(
						"p-1",
						position === "popper" &&
						"h-[var(--radix-select-trigger-height)] w-full min-w-[var(--radix-select-trigger-width)]"
					)}
				>
					{children}
				</Viewport>
				<SelectScrollDownButton />
			</SelectContentBase>
		)}
	</Portal>
))
SelectContent.displayName = "SelectContent"

// Label
const SelectLabel = forwardRef<
	React.ComponentRef<typeof SelectLabelBase>,
	React.ComponentPropsWithoutRef<typeof SelectLabelBase>
>(({ className, ...props }, ref) => (
	<SelectLabelBase
		ref={ref}
		className={cn("px-2 py-1.5 text-sm font-semibold", className)}
		{...props}
	/>
))
SelectLabel.displayName = "SelectLabel"

// Item with Animation
const SelectItem = forwardRef<
	React.ComponentRef<typeof SelectItemBase>,
	React.ComponentPropsWithoutRef<typeof SelectItemBase> & {
		animate?: boolean
	}
>(({ className, children, animate = true, ...props }, ref) => {
	return (
		<SelectItemBase
			ref={ref}
			className={cn(
				"focus:bg-ring relative flex w-full cursor-pointer items-center rounded-md py-1.5 pr-8 pl-2 text-sm outline-none select-none focus:text-primary-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
				className
			)}
			{...props}
			asChild
		>
			{animate ? (
				<motion.div {...itemVariants}>
					<span className="absolute right-2 flex h-3.5 w-3.5 items-center justify-center">
						<ItemIndicator>
							<Check className="h-4 w-4" />
						</ItemIndicator>
					</span>
					<ItemText>{children}</ItemText>
				</motion.div>
			) : (
				<>
					<span className="absolute right-2 flex h-3.5 w-3.5 items-center justify-center">
						<ItemIndicator>
							<Check className="h-4 w-4" />
						</ItemIndicator>
					</span>
					<ItemText>{children}</ItemText>
				</>
			)}
		</SelectItemBase>
	)
})
SelectItem.displayName = "SelectItem"

// Separator
const SelectSeparator = forwardRef<
	React.ComponentRef<typeof SelectSeparatorBase>,
	React.ComponentPropsWithoutRef<typeof SelectSeparatorBase>
>(({ className, ...props }, ref) => (
	<SelectSeparatorBase
		ref={ref}
		className={cn("bg-muted -mx-1 my-1 h-px", className)}
		{...props}
	/>
))
SelectSeparator.displayName = "SelectSeparator"

export {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectLabel,
	SelectScrollDownButton,
	SelectScrollUpButton,
	SelectSeparator,
	SelectTrigger,
	SelectValue,
}