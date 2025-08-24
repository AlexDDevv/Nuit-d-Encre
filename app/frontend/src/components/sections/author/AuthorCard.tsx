import { buildAuthorAriaLabel, slugify } from "@/lib/utils";
import { AuthorCardProps } from "@/types/types";
import { Link } from "react-router-dom";

export default function AuthorCard({ id, firstname, lastname }: AuthorCardProps) {
    const path = `/books/${id}-${slugify(firstname)}-${slugify(lastname)}`;
    const ariaLabel = buildAuthorAriaLabel(firstname, lastname);
    const isCurrent = path === window.location.pathname;

    return (
        <Link
            to={path}
            aria-current={isCurrent ? "page" : undefined}
            aria-label={ariaLabel}
            data-category="Auteur"
            className="flex flex-col items-center justify-center gap-5 p-5 rounded-lg border-2 border-border w-3xs bg-card transition-all duration-200 ease-in-out hover:border-primary hover:scale-105 focus-visible:ring-ring focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 ring-offset-ring"
        >
            <div>
                <img src="/images/book.svg" alt="Icône d'un livre" role="img" />
            </div>
            <div className="flex flex-col items-center justify-center gap-2">
                <h2 className="font-bold text-card-foreground text-3xl">
                    <span>{firstname}</span>
                    <span>{lastname}</span>
                </h2>
            </div>
        </Link>
    );
}
