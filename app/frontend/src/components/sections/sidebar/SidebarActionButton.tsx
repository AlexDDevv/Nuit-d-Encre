import { useLocation } from "react-router-dom";
import { FiPlus } from "react-icons/fi";
import Button from "@/components/UI/Button";
import { cn } from "@/lib/utils";

export default function SidebarActionButton({
    collapsed,
}: {
    collapsed: boolean;
}) {
    const { pathname } = useLocation();

    const isOnAuthorsPage = pathname.startsWith("/authors");

    const href = isOnAuthorsPage ? "/authors/scribe" : "/books/scribe";
    const label = isOnAuthorsPage
        ? "Enregistrer un auteur"
        : "Enregistrer un livre";

    return (
        <div className="border-border border-b p-4">
            <Button
                to={href}
                title={collapsed ? label : undefined}
                fullWidth
                leftIcon={<FiPlus />}
                className={cn(
                    collapsed && "rounded-md [&>span:first-child]:mr-0",
                )}
            >
                <span
                    className={cn(
                        "whitespace-nowrap transition-opacity",
                        collapsed
                            ? "opacity-0 duration-150"
                            : "opacity-100 delay-150 duration-200",
                    )}
                >
                    {label}
                </span>
            </Button>
        </div>
    );
}
