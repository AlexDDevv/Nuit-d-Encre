import { Link } from "react-router-dom";
import { LuChevronsLeft, LuChevronsRight } from "react-icons/lu";
import { useAuthContext } from "@/hooks/auth/useAuthContext";
import logo from "/logo/logo.svg";

interface SidebarHeaderProps {
    collapsed: boolean;
    onToggle: () => void;
}

export default function SidebarHeader({
    collapsed,
    onToggle,
}: SidebarHeaderProps) {
    const { user } = useAuthContext();

    return (
        <div className="flex items-center justify-between gap-3">
            <Link
                to={user ? "/books" : "/"}
                className="flex items-center gap-3 overflow-hidden"
                aria-label="Accueil Nuit d'Encre"
            >
                <img
                    src={logo}
                    alt="Logo de Nuit d'Encre"
                    className="h-10 w-10 shrink-0"
                />
                {!collapsed && (
                    <span className="font-title text-foreground truncate text-lg font-semibold">
                        Nuit d'Encre
                    </span>
                )}
            </Link>
            <button
                onClick={onToggle}
                aria-label={
                    collapsed
                        ? "Étendre la navigation"
                        : "Réduire la navigation"
                }
                aria-expanded={!collapsed}
                className="text-muted-foreground hover:text-foreground shrink-0 rounded-md p-1.5 transition-colors duration-200"
            >
                {collapsed ? (
                    <LuChevronsRight className="h-5 w-5" />
                ) : (
                    <LuChevronsLeft className="h-5 w-5" />
                )}
            </button>
        </div>
    );
}
