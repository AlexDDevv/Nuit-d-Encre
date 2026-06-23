import {
    FieldError,
    FieldErrors,
    FieldValues,
    Path,
    RegisterOptions,
    UseFormRegister,
} from "react-hook-form";
import { Textarea } from "@/components/UI/form/Textarea";
import FieldShell from "@/components/sections/shared/FieldShell";
import { atelierTextareaClass } from "@/components/sections/shared/atelierField";
import { cn } from "@/lib/utils";

type TextareaFieldProps<T extends FieldValues> = {
    name: Path<T>;
    label: string;
    register: UseFormRegister<T>;
    errors: FieldErrors<T>;
    rules?: RegisterOptions<T, Path<T>>;
    required?: boolean;
    placeholder?: string;
    rows?: number;
    max: number;
    /** Longueur courante (via `watch`) pour alimenter le compteur. */
    length: number;
};

/** Zone de texte serif de l'atelier : `FieldShell` + `Textarea` conservé. */
export default function TextareaField<T extends FieldValues>({
    name,
    label,
    register,
    errors,
    rules,
    required,
    placeholder,
    rows = 5,
    max,
    length,
}: TextareaFieldProps<T>) {
    const error = (errors as Record<string, FieldError | undefined>)[name]
        ?.message;

    return (
        <FieldShell
            htmlFor={name}
            label={label}
            required={required}
            error={error}
            counter={{ value: length, max }}
        >
            <Textarea
                id={name}
                rows={rows}
                className={cn(atelierTextareaClass, "font-quote text-base")}
                placeholder={placeholder}
                aria-required={required}
                {...register(name, rules)}
                aria-invalid={error ? "true" : "false"}
                errorMessage={error}
                hideErrorMessage
            />
        </FieldShell>
    );
}
