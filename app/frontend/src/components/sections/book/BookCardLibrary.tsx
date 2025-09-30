import SelectBookStatus from "@/components/UI/SelectBookStatus";
import { BookCardLibraryProps } from "@/types/types";
import { Star } from "lucide-react";

export default function BookCardLibrary({
    id,
    book,
    rating,
    recommended,
    status,
}: BookCardLibraryProps) {
    return (
        <article className="border-border bg-card w-lg flex flex-col gap-8 rounded-xl border-2 p-8">
            <div className="flex gap-8">
                <div className="w-32 flex-shrink-0">
                    <img
                        src="/images/bookCover.svg"
                        alt={`Couverture du livre ${book.title} de ${book.author.firstname} ${book.author.lastname}`}
                        width="128"
                        height="192"
                        loading="lazy"
                    />
                </div>
                <div className="text-card-foreground flex flex-col gap-5">
                    <header className="flex flex-col">
                        <h2
                            className="line-clamp-1 text-2xl font-bold"
                            title={book.title}
                        >
                            {book.title}
                        </h2>
                        <p className="font-semibold italic">
                            {book.author.firstname} {book.author.lastname}
                        </p>
                    </header>
                    <div>
                        <ul className="flex flex-col gap-1">
                            <li>{book.publishedYear}</li>
                            <li>{book.publisher}</li>
                            <li>{book.pageCount}</li>
                        </ul>
                    </div>
                </div>
            </div>
            <div className="flex flex-col gap-5">
                <p className="text-card-foreground text-xl">
                    {book.category.name}
                </p>
                <div className="flex items-center gap-2">
                    {/* Faire le rating */}
                    {rating}
                    <Star className="text-primary h-4 w-4" />
                    <Star className="text-primary h-4 w-4" />
                    <Star className="text-primary h-4 w-4" />
                    <Star className="text-primary h-4 w-4" />
                    <Star className="text-primary h-4 w-4" />
                </div>
                {/* Faire les recommandations et conditionner l'affichage si < 0 */}
                <p className="text-card-foreground">
                    Recommandé par {recommended} lecteurs
                </p>
            </div>
            <SelectBookStatus bookId={id} status={status} />
        </article>
    );
}
