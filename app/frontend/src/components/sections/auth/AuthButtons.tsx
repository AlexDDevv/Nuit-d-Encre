import { Button } from "@/components/UI/Button";
import { AuthButtonsProps } from "@/types/types";

export default function AuthButtons({
    user,
    pathname,
    logout,
}: AuthButtonsProps) {
    if (!user) {
        return (
            <div className="flex items-center justify-center gap-5">
                <Button
                    ariaLabel="S'inscrire à Nuit d'Encre"
                    children="S'inscrire"
                    variant="primary"
                    to="/register"
                />
                <Button
                    ariaLabel="Se connecter à Nuit d'Encre"
                    children="Se connecter"
                    variant="secondary"
                    to="/connexion"
                />
            </div>
        );
    }

    const isAdmin = user.role === "admin";
    const isOnAdminPage = pathname === "/admin";
    const isOnProfilePage = pathname === "/profil";

    const commonButtons = (
        <Button
            ariaLabel="Enregistrer un livre"
            children="Enregistrer un livre"
            variant="primary"
            to="/books/scribe"
        />
    );

    const logoutButton = (
        <Button
            ariaLabel="Se déconnecter de Nuit d'Encre"
            children="Se déconnecter"
            variant="destructive"
            onClick={logout}
        />
    );

    if (isAdmin) {
        return (
            <div className="flex items-center justify-center gap-5">
                {commonButtons}
                {isOnAdminPage ? (
                    logoutButton
                ) : (
                    <Button
                        ariaLabel="Accéder au panel admin"
                        children="Admin"
                        variant="secondary"
                        to="/admin"
                    />
                )}
            </div>
        );
    }

    return (
        <div className="flex items-center justify-center gap-5">
            {commonButtons}
            {isOnProfilePage ? (
                logoutButton
            ) : (
                <Button
                    ariaLabel="Accéder à sa page profil utilisateur"
                    children="Profil"
                    variant="secondary"
                    to="/profil"
                />
            )}
        </div>
    );
}
