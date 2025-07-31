import * as LabelPrimitive from "@radix-ui/react-label";
import { cva, type VariantProps } from "class-variance-authority";
import { ComponentPropsWithoutRef, ComponentRef, forwardRef } from "react";
import { cn } from "@/lib/utils";

const labelVariants = cva(
    "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-card-foreground",
);

interface LabelProps
    // Inherit all props from LabelPrimitive.Root (ex: htmlFor, id, etc.)
    extends ComponentPropsWithoutRef<typeof LabelPrimitive.Root>,
        // Include variant types from labelVariants
        VariantProps<typeof labelVariants> {
    // Add a custom prop
    required?: boolean;
}

const Label = forwardRef<ComponentRef<typeof LabelPrimitive.Root>, LabelProps>(
    ({ className, required, children, ...props }, ref) => (
        <LabelPrimitive.Root
            ref={ref}
            className={cn(labelVariants(), className)}
            {...props}
        >
            {children}
            {required && <span className="ml-1">*</span>}
        </LabelPrimitive.Root>
    ),
);

Label.displayName = LabelPrimitive.Root.displayName;

export { Label };
