import { useQuery } from "@apollo/client";
import { whoami } from "../../api/whoami";
import { Button } from "../UI/Button";
import { LinksType } from "../../../types";
import Links from "../Links";

export default function FooterNavbar({
    links,
}: {
    links: readonly LinksType[];
}) {
    const { data: whoamiData } = useQuery(whoami);
    const me = whoamiData?.whoami;

    return (
        <nav className="flex flex-1 items-center justify-between gap-12">
            <ul className="flex flex-1 items-center justify-center gap-12">
                {links.map((link) => (
                    <li
                        key={link.href}
                        className="transition-transform hover:scale-110"
                    >
                        <Links {...link} />
                    </li>
                ))}
            </ul>
            {me ? (
                me.role === "admin" ? (
                    <Button
                        ariaLabel="Accéder au panel admin"
                        children="Admin"
                        to="/admin"
                    />
                ) : (
                    <Button
                        ariaLabel="Accéder à sa page profil utilisateur"
                        children="Profil"
                        to="/profil"
                    />
                )
            ) : me === null ? (
                <Button
                    ariaLabel="Se connecter à Nuit d'Encre"
                    children="Se connecter"
                    variant="secondary"
                    to="/signin"
                />
            ) : null}
        </nav>
    );
}
