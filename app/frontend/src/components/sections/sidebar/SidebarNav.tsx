import { Link, useLocation, useNavigate } from "react-router-dom";
import {
    LuBook,
    LuFeather,
    LuBookOpen,
    LuMail,
    LuInfo,
    LuCircle,
    LuFileText,
    LuUserPlus,
    LuLogIn,
    LuUser,
    LuLogOut,
    LuShield,
} from "react-icons/lu";
import { useAuthContext } from "@/hooks/auth/useAuthContext";
import { useToast } from "@/hooks/toast/useToast";
import { cn } from "@/lib/utils";
import { IconType } from "react-icons";

interface SidebarLink {
    href: string;
    label: string;
    icon: IconType;
    ariaLabel: string;
}

const MAIN_LINKS: SidebarLink[] = [
    {
        href: "/books",
        label: "Livres",
        icon: LuBook,
        ariaLabel: "Rechercher un livre",
    },
    {
        href: "/authors",
        label: "Auteurs",
        icon: LuFeather,
        ariaLabel: "Rechercher un auteur",
    },
    {
        href: "/library",
        label: "Bibliothèque",
        icon: LuBookOpen,
        ariaLabel: "Accéder à sa bibliothèque",
    },
];

const SECONDARY_LINKS: SidebarLink[] = [
    {
        href: "/contact",
        label: "Contact",
        icon: LuMail,
        ariaLabel: "Nous contacter",
    },
    {
        href: "/about",
        label: "À propos",
        icon: LuInfo,
        ariaLabel: "À propos de Nuit d'Encre",
    },
    {
        href: "/support",
        label: "Support",
        icon: LuCircle,
        ariaLabel: "Contacter le support",
    },
    {
        href: "/terms-of-use",
        label: "Mentions légales",
        icon: LuFileText,
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
        ? [
            {
                href: "/profil",
                label: "Profil",
                icon: LuUser,
                ariaLabel: "Accéder à son profil",
            },
            ...(user.role === "admin"
                ? [
                    {
                        href: "/admin",
                        label: "Admin",
                        icon: LuShield,
                        ariaLabel: "Accéder au panel admin",
                    },
                ]
                : []),
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
                <Link
                    to={link.href}
                    className={cn(
                        "flex items-center gap-3 rounded-md px-2 py-1.5 text-sm transition-colors duration-200",
                        active
                            ? "bg-accent text-foreground font-medium"
                            : "text-muted-foreground hover:bg-accent hover:text-foreground",
                    )}
                    aria-current={active ? "page" : undefined}
                    aria-label={link.ariaLabel}
                    title={collapsed ? link.label : undefined}
                >
                    <Icon className="h-5 w-5 shrink-0" />
                    {!collapsed && <span>{link.label}</span>}
                </Link>
            </li>
        );
    };

    return (
        <nav aria-label="Navigation principale" className="flex flex-1 flex-col gap-4">
            <ul className="flex flex-col gap-1">
                {MAIN_LINKS.map(renderLink)}
            </ul>

            <hr className="border-border" />

            <ul className="flex flex-col gap-1">
                {SECONDARY_LINKS.map(renderLink)}
            </ul>

            <hr className="border-border" />

            <ul className="flex flex-col gap-1">
                {authLinks.map(renderLink)}
                {user && (
                    <li>
                        <button
                            onClick={onSignOut}
                            className="text-muted-foreground hover:bg-accent hover:text-foreground flex w-full items-center gap-3 rounded-md px-2 py-1.5 text-sm transition-colors duration-200"
                            title={collapsed ? "Se déconnecter" : undefined}
                            aria-label="Se déconnecter de Nuit d'Encre"
                        >
                            <LuLogOut className="h-5 w-5 shrink-0" />
                            {!collapsed && <span>Se déconnecter</span>}
                        </button>
                    </li>
                )}
            </ul>
        </nav>
    );
}
