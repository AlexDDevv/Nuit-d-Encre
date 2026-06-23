import { IconType } from "react-icons";
import {
    Control,
    FieldError,
    FieldErrors,
    FieldValues,
    Path,
} from "react-hook-form";
import TypeSelect from "@/components/UI/form/TypeSelect";
import FieldShell from "@/components/sections/shared/FieldShell";
import { atelierSelectTriggerClass } from "@/components/sections/shared/atelierField";
import { cn } from "@/lib/utils";
import { TypeSelectOptions } from "@/types/types";

type SelectFieldProps<T extends FieldValues> = {
    name: Path<T>;
    label: string;
    control: Control<T>;
    errors: FieldErrors<T>;
    options: TypeSelectOptions[];
    message: string;
    placeholder: string;
    icon?: IconType;
    required?: boolean;
    disabled?: boolean;
};

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
