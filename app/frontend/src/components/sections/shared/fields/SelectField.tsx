import { FieldError, FieldValues } from "react-hook-form";
import TypeSelect from "@/components/UI/form/TypeSelect";
import FieldShell from "@/components/sections/shared/FieldShell";
import { atelierSelectTriggerClass } from "@/components/sections/shared/atelierField";
import { cn } from "@/lib/utils";
import { SelectFieldProps } from "@/types/types";

/** Sélecteur de l'atelier : `FieldShell` + `TypeSelect` conservé. */
export default function SelectField<T extends FieldValues>({
    name,
    label,
    control,
    errors,
    options,
    message,
    placeholder,
    icon,
    required,
    disabled,
}: SelectFieldProps<T>) {
    const error = (errors as Record<string, FieldError | undefined>)[name]
        ?.message;

    return (
        <FieldShell
            htmlFor={name}
            label={label}
            icon={icon}
            required={required}
            error={error}
        >
            <TypeSelect
                id={name}
                control={control}
                name={name}
                message={message}
                selectSomething={placeholder}
                options={options}
                disabled={disabled}
                className={cn(atelierSelectTriggerClass, icon && "pl-11")}
            />
        </FieldShell>
    );
}
