import { Component, type ErrorInfo, type ReactNode } from "react";

type Props = { children: ReactNode };
type State = { hasError: boolean };

export class ErrorBoundary extends Component<Props, State> {
    state: State = { hasError: false };

    static getDerivedStateFromError(): State {
        return { hasError: true };
    }

    componentDidCatch(error: Error, info: ErrorInfo) {
        // Point d'accroche pour un logger/Sentry ultérieur (Phase 4).
        console.error("Erreur de rendu interceptée :", error, info);
    }

    handleReload = () => {
        this.setState({ hasError: false });
        window.location.reload();
    };

    render() {
        if (this.state.hasError) {
            return (
                <div className="flex min-h-screen flex-col items-center justify-center gap-4 px-6 text-center">
                    <img
                        src="/images/errors/undraw_fixing-bugs_13mt.svg"
                        alt=""
                        aria-hidden="true"
                        className="w-48 opacity-80"
                    />
                    <h1 className="font-display text-2xl text-foreground">
                        Une erreur inattendue est survenue
                    </h1>
                    <p className="font-body text-sm text-muted-foreground">
                        Quelque chose s'est mal passé de notre côté. Vous pouvez
                        recharger la page.
                    </p>
                    <button
                        type="button"
                        onClick={this.handleReload}
                        className="rounded-full border border-primary/40 px-4 py-2 font-body text-sm text-primary"
                    >
                        Recharger
                    </button>
                </div>
            );
        }
        return this.props.children;
    }
}
