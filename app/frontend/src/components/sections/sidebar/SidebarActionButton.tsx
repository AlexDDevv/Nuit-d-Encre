import { Link, useLocation } from "react-router-dom";
import { LuCircle } from "react-icons/lu";
import { useAuthContext } from "@/hooks/auth/useAuthContext";

interface SidebarActionButtonProps {
    collapsed: boolean;
}

export default function SidebarActionButton({
    collapsed,
}: SidebarActionButtonProps) {
    const { user } = useAuthContext();
    const { pathname } = useLocation();

    if (!user) return null;

    const isOnAuthorsPage = pathname.startsWith("/authors");

    const href = isOnAuthorsPage ? "/authors/scribe" : "/books/scribe";
    const label = isOnAuthorsPage
        ? "Enregistrer un auteur"
        : "Enregistrer un livre";

    return (
        <Link
            to={href}
            className="bg-primary text-primary-foreground hover:bg-primary/90 flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors duration-200"
            title={collapsed ? label : undefined}
            aria-label={label}
        >
            <LuCircle className="h-5 w-5 shrink-0" />
            {!collapsed && <span>{label}</span>}
        </Link>
    );
}
