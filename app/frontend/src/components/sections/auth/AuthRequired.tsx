/**
 * @fileoverview Écran « Authentification requise » - cartouche scellé affiché
 * lorsqu'un visiteur tente d'ouvrir une page réservée aux membres.
 * @module AuthRequired
 */

import { Link, useLocation } from "react-router-dom";
import Icon from "@/components/UI/Icon/Icon";
import SealedAccessCard, {
    AuthButton,
} from "@/components/sections/auth/SealedAccessCard";

/**
 * AuthRequired - cartouche centré façon sceau de bibliothèque, avec actions de
 * connexion / inscription préservant la redirection vers la page demandée.
 */
export default function AuthRequired() {
    const location = useLocation();
    const redirect = location.pathname;
    const redirectParam = encodeURIComponent(redirect);

    return (
        <SealedAccessCard
            eyebrow="Accès scellé"
            title="Authentification requise"
            titleId="auth-title"
            description="Vous devez être connecté pour accéder à cette page. Connectez-vous ou créez un compte pour continuer."
        >
            <nav className="mt-7 flex flex-col gap-3">
                <AuthButton
                    kind="primary"
                    to={`/register?redirect=${redirectParam}`}
                    ariaLabel="S'inscrire"
                >
                    <Icon name="userPlus" size={17} /> S'inscrire
                </AuthButton>
                <AuthButton
                    kind="secondary"
                    to={`/connexion?redirect=${redirectParam}`}
                    ariaLabel="Se connecter"
                >
                    <Icon name="login" size={17} /> Se connecter
                </AuthButton>
            </nav>

            <p
                className="mt-5 inline-flex max-w-full items-center gap-1.5 font-mono text-xxs"
                style={{ color: "hsl(20 12% 56%)" }}
            >
                <Icon
                    name="arrowRight"
                    size={11}
                    style={{ color: "hsl(43 30% 60%)" }}
                />
                <span className="truncate">
                    après connexion, retour à&nbsp;
                    <span style={{ color: "hsl(43 30% 72%)" }}>{redirect}</span>
                </span>
            </p>

            <div className="mt-5">
                <Link
                    to="/"
                    className="hover:text-foreground focus-visible:ring-primary font-body inline-flex items-center gap-1.5 rounded text-xs underline decoration-dotted underline-offset-4 transition-colors focus-visible:outline-none focus-visible:ring-2"
                    style={{ color: "hsl(20 12% 68%)" }}
                >
                    <Icon name="arrowLeft" size={12} /> Retour à l'accueil
                </Link>
            </div>
        </SealedAccessCard>
    );
}
