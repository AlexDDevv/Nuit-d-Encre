import { cn } from "@/lib/utils";
import { forwardRef, ComponentProps, useState } from "react";
import ErrorInput from "@/components/UI/form/ErrorInput";

type TextareaProps = ComponentProps<"textarea"> & {
    errorMessage: string | undefined;
    counter?: boolean;
    maxLength?: number;
};

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
    (
        {
            className,
            errorMessage,
            counter = false,
            maxLength,
            onChange,
            ...props
        },
        ref,
    ) => {
        const [charCount, setCharCount] = useState(0);

        const classError = errorMessage
            ? "border-destructive focus-visible:ring-destructive focus-visible:border-none"
            : "";

        const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
            setCharCount(e.target.value.length);

            if (onChange) {
                onChange(e);
            }
        };

        return (
            <div className="flex flex-col gap-1">
                <textarea
                    className={cn(
                        "bg-input ring-offset-input text-accent-foreground focus-visible:ring-ring border-border flex h-20 w-full rounded-lg border px-3 py-2 text-sm placeholder:italic placeholder:opacity-85 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 resize-none",
                        classError,
                        className,
                    )}
                    onChange={handleChange}
                    ref={ref}
                    {...props}
                />
                <div className="flex items-center justify-between gap-5">
                    {errorMessage && <ErrorInput message={errorMessage} />}
                    {counter && maxLength && (
                        <p className="text-card-foreground ml-auto text-xs">
                            {charCount}/{maxLength}
                        </p>
                    )}
                </div>
            </div>
        );
    },
);
Textarea.displayName = "Textarea";

export { Textarea };
