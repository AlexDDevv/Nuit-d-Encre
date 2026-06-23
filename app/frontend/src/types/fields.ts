import { ComponentProps } from "react";
import { IconType } from "react-icons";
import {
    Control,
    FieldErrors,
    FieldValues,
    Path,
    RegisterOptions,
    UseFormRegister,
} from "react-hook-form";
import { TypeSelectOptions } from "./ui";

export type TextFieldProps<T extends FieldValues> = {
    name: Path<T>;
    label: string;
    register: UseFormRegister<T>;
    errors: FieldErrors<T>;
    rules?: RegisterOptions<T, Path<T>>;
    icon?: IconType;
    required?: boolean;
    hint?: string;
    mono?: boolean;
    /** Empêche la saisie de « . » et « , » (champs entiers). */
    preventDecimal?: boolean;
} & Pick<
    ComponentProps<"input">,
    "type" | "placeholder" | "inputMode" | "step"
>;

export type TextareaFieldProps<T extends FieldValues> = {
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

export type SelectFieldProps<T extends FieldValues> = {
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
