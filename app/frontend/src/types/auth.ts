import { FormEventHandler, ReactNode } from "react";
import {
    FieldErrors,
    FieldValues,
    UseFormGetValues,
    UseFormRegister,
} from "react-hook-form";
import { UserSignUpForm } from "./user";

/** Mode d'un écran d'authentification (pages sœurs connexion / inscription). */
export type AuthMode = "connexion" | "inscription";

export interface EditorialPanelProps {
    mode: AuthMode;
}

export interface ContinueWithProps {
    /** Libellé central du séparateur orné (par défaut « ou »). */
    label?: string;
}

export interface AuthShellProps {
    mode: AuthMode;
    onSubmit: FormEventHandler<HTMLFormElement>;
    children: ReactNode;
}

export interface AuthCardHeaderProps {
    /** Accroche serif sous le titre. */
    welcome: string;
    /** Libellé mono de la page (ex. « Connexion »). */
    eyebrow: string;
}

/** Props communes des champs de formulaire d'authentification (register + erreurs). */
export interface AuthFieldProps<T extends FieldValues> {
    register: UseFormRegister<T>;
    errors: FieldErrors<T>;
}

export interface InputConfirmPasswordProps extends AuthFieldProps<UserSignUpForm> {
    getValues: UseFormGetValues<UserSignUpForm>;
}

export interface PasswordStrengthMeterProps {
    value: string;
}

export interface PasswordRule {
    id: string;
    label: string;
    test: (value: string) => boolean;
}
