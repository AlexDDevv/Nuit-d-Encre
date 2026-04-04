import { useLocation } from "react-router-dom";
import { FiPlus } from "react-icons/fi";
import Button from "@/components/UI/Button";

export default function SidebarActionButton({
    collapsed,
}: { collapsed: boolean }) {
    const { pathname } = useLocation();

    const isOnAuthorsPage = pathname.startsWith("/authors");

    const href = isOnAuthorsPage ? "/authors/scribe" : "/books/scribe";
    const label = isOnAuthorsPage
        ? "Enregistrer un auteur"
        : "Enregistrer un livre";

    return (
        <div className="p-4 border-b border-border">
            <Button
                to={href}
                title={collapsed ? label : undefined}
                aria-label={label}
                children={collapsed ? <FiPlus /> : <span>{label}</span>}
                fullWidth
            />
        </div>
    );
}
