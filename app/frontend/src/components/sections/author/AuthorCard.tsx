import { buildAuthorAriaLabel, slugify } from "@/lib/utils";
import { AuthorCardProps } from "@/types/types";
import { SquareUserRound, Bookmark } from "lucide-react";
import { Link } from "react-router-dom";

export default function AuthorCard({
    id,
    firstname,
    lastname,
    isIncomplete,
}: AuthorCardProps) {
    const path = `/authors/${id}-${slugify(firstname)}-${slugify(lastname)}`;
    const ariaLabel = buildAuthorAriaLabel(firstname, lastname);
    const isCurrent = path === window.location.pathname;

    return (
        <Link
            to={path}
            aria-current={isCurrent ? "page" : undefined}
            aria-label={ariaLabel}
            data-category="Auteur"
            className="border-border bg-card hover:border-primary focus-visible:ring-ring ring-offset-ring group relative flex w-fit items-center gap-5 overflow-hidden rounded-xl border-2 px-10 py-5 transition-all duration-200 ease-in-out hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
        >
            <SquareUserRound className="text-card-foreground h-10 w-10" />
            <h2 className="text-card-foreground flex gap-2 text-3xl font-bold">
                <span>{firstname}</span>
                <span>{lastname}</span>
            </h2>
            <Bookmark className="text-border group-hover:text-primary absolute -top-1 right-5 transition-colors duration-200 ease-in-out" />
            {isIncomplete && (
                <div className="bg-secondary absolute -left-5 top-2.5 flex -rotate-45 items-center justify-center px-3 py-0.5 shadow-md">
                    <span className="text-secondary-foreground text-xs">
                        Incomplet
                    </span>
                </div>
            )}
        </Link>
    );
}
