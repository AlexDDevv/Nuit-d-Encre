import { FormEventHandler, ReactNode } from "react";

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

export interface PasswordStrengthMeterProps {
    value: string;
}

export interface PasswordRule {
    id: string;
    label: string;
    test: (value: string) => boolean;
}
