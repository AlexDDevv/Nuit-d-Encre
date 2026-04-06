import Button from "@/components/UI/Button/Button";
import { buildBookAriaLabel, slugify } from "@/lib/utils";
import { BookCardProps } from "@/types/types";
import { useNavigate } from "react-router-dom";

export default function BookCard({
    id,
    title,
    author,
    isImported,
    className,
    isInAuthorPage = false,
}: BookCardProps) {
    const bookPath = `/books/${id}-${slugify(title)}`;
    const ariaLabel = buildBookAriaLabel(title, author);
    const isCurrent = bookPath === window.location.pathname;
    const authorSlug = slugify(`${author.firstname} ${author.lastname}`);
    const authorPath = `/authors/${author.id}-${authorSlug}`;
    const navigate = useNavigate();

    const handleAuthorClick = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        navigate(authorPath);
    };

    const handleAuthorKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            e.stopPropagation();
            navigate(authorPath);
        }
    };

    return (
        <Button
            variant="bookCard"
            size="bookCard"
            to={bookPath}
            aria-current={isCurrent ? "page" : undefined}
            ariaLabel={ariaLabel}
            category="Livre"
            className={className}
        >
            {isImported && (
                <div className="bg-secondary absolute -left-5 top-2.5 flex -rotate-45 items-center justify-center px-3 py-0.5 shadow-md">
                    <span className="text-secondary-foreground text-xs">
                        Incomplet
                    </span>
                </div>
            )}
            <div className="w-32">
                <img
                    src="/images/bookCover.svg"
                    alt="Icône d'un livre"
                    role="img"
                />
            </div>
            <div className="flex flex-col items-center justify-center gap-2 text-center">
                <h2
                    className="text-card-foreground line-clamp-2 text-2xl font-medium"
                    title={title}
                >
                    {title}
                </h2>
                {!isInAuthorPage && (
                    <span
                        onClick={handleAuthorClick}
                        onKeyDown={handleAuthorKeyDown}
                        tabIndex={0}
                        role="link"
                        aria-label={`Accéder à la page de ${author.firstname} ${author.lastname}`}
                        className="text-card-foreground after:transition-width focus-visible:ring-ring ring-offset-ring relative cursor-pointer rounded-lg text-lg transition-all duration-200 ease-in-out after:absolute after:-bottom-0.5 after:left-0 after:h-0.5 after:w-0 after:bg-current after:duration-200 after:ease-in-out hover:after:w-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
                    >
                        {author.firstname} {author.lastname}
                    </span>
                )}
            </div>
        </Button>
    );
}
