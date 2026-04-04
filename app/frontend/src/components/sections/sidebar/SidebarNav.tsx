import { useLocation, useNavigate } from "react-router-dom";
import Button from "@/components/UI/Button";
import {
    LuBookOpenText,
    LuLibraryBig,
    LuMessageCircleQuestion,
    LuUserPlus,
    LuLogIn,
    LuUser,
    LuLogOut,
    LuShield,
} from "react-icons/lu";
import { FaFeatherPointed } from "react-icons/fa6";
import { LiaBalanceScaleSolid } from "react-icons/lia";
import { useAuthContext } from "@/hooks/auth/useAuthContext";
import { useToast } from "@/hooks/toast/useToast";
import { SidebarLink } from "@/types/types";

const MAIN_LINKS: SidebarLink[] = [
    {
        href: "/books",
        label: "Livres",
        icon: LuBookOpenText,
        ariaLabel: "Rechercher un livre",
    },
    {
        href: "/authors",
        label: "Auteurs",
        icon: FaFeatherPointed,
        ariaLabel: "Rechercher un auteur",
    },
    {
        href: "/library",
        label: "Bibliothèque",
        icon: LuLibraryBig,
        ariaLabel: "Accéder à sa bibliothèque",
    },
    {
        href: "/about",
        label: "À propos",
        icon: LuMessageCircleQuestion,
        ariaLabel: "À propos de Nuit d'Encre",
    },
    {
        href: "/terms-of-use",
        label: "Mentions légales",
        icon: LiaBalanceScaleSolid,
        ariaLabel: "Mentions légales de Nuit d'Encre",
    },
];

interface SidebarNavProps {
    collapsed: boolean;
}

export default function SidebarNav({ collapsed }: SidebarNavProps) {
    const { user, logout } = useAuthContext();
    const { pathname } = useLocation();
    const navigate = useNavigate();
    const { showToast } = useToast();

    const isActive = (href: string) =>
        pathname === href || pathname.startsWith(href + "/");

    const onSignOut = () => {
        logout();
        navigate("/books");
        showToast({
            type: "success",
            title: "Déconnexion réussie !",
            description: "À bientôt sur Nuit d'Encre !",
        });
    };

    const authLinks: SidebarLink[] = user
        ? user.role === "admin"
            ? [
                {
                    href: "/admin",
                    label: "Admin",
                    icon: LuShield,
                    ariaLabel: "Accéder au panel admin",
                },
            ]
            : [
                {
                    href: "/profil",
                    label: "Profil",
                    icon: LuUser,
                    ariaLabel: "Accéder à son profil",
                },
            ]
        : [
            {
                href: `/register?redirect=${encodeURIComponent(pathname)}`,
                label: "S'inscrire",
                icon: LuUserPlus,
                ariaLabel: "S'inscrire à Nuit d'Encre",
            },
            {
                href: `/connexion?redirect=${encodeURIComponent(pathname)}`,
                label: "Se connecter",
                icon: LuLogIn,
                ariaLabel: "Se connecter à Nuit d'Encre",
            },
        ];

    const renderLink = (link: SidebarLink) => {
        const Icon = link.icon;
        const active = isActive(link.href);

        return (
            <li key={link.href}>
                <Button
                    variant="nav"
                    to={link.href}
                    fullWidth
                    isNavBtnSelected={active}
                    ariaLabel={link.ariaLabel}
                    title={collapsed ? link.label : undefined}
                    aria-current={active ? "page" : undefined}
                    leftIcon={<Icon className="shrink-0" />}
                    children={!collapsed && link.label}
                />
            </li>
        );
    };

    return (
        <nav aria-label="Navigation principale" className="flex flex-1 flex-col gap-1 p-4">
            <ul className="flex flex-col gap-1">
                {MAIN_LINKS.map(renderLink)}
            </ul>
            <ul className="flex flex-col gap-1">
                {authLinks.map(renderLink)}
                {user && (
                    <li>
                        <Button
                            variant="nav"
                            fullWidth
                            onClick={onSignOut}
                            ariaLabel="Se déconnecter de Nuit d'Encre"
                            title={collapsed ? "Se déconnecter" : undefined}
                            leftIcon={<LuLogOut className="shrink-0" />}
                            children={!collapsed && "Se déconnecter"}
                        />
                    </li>
                )}
            </ul>
        </nav>
    );
}
