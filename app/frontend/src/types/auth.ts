/** Mode d'un écran d'authentification (pages sœurs connexion / inscription). */
export type AuthMode = "connexion" | "inscription";

export interface EditorialPanelProps {
    mode: AuthMode;
}

export interface ContinueWithProps {
    /** Libellé central du séparateur orné (par défaut « ou »). */
    label?: string;
}
