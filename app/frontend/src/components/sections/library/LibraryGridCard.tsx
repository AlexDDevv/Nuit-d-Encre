import { useState } from "react";
import { Link } from "react-router-dom";
import { FaStar, FaTrashCan } from "react-icons/fa6";
import BookCover from "@/components/sections/book/BookCover";
import BookCardMeta from "@/components/sections/book/BookCard/BookCardMeta";
import BookCardRating from "@/components/sections/book/BookCard/BookCardRating";
import SelectBookStatus from "@/components/sections/book/SelectBookStatus";
import FavoriteBookModal from "@/components/sections/library/FavoriteBookModal";
import ConfirmRemoveOverlay from "@/components/sections/library/UI/ConfirmRemoveOverlay";
import { cn, slugify } from "@/lib/utils";
import { formatShortLabelMap } from "@/lib/filterMaps";
import { BOOK_STATES, STATUS_COLORS } from "@/constants/bookStatus";
import { BookCardLibraryProps } from "@/types/types";

/** Pastille de statut en lecture seule, colorée selon le statut. */
function StatusPill({ status }: { status: BookCardLibraryProps["status"] }) {
    const config = BOOK_STATES.find((s) => s.value === status);
    if (!config) return null;
    const Icon = config.icon;
    return (
        <span
            className={cn(
                "inline-flex items-center gap-1.5 whitespace-nowrap rounded-full border px-2 py-0.5 font-body text-[10.5px] font-bold backdrop-blur-sm",
                STATUS_COLORS[status].chip,
            )}
        >
            <Icon className="h-3 w-3" />
            {config.label}
        </span>
    );
}

/**
 * Carte de la vue Grille de la bibliothèque : couverture héros, favori (rang)
 * et statut incrustés, puis titre/auteur/méta/note et une rangée d'actions
 * (sélecteur de statut coloré + retrait avec confirmation).
 */
export default function LibraryGridCard({
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
    const formatLabel = book.format ? formatShortLabelMap[book.format] : undefined;

    return (
        <div
            className={cn(
                "group bg-card relative flex flex-col rounded-xl border-2 transition-all duration-200 hover:shadow-[0_18px_40px_-14px_rgba(0,0,0,0.7)]",
                isFavorite
                    ? "border-primary/40 hover:border-primary/60"
                    : "border-border hover:border-primary/55",
            )}
        >
            {/* couverture */}
            <div className="bg-background relative aspect-2/3 overflow-hidden rounded-t-[10px]">
                <BookCover
                    coverUrl={book.coverUrl}
                    title={book.title}
                    author={author}
                    className="absolute inset-0"
                    imgClassName="transition-transform duration-500 group-hover:scale-[1.05]"
                />
                <div className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-[linear-gradient(to_top,hsl(20_3%_9%/0.5),transparent)]" />

                {/* favori (haut-gauche) */}
                <button
                    type="button"
                    onClick={() => setFavOpen(true)}
                    aria-label={
                        isFavorite
                            ? `Favori, rang ${favoriteRank}. Gérer les favoris`
                            : "Ajouter aux favoris"
                    }
                    title={isFavorite ? `Favori · rang ${favoriteRank}` : "Ajouter aux favoris"}
                    className={cn(
                        "focus-visible:ring-ring absolute left-2 top-2 z-10 inline-flex cursor-pointer items-center gap-1 rounded-full border px-2 py-[5px] backdrop-blur-sm transition-all duration-200 focus-visible:outline-none focus-visible:ring-2",
                        isFavorite
                            ? "text-primary-foreground border-primary/40 bg-primary/90"
                            : "text-primary border-primary/35 bg-[hsl(20_3%_9%/0.72)]",
                    )}
                >
                    <FaStar size={12} aria-hidden="true" />
                    {isFavorite && (
                        <span className="font-mono text-[10px] font-medium leading-none">
                            {favoriteRank}
                        </span>
                    )}
                </button>

                {/* statut (bas-gauche) */}
                <div className="absolute bottom-2 left-2 z-10">
                    <StatusPill status={status} />
                </div>
            </div>

            {/* corps */}
            <div className="flex flex-1 flex-col gap-1.5 p-3">
                <Link
                    to={bookPath}
                    className="text-foreground hover:text-primary focus-visible:ring-ring font-title line-clamp-2 min-h-[2.6em] rounded text-[15px] font-medium leading-snug transition-colors focus-visible:outline-none focus-visible:ring-2"
                    title={book.title}
                >
                    {book.title}
                </Link>
                <Link
                    to={authorPath}
                    className="text-muted-foreground hover:text-primary focus-visible:ring-ring -mx-1 w-fit rounded px-1 font-body text-[12.5px] transition-colors focus-visible:outline-none focus-visible:ring-2"
                    aria-label={`Voir l'auteur ${author}`}
                >
                    {author}
                </Link>
                <BookCardMeta
                    category={book.category?.name}
                    year={book.publishedYear}
                    format={formatLabel}
                />
                <div className="mt-0.5">
                    <BookCardRating
                        averageRating={book.averageRating}
                        reviewCount={book.reviewCount}
                    />
                </div>

                {/* actions */}
                <div className="mt-2.5 flex items-center gap-2 border-t border-dashed border-[hsl(0_0%_100%/0.07)] pt-2.5">
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
                        className="h-8 w-full min-w-0 flex-1 py-1 text-xs"
                    />
                    <button
                        type="button"
                        onClick={() => setConfirming(true)}
                        aria-label="Retirer de vos rayons"
                        className="border-border text-muted-foreground hover:border-destructive/60 hover:text-[hsl(3_84%_62%)] focus-visible:ring-ring grid h-8 w-8 shrink-0 cursor-pointer place-items-center rounded-lg border transition-colors focus-visible:outline-none focus-visible:ring-2"
                    >
                        <FaTrashCan size={14} aria-hidden="true" />
                    </button>
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
