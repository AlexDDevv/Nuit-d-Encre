import { Button } from "@/components/UI/Button";
import Links from "@/components/UI/Links";
import { WHOAMI } from "@/graphql/auth";
import { LinksType } from "@/types/types";
import { useQuery } from "@apollo/client";

export default function FooterNavbar({
    links,
}: {
    links: readonly LinksType[];
}) {
    const { data: whoamiData } = useQuery(WHOAMI);
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
