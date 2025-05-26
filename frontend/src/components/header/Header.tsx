import HeaderNavbar from "./HeaderNavbar";
import Logo from "../UI/Logo";
import { LinksType } from "../../../types";

const HEADER_LINKS: readonly LinksType[] = [
    {
        href: "/livres",
        label: "Livres",
        category: "Livres",
        ariaLabel: "Rechercher un livre",
    },
    {
        href: "/auteurs",
        label: "Auteurs",
        category: "Auteurs",
        ariaLabel: "Rechercher un auteur en particulier",
    },
    {
        href: "/bibliotheque",
        label: "Bibliothèque",
        category: "Bibliothèque",
        ariaLabel: "Accéder à sa bibliothèque personnelle",
    },
] as const;

export default function Header() {
    return (
        <header className="bg-card border-border flex items-center justify-between gap-5 rounded-xl border p-6">
            <Logo />
            <HeaderNavbar links={HEADER_LINKS} />
        </header>
    );
}
