import { cn } from "@/lib/utils";
import { ComponentProps, forwardRef } from "react";
import ErrorInput from "@/components/UI/form/ErrorInput";

type InputProps = ComponentProps<"input"> & {
    errorMessage: string | undefined;
};

const Input = forwardRef<HTMLInputElement, InputProps>(
    ({ className, type, errorMessage, ...props }, ref) => {
        const classError = errorMessage
            ? "border-destructive focus-visible:ring-destructive focus-visible:border-none"
            : "";

        return (
            <div className="flex flex-col gap-1">
                <input
                    type={type}
                    className={cn(
                        "bg-input ring-offset-input text-accent-foreground focus-visible:ring-ring border-border flex h-10 w-full rounded-lg border px-3 py-2 text-sm placeholder:italic placeholder:opacity-85 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
                        classError,
                        className,
                    )}
                    ref={ref}
                    {...props}
                />
                {errorMessage && <ErrorInput message={errorMessage} />}
            </div>
        );
    },
);
Input.displayName = "Input";

export { Input };
