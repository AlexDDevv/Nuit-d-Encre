import { memo } from "react";
import { useNavigate } from "react-router-dom";
import { activateOnKey, buildBookAriaLabel, cn, slugify } from "@/lib/utils";
import { formatShortLabelMap } from "@/lib/filterMaps";
import { interactiveCardShell } from "@/components/UI/cardShell";
import IncompleteChip from "@/components/UI/IncompleteChip";
import { BookCardProps } from "@/types/types";
import BookCover from "../BookCover";
import LibraryMark from "./LibraryMark";
import BookCardMeta from "./BookCardMeta";
import BookCardRating from "./BookCardRating";

/**
 * Carte livre du catalogue - variante « survol immersif ».
 * La couverture occupe tout le cadre (ratio 2:3) ; titre et auteur sont en
 * superposition, métadonnées et note se révélant au survol/focus. La carte mène
 * à la fiche du livre, le nom de l'auteur à la fiche auteur.
 */
function BookCard({
    book,
    className,
    isInAuthorPage = false,
}: BookCardProps) {
    const navigate = useNavigate();
    const author = `${book.author.firstname} ${book.author.lastname}`;
    const bookPath = `/books/${book.id}-${slugify(book.title)}`;
    const authorPath = `/authors/${book.author.id}-${slugify(author)}`;
    const ariaLabel = buildBookAriaLabel(book.title, book.author);
    const isCurrent = bookPath === window.location.pathname;
    const formatLabel = book.format
        ? formatShortLabelMap[book.format]
        : undefined;

    const openBook = () => navigate(bookPath);
    const openAuthor = () => navigate(authorPath);

    const handleAuthorClick = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        openAuthor();
    };

    return (
        <div
            role="link"
            tabIndex={0}
            aria-label={ariaLabel}
            aria-current={isCurrent ? "page" : undefined}
            data-category="Livre"
            onClick={openBook}
            onKeyDown={activateOnKey(openBook)}
            className={cn(interactiveCardShell, "aspect-2/3", className)}
        >
            {/* couverture plein cadre */}
            <BookCover
                coverUrl={book.coverUrl}
                title={book.title}
                author={author}
                className="bg-background absolute inset-0"
                imgClassName="transition-transform duration-500 group-hover:scale-105"
            />

            {/* voile dégradé pour la lisibilité du texte */}
            <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_top,hsl(20_3%_7%/0.96)_0%,hsl(20_3%_7%/0.78)_26%,hsl(20_3%_7%/0.18)_52%,transparent_72%)]" />

            {book.isImported && (
                <div className="absolute left-2 top-2 z-10">
                    <IncompleteChip />
                </div>
            )}
            {book.isInLibrary && (
                <div className="absolute right-2 top-2 z-10">
                    <LibraryMark />
                </div>
            )}

            {/* contenu en bas */}
            <div className="absolute inset-x-0 bottom-0 flex flex-col gap-1 p-3.5">
                <h2
                    className="text-foreground font-title line-clamp-2 font-medium leading-snug [text-shadow:0_1px_8px_hsl(20_3%_5%/0.8)]"
                    title={book.title}
                >
                    {book.title}
                </h2>

                {!isInAuthorPage && (
                    <span
                        role="link"
                        tabIndex={0}
                        onClick={handleAuthorClick}
                        onKeyDown={activateOnKey(openAuthor, true)}
                        aria-label={`Voir l'auteur ${author}`}
                        className="text-foreground/70 hover:text-primary focus-visible:ring-ring font-body -mx-1 w-fit cursor-pointer self-start rounded-sm px-1 text-xs transition-colors focus-visible:outline-none focus-visible:ring-2"
                    >
                        {author}
                    </span>
                )}

                {/* méta + note révélées au survol / focus */}
                <div className="grid grid-rows-[0fr] opacity-0 transition-all duration-300 group-hover:grid-rows-[1fr] group-hover:opacity-100 group-focus-within:grid-rows-[1fr] group-focus-within:opacity-100">
                    <div className="overflow-hidden">
                        <div className="flex flex-col gap-1.5 pt-1.5">
                            <BookCardMeta
                                category={book.category?.name}
                                year={book.publishedYear}
                                format={formatLabel}
                            />
                            <BookCardRating
                                averageRating={book.averageRating}
                                reviewCount={book.reviewCount}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default memo(BookCard);
