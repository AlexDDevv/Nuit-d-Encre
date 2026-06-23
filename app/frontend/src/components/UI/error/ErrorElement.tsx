import {
    useRouteError,
    isRouteErrorResponse,
    useNavigate,
} from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { LuLibrary, LuKeyRound, LuArrowLeft } from "react-icons/lu";
import Button from "@/components/UI/Button/Button";
import ErrorScreen from "@/components/UI/error/ErrorScreen";
import { getErrorContent } from "@/components/UI/error/errorContent";
import { useAuthContext } from "@/hooks/auth/useAuthContext";
import type { ErrorTechDetails } from "@/types/types";

/** Extrait le code HTTP d'une erreur de route (Response ou ErrorResponse). */
function getStatus(error: unknown): number | undefined {
    if (error instanceof Response) return error.status;
    if (isRouteErrorResponse(error)) return error.status;
    return undefined;
}

/** Construit les détails techniques réels de l'erreur (mode développement). */
function buildTechDetails(error: unknown): ErrorTechDetails {
    if (error instanceof Response) {
        return {
            type: "Response",
            status: `${error.status} ${error.statusText}`.trim(),
        };
    }

    if (isRouteErrorResponse(error)) {
        const data = error.data;
        return {
            type: "ErrorResponse",
            status: `${error.status} ${error.statusText}`.trim(),
            message:
                data && typeof data === "object" && "message" in data
                    ? String((data as { message: unknown }).message)
                    : undefined,
            data: data != null ? JSON.stringify(data, null, 2) : undefined,
        };
    }

    if (error instanceof Error) {
        return {
            type: error.constructor?.name || "Error",
            message: error.message || undefined,
            stack: error.stack || undefined,
        };
    }

    return { type: "UnknownError", data: String(error) };
}

/** Boutons de récupération câblés au routeur (navigation react-router). */
function RecoveryActions({ code }: { code: string }) {
    const navigate = useNavigate();
    const { user } = useAuthContext();
    const isUnauthorized = code === "401";

    return (
        <>
            {isUnauthorized ? (
                <Button
                    to="/connexion"
                    variant="primary"
                    size="lg"
                    fullWidth
                    className="sm:w-auto"
                    leftIcon={<LuKeyRound size={17} strokeWidth={2} />}
                    ariaLabel="Se connecter"
                >
                    Se connecter
                </Button>
            ) : (
                <Button
                    to={user ? "/books" : "/"}
                    variant="primary"
                    size="lg"
                    fullWidth
                    className="sm:w-auto"
                    leftIcon={<LuLibrary size={17} strokeWidth={2} />}
                    ariaLabel="Retourner à la bibliothèque"
                >
                    Retourner à la bibliothèque
                </Button>
            )}
            <Button
                onClick={() => navigate(-1)}
                variant="outline"
                size="lg"
                fullWidth
                className="sm:w-auto"
                leftIcon={<LuArrowLeft size={17} strokeWidth={2} />}
                ariaLabel="Retourner à la page précédente"
            >
                Page précédente
            </Button>
        </>
    );
}

/** errorElement du routeur : page d'erreur plein écran selon le code HTTP. */
export default function ErrorElement() {
    const error = useRouteError();
    const content = getErrorContent(getStatus(error));
    const tech = import.meta.env.DEV ? buildTechDetails(error) : undefined;

    return (
        <>
            <Helmet>
                <title>
                    {content.code ? `${content.code} - ` : ""}
                    {content.label} · Nuit d'Encre
                </title>
            </Helmet>
            <ErrorScreen
                content={content}
                tech={tech}
                actions={<RecoveryActions code={content.code} />}
            />
        </>
    );
}
