import { FieldError, FieldValues } from "react-hook-form";
import { Input } from "@/components/UI/form/Input";
import FieldShell from "@/components/sections/shared/FieldShell";
import { atelierControlClass } from "@/components/sections/shared/atelierField";
import { cn } from "@/lib/utils";
import { TextFieldProps } from "@/types/types";

/** Champ texte de l'atelier : habillage `FieldShell` + `Input` conservé. */
export default function TextField<T extends FieldValues>({
    name,
    label,
    register,
    errors,
    rules,
    icon,
    required,
    hint,
    mono,
    preventDecimal,
    type = "text",
    ...inputProps
}: TextFieldProps<T>) {
    const error = (errors as Record<string, FieldError | undefined>)[name]
        ?.message;

    return (
        <FieldShell
            htmlFor={name}
            label={label}
            icon={icon}
            required={required}
            error={error}
            hint={hint}
        >
            <Input
                id={name}
                type={type}
                className={cn(
                    atelierControlClass,
                    icon && "pl-11",
                    mono && "font-mono",
                )}
                aria-required={required}
                onKeyDown={
                    preventDecimal
                        ? (e) => {
                              if (e.key === "." || e.key === ",") {
                                  e.preventDefault();
                              }
                          }
                        : undefined
                }
                {...inputProps}
                {...register(name, rules)}
                aria-invalid={error ? "true" : "false"}
                errorMessage={error}
                hideErrorMessage
            />
        </FieldShell>
    );
}
