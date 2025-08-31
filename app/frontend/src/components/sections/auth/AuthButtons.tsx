import { Button } from "@/components/UI/Button";
import { useAuthContext } from "@/hooks/useAuthContext";
import { useToast } from "@/hooks/useToast";
import { useNavigate } from "react-router-dom";

export default function AuthButtons({ pathname }: { pathname: string }) {
    const navigate = useNavigate();
    const { showToast } = useToast();
    const { user, logout } = useAuthContext();

    const onSignOut = () => {
        logout();
        navigate("/books");
        showToast({
            type: "success",
            title: "Déconnexion réussie !",
            description: "À bientôt sur Nuit d'Encre !",
        });
    };

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
    const isOnAuthorsPage = pathname.startsWith("/authors");

    const commonButtons = (
        <Button
            ariaLabel="Enregistrer un livre"
            children="Enregistrer un livre"
            variant="primary"
            to="/books/scribe"
        />
    );

    const authorButton = (
        <Button
            ariaLabel="Enregistrer un auteur"
            children="Enregistrer un auteur"
            variant="primary"
            to="/authors/scribe"
        />
    );

    const logoutButton = (
        <Button
            ariaLabel="Se déconnecter de Nuit d'Encre"
            children="Se déconnecter"
            variant="destructive"
            onClick={onSignOut}
        />
    );

    if (isAdmin) {
        return (
            <div className="flex items-center justify-center gap-5">
                {isOnAuthorsPage ? authorButton : commonButtons}
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
            {isOnAuthorsPage ? authorButton : commonButtons}
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
