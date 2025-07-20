import {
    Indicator as CheckboxIndicator,
    Root as CheckboxRoot,
} from "@radix-ui/react-checkbox";
import { CheckIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ComponentProps } from "react";

type CheckboxProps = ComponentProps<typeof CheckboxRoot>;

function Checkbox({ className, ...props }: CheckboxProps) {
    return (
        <CheckboxRoot
            id="rememberMe"
            data-slot="checkbox"
            className={cn(
                "border-border bg-input data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground data-[state=checked]:border-primary focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive aria-invalid:border-destructive peer size-4 shrink-0 rounded-sm border outline-none transition-shadow focus-visible:ring-2 disabled:cursor-not-allowed disabled:opacity-50",
                className,
            )}
            {...props}
        >
            <CheckboxIndicator
                data-slot="checkbox-indicator"
                className="flex items-center justify-center text-current transition-none"
            >
                <CheckIcon className="size-3.5" />
            </CheckboxIndicator>
        </CheckboxRoot>
    );
}

export { Checkbox };
