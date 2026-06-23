import { cn } from "@/lib/utils";
import { forwardRef, ComponentProps, useState } from "react";
import ErrorInput from "@/components/UI/form/ErrorInput";

type TextareaProps = ComponentProps<"textarea"> & {
    errorMessage: string | undefined;
    counter?: boolean;
    maxLength?: number;
    /** Masque le message d'erreur intégré (la bordure rouge reste appliquée). */
    hideErrorMessage?: boolean;
};

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
    (
        {
            className,
            errorMessage,
            counter = false,
            maxLength,
            hideErrorMessage = false,
            onChange,
            value,
            defaultValue,
            ...props
        },
        ref,
    ) => {
        const [charCount, setCharCount] = useState(
            ((value ?? defaultValue) as string | undefined)?.length ?? 0,
        );

        const currentLength =
            typeof value === "string" ? value.length : charCount;

        const classError = errorMessage
            ? "border-destructive focus-visible:ring-destructive focus-visible:border-none"
            : "";

        const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
            setCharCount(e.target.value.length);
            onChange?.(e);
        };

        return (
            <div className="flex flex-col gap-1">
                <textarea
                    className={cn(
                        "bg-input ring-offset-input text-accent-foreground focus-visible:ring-ring border-border flex h-20 w-full rounded-lg border px-3 py-2 text-sm placeholder:italic placeholder:opacity-85 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 resize-none",
                        classError,
                        className,
                    )}
                    value={value}
                    defaultValue={defaultValue}
                    onChange={handleChange}
                    ref={ref}
                    {...props}
                />
                {((!hideErrorMessage && errorMessage) ||
                    (counter && maxLength)) && (
                    <div className="flex items-center justify-between gap-5">
                        {!hideErrorMessage && errorMessage && (
                            <ErrorInput message={errorMessage} />
                        )}
                        {counter && maxLength && (
                            <p className="text-card-foreground ml-auto text-xs">
                                {currentLength}/{maxLength}
                            </p>
                        )}
                    </div>
                )}
            </div>
        );
    },
);
Textarea.displayName = "Textarea";

export { Textarea };
