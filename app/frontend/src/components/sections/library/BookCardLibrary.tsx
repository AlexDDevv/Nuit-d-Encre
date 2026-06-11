import SelectBookStatus from "@/components/sections/book/SelectBookStatus";
import { cn } from "@/lib/utils";
import { BookCardLibraryProps, UserBookStatus } from "@/types/types";
import UserBookInfo from "@/components/sections/library/UserBookInfo";
import BookCover from "@/components/sections/book/BookCover";
import Button from "@/components/UI/Button/Button";
import FavoriteBook from "@/components/sections/library/FavoriteBook";

export default function BookCardLibrary({
    id,
    book,
    status,
    isFavorite = false,
    favoriteRank = null,
    layout,
    onStatusChange,
    isUpdatingUserBook,
    handleDeleteUserBook,
    isDeletingUserBook,
}: BookCardLibraryProps) {
    const handleChange = (newStatus: UserBookStatus) => {
        onStatusChange?.({
            userBookId: id,
            bookId: book.id,
            status: newStatus,
        });
    };

    return (
        <article
            className={cn(
                "relative border-border bg-card w-lg flex rounded-xl border-2 p-8",
                layout === "grid"
                    ? "w-lg flex-col gap-8"
                    : "w-full flex-row items-center justify-between gap-10",
            )}
        >
            <div className="absolute right-3 top-3">
                <FavoriteBook
                    isFavorite={isFavorite}
                    favoriteRank={favoriteRank}
                />
            </div>
            <div className="flex gap-8">
                <BookCover
                    coverUrl={book.coverUrl}
                    title={book.title}
                    author={`${book.author.firstname} ${book.author.lastname}`}
                    compact
                    className="aspect-[2/3] w-32 shrink-0 rounded-md"
                />
                <div className="flex flex-col gap-5">
                    <header className="text-card-foreground flex flex-col">
                        <h2
                            className="line-clamp-1 max-w-80 text-2xl font-bold"
                            title={book.title}
                        >
                            {book.title}
                        </h2>
                        <p className="font-semibold italic">
                            {book.author.firstname} {book.author.lastname}
                        </p>
                    </header>
                    <ul className="text-secondary-foreground flex flex-col">
                        <li>Année de publication : {book.publishedYear}</li>
                        <li>{book.publisher}</li>
                        <li>Nombre de page : {book.pageCount}</li>
                    </ul>
                </div>
            </div>

            {layout === "grid" ? (
                <>
                    <div className="flex flex-col gap-1">
                        <UserBookInfo
                            category={book.category.name}
                            averageRating={book.averageRating}
                            reviewCount={book.reviewCount}
                            recommendationCount={book.recommendationCount}
                            userBookId={id}
                            isFavorite={isFavorite}
                            favoriteRank={favoriteRank}
                        />
                    </div>
                    <div className="flex items-center justify-between gap-5">
                        <SelectBookStatus
                            value={status}
                            onChange={onStatusChange ? handleChange : undefined}
                            disabled={isUpdatingUserBook}
                        />
                        <Button
                            ariaLabel="Supprimer ce livre de votre bibliothèque personnelle"
                            role="button"
                            onClick={() => handleDeleteUserBook?.(id)}
                            loading={isDeletingUserBook}
                            children="Supprimer"
                            variant="destructive"
                        />
                    </div>
                </>
            ) : (
                <div className="flex flex-wrap items-center justify-end gap-x-10 gap-y-5">
                    <div className="flex items-center justify-center gap-10">
                        <UserBookInfo
                            category={book.category.name}
                            averageRating={book.averageRating}
                            reviewCount={book.reviewCount}
                            recommendationCount={book.recommendationCount}
                            userBookId={id}
                            isFavorite={isFavorite}
                            favoriteRank={favoriteRank}
                        />
                    </div>
                    <div className="flex items-center justify-end gap-5">
                        <SelectBookStatus
                            value={status}
                            onChange={onStatusChange ? handleChange : undefined}
                            disabled={isUpdatingUserBook}
                        />
                        <Button
                            ariaLabel="Supprimer ce livre de votre bibliothèque personnelle"
                            role="button"
                            onClick={() => handleDeleteUserBook?.(id)}
                            loading={isDeletingUserBook}
                            children="Supprimer"
                            variant="destructive"
                        />
                    </div>
                </div>
            )}
        </article>
    );
}
