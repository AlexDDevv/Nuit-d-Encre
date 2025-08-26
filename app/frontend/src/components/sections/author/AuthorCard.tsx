import { buildAuthorAriaLabel, slugify } from "@/lib/utils";
import { AuthorCardProps } from "@/types/types";
import { SquareUserRound, Bookmark } from "lucide-react";
import { Link } from "react-router-dom";

export default function AuthorCard({ id, firstname, lastname, isIncomplete }: AuthorCardProps) {
    const path = `/authors/${id}-${slugify(firstname)}-${slugify(lastname)}`;
    const ariaLabel = buildAuthorAriaLabel(firstname, lastname);
    const isCurrent = path === window.location.pathname;

    return (
        <Link
            to={path}
            aria-current={isCurrent ? "page" : undefined}
            aria-label={ariaLabel}
            data-category="Auteur"
            className="flex items-center gap-5 py-5 px-10 rounded-lg border-2 border-border w-fit bg-card transition-all duration-200 ease-in-out hover:border-primary hover:scale-105 focus-visible:ring-ring focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 ring-offset-ring relative group overflow-hidden"
        >
            <SquareUserRound className="text-card-foreground h-10 w-10" />
            <h2 className="flex font-bold text-card-foreground text-3xl gap-2">
                <span>{firstname}</span>
                <span>{lastname}</span>
            </h2>
            <Bookmark className="text-border absolute right-5 -top-1 transition-colors duration-200 ease-in-out group-hover:text-primary" />
            {isIncomplete && (
                <div className="absolute -left-5 top-2.5 bg-secondary px-3 py-0.5 flex items-center justify-center -rotate-45 shadow-md">
                    <span className="text-secondary-foreground text-xs">Incomplet</span>
                </div>
            )}
        </Link>
    );
}
