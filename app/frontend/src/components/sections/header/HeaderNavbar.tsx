import { useLocation, useNavigate } from "react-router-dom";
import { useMutation, useQuery } from "@apollo/client";
import { LinksType } from "@/types/types";
import { LOGOUT, WHOAMI } from "@/graphql/auth";
import Links from "@/components/UI/Links";
import { Button } from "@/components/UI/Button";

export default function HeaderNavbar({
    links,
}: {
    links: readonly LinksType[];
}) {
    const { data: whoamiData } = useQuery(WHOAMI);
    const me = whoamiData?.whoami;
    const navigate = useNavigate();
    const location = useLocation();

    const [doSignOut] = useMutation(LOGOUT, { refetchQueries: [WHOAMI] });

    const onSignOut = () => {
        doSignOut();
        navigate("/");
    };

    return (
        <nav className="flex flex-1 items-center justify-between gap-12">
            <div className="flex flex-1 items-center justify-center gap-12">
                <ul className="flex items-center justify-center gap-12">
                    {links.map((link) => (
                        <li
                            className="transition-transform hover:scale-110"
                            key={link.href}
                        >
                            <Links {...link} />
                        </li>
                    ))}
                </ul>
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
