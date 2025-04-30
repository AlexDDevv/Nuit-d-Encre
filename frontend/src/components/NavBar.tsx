import { Link, useLocation, useNavigate } from "react-router-dom";
import data from "../data/data.json";
import ResearchForm from "./UI/ResearchForm";
import ActionButton from "./UI/ActionButton";
import { useMutation, useQuery } from "@apollo/client";
import { signOut } from "../api/signout";
import { whoami } from "../api/whoami";
import { useToast } from "./UI/Toaster/ToasterHook";
import { Button } from "./UI/Button";

export default function NavBar() {
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
                    {data.navLink.map((link, i) => (
                        <li
                            className="transition-transform hover:scale-110"
                            key={i}
                        >
                            <Link
                                to={link.link}
                                className="font-body text-card-foreground text-lg font-medium"
                            >
                                {link.content}
                            </Link>
                        </li>
                    ))}
                </ul>
                <ResearchForm />
            </div>
            {me ? (
                me.role === "admin" ? (
                    location.pathname === "/admin" ? (
                        <ActionButton
                            bgColor="bg-destructive"
                            color="text-destructive-foreground"
                            content="Se déconnecter"
                            onClick={onSignOut}
                        />
                    ) : (
                        <ActionButton
                            bgColor="bg-secondary"
                            color="text-secondary-foreground"
                            path="/admin"
                            content="Admin"
                        />
                    )
                ) : location.pathname === "/profil" ? (
                    <ActionButton
                        bgColor="bg-destructive"
                        color="text-destructive-foreground"
                        content="Se déconnecter"
                        onClick={onSignOut}
                    />
                ) : (
                    <ActionButton
                        bgColor="bg-secondary"
                        color="text-secondary-foreground"
                        path="/profil"
                        content="Profil"
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
