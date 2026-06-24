import { useState } from "react";
import { Link } from "react-router-dom";
import { FaStar, FaTrashCan } from "react-icons/fa6";
import BookCover from "@/components/sections/book/BookCover";
import BookCardRating from "@/components/sections/book/BookCard/BookCardRating";
import SelectBookStatus from "@/components/sections/book/SelectBookStatus";
import FavoriteBookModal from "@/components/sections/library/FavoriteBookModal";
import ConfirmRemoveOverlay from "@/components/sections/library/UI/ConfirmRemoveOverlay";
import { cn, slugify } from "@/lib/utils";
import { BookCardLibraryProps } from "@/types/types";
import Button from "@/components/UI/Button";

/**
 * Ligne de la vue Liste de la bibliothèque : dense et scannable - petite
 * couverture, titre/auteur, catégorie, note, sélecteur de statut coloré et
 * actions (favori + retrait avec confirmation).
 */
export default function LibraryListRow({
    id,
    book,
    status,
    isFavorite = false,
    favoriteRank = null,
    onStatusChange,
    isUpdatingUserBook,
    handleDeleteUserBook,
    isDeletingUserBook,
}: BookCardLibraryProps) {
    const [confirming, setConfirming] = useState(false);
    const [favOpen, setFavOpen] = useState(false);

    const author = `${book.author.firstname} ${book.author.lastname}`;
    const bookPath = `/books/${book.id}-${slugify(book.title)}`;
    const authorPath = `/authors/${book.author.id}-${slugify(author)}`;

    return (
        <div
            className={cn(
                "bg-card group relative flex items-center gap-3.5 overflow-hidden rounded-xl border-2 px-3 py-3 transition-colors duration-200 sm:gap-4 sm:px-4",
                isFavorite
                    ? "border-primary/38 hover:border-primary/55"
                    : "border-border hover:border-primary/45",
            )}
        >
            {/* couverture */}
            <Link
                to={bookPath}
                aria-label={`Voir ${book.title}`}
                className="bg-background h-16.5 sm:h-19.5 sm:w-13 relative w-11 shrink-0 overflow-hidden rounded-md"
            >
                <BookCover
                    coverUrl={book.coverUrl}
                    title={book.title}
                    author={author}
                    compact
                    className="absolute inset-0"
                />
                {isFavorite && (
                    <span
                        className="bg-primary text-primary-foreground py-0.75 text-xxs absolute -right-1 -top-1 inline-flex items-center gap-0.5 rounded-full px-1.5 font-mono font-medium shadow-sm"
                        title={`Favori · rang ${favoriteRank}`}
                    >
                        <FaStar size={9} aria-hidden="true" /> {favoriteRank}
                    </span>
                )}
            </Link>

            {/* titre + auteur */}
            <div className="min-w-0 flex-1">
                <Link
                    to={bookPath}
                    className="text-foreground hover:text-primary font-title block truncate text-sm font-medium transition-colors"
                    title={book.title}
                >
                    {book.title}
                </Link>
                <Link
                    to={authorPath}
                    className="text-muted-foreground hover:text-primary font-body -mx-1 block max-w-full truncate rounded-sm px-1 text-xs transition-colors"
                    aria-label={`Voir l'auteur ${author}`}
                >
                    {author}
                </Link>
                <p className="text-muted-foreground font-body mt-0.5 text-xs sm:hidden">
                    <span className="font-quote italic text-[hsl(43_30%_62%)]">
                        {book.category?.name}
                    </span>{" "}
                    · {book.publishedYear}
                </p>
            </div>
            <div className="flex items-center gap-20">
                {/* catégorie (md+) */}
                <span className="font-quote hidden shrink-0 truncate text-xs italic text-[hsl(43_30%_64%)] md:block">
                    {book.category?.name}
                </span>
                <div className="flex items-center gap-5">
                    {/* note (lg+) */}
                    <div className="hidden shrink-0 lg:block">
                        <BookCardRating
                            averageRating={book.averageRating}
                            reviewCount={book.reviewCount}
                        />
                    </div>

                    {/* statut (sm+) */}
                    <div className="hidden shrink-0 sm:block">
                        <SelectBookStatus
                            value={status}
                            onChange={(newStatus) =>
                                onStatusChange?.({
                                    userBookId: id,
                                    bookId: book.id,
                                    status: newStatus,
                                })
                            }
                            disabled={isUpdatingUserBook}
                            colored
                            className="min-w-37.5 h-8 w-full rounded-md text-xs"
                        />
                    </div>

                    {/* actions */}
                    <div className="flex shrink-0 items-center gap-2">
                        <button
                            type="button"
                            onClick={() => setFavOpen(true)}
                            aria-label={
                                isFavorite
                                    ? `Favori, rang ${favoriteRank}. Gérer les favoris`
                                    : "Ajouter aux favoris"
                            }
                            className={cn(
                                "focus-visible:ring-ring grid h-8 w-8 cursor-pointer place-items-center rounded-md border transition-colors focus-visible:outline-none focus-visible:ring-2",
                                isFavorite
                                    ? "border-primary/50 text-primary bg-primary/14"
                                    : "border-border text-muted-foreground hover:text-primary hover:border-primary/40",
                            )}
                        >
                            <FaStar className="h-3 w-3" aria-hidden="true" />
                        </button>
                        <Button
                            variant="destructiveGhost"
                            size="icon"
                            onClick={() => setConfirming(true)}
                            ariaLabel="Retirer de vos rayons"
                            className="h-8 w-8 rounded-md"
                        >
                            <FaTrashCan
                                className="h-3 w-3"
                                aria-hidden="true"
                            />
                        </Button>
                    </div>
                </div>
            </div>

            {confirming && (
                <ConfirmRemoveOverlay
                    title={book.title}
                    loading={isDeletingUserBook}
                    onConfirm={() => handleDeleteUserBook?.(id)}
                    onCancel={() => setConfirming(false)}
                />
            )}

            <FavoriteBookModal
                isOpen={favOpen}
                onClose={() => setFavOpen(false)}
                userBookId={id}
                book={book}
                isFavorite={isFavorite}
                favoriteRank={favoriteRank}
            />
        </div>
    );
}
