import { Link } from "react-router-dom";
import { whoami } from "../api/whoami";
import { useQuery } from "@apollo/client";
import { Button } from "./UI/Button";
import { LinksType } from "../../types";

export default function FooterNavbar({
    footerLinks,
}: {
    footerLinks: readonly LinksType[];
}) {
    const { data: whoamiData } = useQuery(whoami);
        const me = whoamiData?.whoami;

  return (
    <>
    <nav>
                    <ul className="flex items-center justify-center gap-10">
                        {footerLinks.map((link) => (
                            <li key={link.href}>
                                <FooterLink {...link}
                                {/* <Link
                                    to={li.link}
                                    className="text-card-foreground footerLinkAfter relative font-semibold"
                                >
                                    {li.content}
                                </Link> */}
                            </li>
                        ))}
                    </ul>
                </nav>
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
    </>
  )
}
