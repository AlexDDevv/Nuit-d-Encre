import { useLocation, useNavigate } from "react-router-dom";
import ResearchForm from "./UI/ResearchForm";
import { useMutation, useQuery } from "@apollo/client";
import { signOut } from "../api/signout";
import { whoami } from "../api/whoami";
import { useToast } from "./UI/Toaster/ToasterHook";
import { Button } from "./UI/Button";
import { LinksType } from "../../types";
import { HeaderLink } from "./Header";

export default function HeaderNavbar({
    headerLinks,
}: {
    headerLinks: readonly LinksType[];
}) {
    const { data: whoamiData } = useQuery(whoami);
    const me = whoamiData?.whoami;
    const navigate = useNavigate();
    const location = useLocation();
    const { addToast } = useToast();

    const [doSignOut] = useMutation(signOut, { refetchQueries: [whoami] });

    const onSignOut = () => {
        doSignOut();
        navigate("/");
        addToast("Déconnexion réussie, à bientôt !", "success");
    };

    return (
        <nav className="flex flex-1 items-center gap-12">
            <div className="flex flex-1 items-center justify-center gap-12">
                <ul className="flex items-center justify-center gap-12">
                    {headerLinks.map((link) => (
                        <li
                            className="transition-transform hover:scale-110"
                            key={link.href}
                        >
                            <HeaderLink {...link} />
                        </li>
                    ))}
                </ul>
                <ResearchForm />
            </div>
            {me ? (
                me.role === "admin" ? (
                    location.pathname === "/admin" ? (
                        <Button
                            ariaLabel="Se déconnecter de Nuit d'Encre"
                            children="Se déconnecter"
                            onClick={onSignOut}
                        />
                    ) : (
                        <Button
                            ariaLabel="Accéder au panel admin"
                            children="Admin"
                            to="/admin"
                        />
                    )
                ) : location.pathname === "/profil" ? (
                    <Button
                        ariaLabel="Se déconnecter de Nuit d'Encre"
                        children="Se déconnecter"
                        onClick={onSignOut}
                    />
                ) : (
                    <Button
                        ariaLabel="Accéder à sa page profil utilisateur"
                        children="Profil"
                        to="/profil"
                    />
                )
            ) : me === null ? (
                <div className="flex items-center justify-center gap-5">
                    <Button
                        ariaLabel="S'inscrire à Nuit d'Encre"
                        children="S'inscrire"
                        to="/signup"
                    />
                    <Button
                        ariaLabel="Se connecter à Nuit d'Encre"
                        children="Se connecter"
                        variant="secondary"
                        to="/signin"
                    />
                </div>
            ) : null}
        </nav>
    );
}
