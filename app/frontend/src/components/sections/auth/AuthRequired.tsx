/**
 * @fileoverview Authentication required component that displays when a user needs to be authenticated
 * @module AuthRequired
 */

import { Button } from "@/components/UI/Button";
import { Link } from "react-router-dom";
import { Lock } from "lucide-react";

/**
 * AuthRequired Component
 *
 * Displays a message when authentication is required to access a page.
 * Provides buttons for login and registration, and a link to return to the home page.
 *
 * @component
 * @returns {JSX.Element} The rendered AuthRequired component
 */
export default function AuthRequired() {
    return (
        <div className="mx-auto flex max-w-md items-center justify-center">
            <div className="bg-card border-border flex w-full flex-col gap-6 rounded-xl border p-8 text-center">
                <div className="flex justify-center">
                    <Lock className="text-card-foreground h-12 w-12" />
                </div>
                <div className="flex flex-col gap-2">
                    <h1 className="text-card-foreground text-2xl font-bold">
                        Authentification requise
                    </h1>
                    <p className="text-card-foreground">
                        Vous devez être connecté pour accéder à cette page.
                        Veuillez vous connecter ou créer un compte pour
                        continuer.
                    </p>
                </div>
                <nav className="flex flex-col gap-4">
                    <Button
                        to="/register"
                        variant="primary"
                        fullWidth
                        ariaLabel="S'inscrire"
                    >
                        S'inscrire
                    </Button>
                    <Button
                        to="/connexion"
                        variant="secondary"
                        fullWidth
                        ariaLabel="Se connecter"
                    >
                        Se connecter
                    </Button>
                    <Link
                        to="/"
                        className="text-card-foreground hover:underline"
                    >
                        Retour à l'accueil
                    </Link>
                </nav>
            </div>
        </div>
    );
}
