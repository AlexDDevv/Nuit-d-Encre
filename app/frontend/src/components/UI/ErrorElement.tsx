import {
    useRouteError,
    isRouteErrorResponse,
    useNavigate,
} from "react-router-dom";
import { useEffect, useRef } from "react";
import { ErrorLayoutProps } from "@/types/types";
import { Button } from "@/components/UI/Button";
import { useAuthContext } from "@/hooks/auth/useAuthContext";

/**
 * Error messages
 * @type {Object}
 */
const errorMessages = {
    400: {
        title: "Requête incorrecte",
        message: "La requête envoyée au serveur n'est pas valide.",
        image: "/images/errors/undraw_cancel_7zdh.svg",
    },
    401: {
        title: "Non autorisé",
        message: "Vous devez être connecté pour accéder à cette ressource.",
        image: "/images/errors/undraw_access-denied_krem.svg",
    },
    403: {
        title: "Accès refusé",
        message:
            "Vous n'avez pas les permissions nécessaires pour accéder à cette page.",
        image: "/images/errors/undraw_access-denied_krem.svg",
    },
    404: {
        title: "Page non trouvée",
        message: "La page que vous cherchez n'existe pas.",
        image: "/images/errors/undraw_page-not-found_6wni.svg",
    },
    500: {
        title: "Erreur serveur",
        message:
            "Une erreur est survenue sur nos serveurs. Nos équipes ont été notifiées.",
        image: "/images/errors/undraw_server-down_lxs9.svg",
    },
    default: {
        title: "Erreur inattendue",
        message:
            "Une erreur inattendue s'est produite. Veuillez réessayer plus tard.",
        image: "/images/errors/undraw_fixing-bugs_13mt.svg",
    },
};

/**
 * Interface for error with common properties
 */
interface ErrorWithDetails {
    constructor?: { name: string };
    message?: string;
    stack?: string;
    data?: Record<string, unknown>;
}

/**
 * Technical details component for development mode
 */
const TechnicalDetails = ({ error }: { error: unknown }) => {
    if (!import.meta.env.DEV) return null;

    const errorWithDetails = error as ErrorWithDetails;

    return (
        <details className="mb-5 text-left">
            <summary className="text-destructive mb-2 cursor-pointer font-semibold">
                Détails techniques (dev uniquement)
            </summary>
            <div className="bg-card text-card-foreground flex flex-col gap-2 rounded-lg p-3 text-xs">
                <div className="flex items-center gap-1">
                    <strong>Type:</strong>{" "}
                    {errorWithDetails?.constructor?.name || "Unknown"}
                </div>
                {errorWithDetails?.message && (
                    <div className="flex items-center gap-1">
                        <strong>Message:</strong> {errorWithDetails.message}
                    </div>
                )}
                {errorWithDetails?.stack && (
                    <div className="flex items-center gap-1">
                        <strong>Stack trace:</strong>
                        <pre className="whitespace-pre-wrap text-xs">
                            {errorWithDetails.stack}
                        </pre>
                    </div>
                )}
                {errorWithDetails?.data && (
                    <div className="flex items-center gap-1">
                        <strong>Data:</strong>
                        <pre className="whitespace-pre-wrap text-xs">
                            {JSON.stringify(errorWithDetails.data, null, 2)}
                        </pre>
                    </div>
                )}
            </div>
        </details>
    );
};

/**
 * Error element
 * @returns {JSX.Element}
 */
export default function ErrorElement() {
    const error = useRouteError();
    const errorRef = useRef<HTMLDivElement>(null);

    // Automatic focus for accessibility
    useEffect(() => {
        if (errorRef.current) {
            errorRef.current.focus();
        }
    }, []);

    const getErrorContent = (status?: number) => {
        return (
            errorMessages[status as keyof typeof errorMessages] ||
            errorMessages.default
        );
    };

    // Check if the error is a Response
    if (error instanceof Response) {
        const errorContent = getErrorContent(error.status);

        return (
            <ErrorLayout errorRef={errorRef}>
                <img
                    src={errorContent.image}
                    alt={`Illustration erreur ${error.status}`}
                    className="mx-auto h-64 w-64"
                    role="image"
                />
                <h1 className="text-destructive mb-2 text-4xl font-bold">
                    {error.status} - {errorContent.title}
                </h1>
                <p className="text-black-default">{errorContent.message}</p>
                <TechnicalDetails error={error} />
                <ButtonGroup />
            </ErrorLayout>
        );
    }

    // Standard route error handling
    if (isRouteErrorResponse(error)) {
        const errorContent = getErrorContent(error.status);

        return (
            <ErrorLayout errorRef={errorRef}>
                <img
                    src={errorContent.image}
                    alt={`Illustration erreur ${error.status}`}
                    className="mx-auto mb-5 h-3/4 w-3/4"
                />
                <h1 className="text-destructive mb-2 text-4xl font-bold">
                    {error.status} - {errorContent.title}
                </h1>
                <h2 className="text-destructive text-xl font-semibold">
                    {error.statusText}
                </h2>
                <p className="text-black-default mb-5">
                    {error.data?.message || errorContent.message}
                </p>
                <TechnicalDetails error={error} />
                <ButtonGroup />
            </ErrorLayout>
        );
    }

    // Generic error handling
    const errorContent = getErrorContent();

    return (
        <ErrorLayout errorRef={errorRef}>
            <img
                src={errorContent.image}
                alt="Illustration erreur générique"
                className="mx-auto mb-5 h-3/4 w-3/4"
                role="image"
            />
            <h1 className="text-destructive mb-2 text-4xl font-bold">
                {errorContent.title}
            </h1>
            <p className="text-black-default">{errorContent.message}</p>
            <TechnicalDetails error={error} />
            <ButtonGroup />
        </ErrorLayout>
    );
}

/**
 * Button group for the error element
 * @returns {JSX.Element}
 */
const ButtonGroup = () => {
    const navigate = useNavigate();
    const { user } = useAuthContext();

    return (
        <nav
            className="flex items-center justify-center gap-5"
            role="navigation"
            aria-label="Navigation de récupération"
        >
            <Button
                onClick={() => navigate(user ? "/books" : "/")}
                ariaLabel="Retourner à la page d'accueil"
                variant="primary"
            >
                Retourner à la page d'accueil
            </Button>
            <Button
                onClick={() => navigate(-1)}
                ariaLabel="Retourner à la page précédente"
                variant="primary"
            >
                Page précédente
            </Button>
        </nav>
    );
};

/**
 * Layout for the error element
 * @param {ErrorLayoutProps & { errorRef: React.RefObject<HTMLDivElement | null> }} param0 - Children and error ref
 * @returns {JSX.Element}
 */
const ErrorLayout = ({
    children,
    errorRef,
}: ErrorLayoutProps & { errorRef: React.RefObject<HTMLDivElement | null> }) => (
    <div className="fixed left-1/2 top-1/2 mx-auto flex w-fit -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-lg bg-white p-5">
        <div
            ref={errorRef}
            className="w-full max-w-xl text-center"
            role="alert"
            aria-live="polite"
        >
            {children}
        </div>
    </div>
);
