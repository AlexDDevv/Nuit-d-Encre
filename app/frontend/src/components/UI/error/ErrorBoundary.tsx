import { Component, type ErrorInfo, type ReactNode } from "react";
import { LuRotateCw, LuLibrary } from "react-icons/lu";
import Button from "@/components/UI/Button/Button";
import ErrorScreen from "@/components/UI/error/ErrorScreen";
import { getErrorContent } from "@/components/UI/error/errorContent";
import type { ErrorTechDetails } from "@/types/types";

type Props = { children: ReactNode };
type State = { hasError: boolean; error: Error | null };

/**
 * ErrorBoundary de rendu - englobe l'application au-dessus du routeur. En cas
 * d'exception de rendu, affiche la page d'erreur « inattendue » partagée. Sans
 * contexte routeur ici : les actions s'appuient sur `window.location`.
 */
export class ErrorBoundary extends Component<Props, State> {
    state: State = { hasError: false, error: null };

    static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error };
    }

    componentDidCatch(error: Error, info: ErrorInfo) {
        // Point d'accroche pour un logger/Sentry ultérieur.
        console.error("Erreur de rendu interceptée :", error, info);
    }

    render() {
        if (!this.state.hasError) return this.props.children;

        const content = getErrorContent();
        const error = this.state.error;
        const tech: ErrorTechDetails | undefined =
            import.meta.env.DEV && error
                ? {
                      type: error.constructor?.name || "Error",
                      message: error.message || undefined,
                      stack: error.stack || undefined,
                  }
                : undefined;

        return (
            <ErrorScreen
                content={content}
                tech={tech}
                actions={
                    <>
                        <Button
                            onClick={() => window.location.reload()}
                            variant="primary"
                            size="lg"
                            fullWidth
                            className="sm:w-auto"
                            leftIcon={<LuRotateCw size={17} strokeWidth={2} />}
                            ariaLabel="Recharger la page"
                        >
                            Recharger la page
                        </Button>
                        <Button
                            onClick={() => window.location.assign("/")}
                            variant="outline"
                            size="lg"
                            fullWidth
                            className="sm:w-auto"
                            leftIcon={<LuLibrary size={17} strokeWidth={2} />}
                            ariaLabel="Retourner à la bibliothèque"
                        >
                            Retourner à la bibliothèque
                        </Button>
                    </>
                }
            />
        );
    }
}
