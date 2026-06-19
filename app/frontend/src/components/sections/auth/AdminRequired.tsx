/**
 * @fileoverview Écran « Accès refusé » — cartouche scellé affiché lorsqu'un
 * membre sans rôle administrateur tente d'ouvrir le panneau d'administration.
 * @module AdminRequired
 */

import { Link } from "react-router-dom";
import Icon from "@/components/UI/Icon/Icon";
import SealedAccessCard, {
    AuthButton,
} from "@/components/sections/auth/SealedAccessCard";

/**
 * AdminRequired — cartouche centré façon sceau de bibliothèque indiquant qu'un
 * rôle administrateur est requis, avec retour vers les espaces accessibles.
 */
export default function AdminRequired() {
    return (
        <SealedAccessCard
            eyebrow="Accès restreint"
            title="Accès refusé"
            titleId="admin-denied-title"
            description="Vous ne disposez pas des droits administrateur pour accéder à cette page."
        >
            <nav className="mt-7 flex flex-col gap-3">
                <AuthButton
                    kind="primary"
                    to="/"
                    ariaLabel="Retourner à la page d'accueil"
                >
                    <Icon name="arrowLeft" size={17} /> Retour à l'accueil
                </AuthButton>
            </nav>

            <div className="mt-5">
                <Link
                    to="/library"
                    className="hover:text-foreground text-[hsl(20 12% 68%)] focus-visible:ring-primary font-body inline-flex items-center gap-1.5 rounded-sm text-xs underline decoration-dotted underline-offset-4 transition-colors focus-visible:outline-none focus-visible:ring-2"
                >
                    <Icon name="arrowRight" size={12} /> Consulter ma
                    bibliothèque
                </Link>
            </div>
        </SealedAccessCard>
    );
}
