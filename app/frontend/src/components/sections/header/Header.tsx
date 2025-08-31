import { useRef } from "react";
import { LinksType } from "@/types/types";
import NavAndAuthButtons from "@/components/sections/auth/NavAndAuthButtons";
import Logo from "@/components/UI/Logo";
import { useHeightVariable } from "@/hooks/useHeightVariable";

const HEADER_LINKS: readonly LinksType[] = [
    {
        href: "/books",
        label: "Livres",
        category: "Livres",
        ariaLabel: "Rechercher un livre",
    },
    {
        href: "/authors",
        label: "Auteurs",
        category: "Auteurs",
        ariaLabel: "Rechercher un auteur en particulier",
    },
    {
        href: "/library",
        label: "Bibliothèque",
        category: "Bibliothèque",
        ariaLabel: "Accéder à sa bibliothèque personnelle",
    },
] as const;

export default function Header() {
    const headerRef = useRef<HTMLElement>(null)
    useHeightVariable(headerRef, "--header-height")

    return (
        <header className="bg-card border-border flex items-center justify-between gap-5 rounded-xl border p-6" ref={headerRef}>
            <Logo />
            <NavAndAuthButtons links={HEADER_LINKS} />
        </header>
    );
}
