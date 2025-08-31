import { buildBookAriaLabel, slugify } from "@/lib/utils";
import { BookCardProps } from "@/types/types";
import { Link } from "react-router-dom";

export default function BookCard({
    id,
    title,
    author,
    className,
    isInAuthorPage = false,
}: BookCardProps) {
    const bookPath = `/books/${id}-${slugify(title)}`;
    const ariaLabel = buildBookAriaLabel(title, author);
    const isCurrent = bookPath === window.location.pathname;
    const authorSlug = slugify(`${author.firstname} ${author.lastname}`);
    const authorPath = `/authors/${author.id}-${authorSlug}`;

    return (
        <Link
            to={bookPath}
            aria-current={isCurrent ? "page" : undefined}
            aria-label={ariaLabel}
            data-category="Livre"
            className={`border-border bg-card hover:border-primary focus-visible:ring-ring ring-offset-ring flex h-80 flex-col items-center justify-center gap-5 rounded-lg border-2 px-6 py-5 transition-all duration-200 ease-in-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 ${className}`}
        >
            <div className="w-32">
                <img
                    src="/images/bookCover.svg"
                    alt="Icône d'un livre"
                    role="img"
                />
            </div>
            <div className="flex flex-col items-center justify-center gap-2 text-center">
                <h2 className="text-card-foreground line-clamp-2 text-2xl font-medium">
                    {title}
                </h2>
                {!isInAuthorPage && (
                    <Link
                        to={authorPath}
                        className="text-card-foreground after:transition-width relative text-lg after:absolute after:-bottom-0.5 after:left-0 after:h-0.5 after:w-0 after:bg-current after:duration-200 after:ease-in-out hover:after:w-full"
                        title="Accéder à la page de l'auteur"
                    >
                        {author.firstname} {author.lastname}
                    </Link>
                )}
            </div>
        </Link>
    );
}
