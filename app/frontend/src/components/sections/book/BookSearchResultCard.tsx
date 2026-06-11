import { BookSearchResultCardProps } from "@/types/types";
import { slugify } from "@/lib/utils";
import { Badge } from "@/components/UI/Badge";
import Button from "@/components/UI/Button/Button";
import BookCover from "@/components/sections/book/BookCover";

export default function BookSearchResultCard({ result, className }: BookSearchResultCardProps) {
    const to = result.isInDatabase && result.id
        ? `/books/${result.id}-${slugify(result.title)}`
        : `/books/preview/${result.isbn13}`;

    return (
        <Button
            variant="searchResultCard"
            size="searchResultCard"
            to={to}
            ariaLabel={`Voir ${result.title}${result.author ? ` par ${result.author}` : ""}`}
            className={className}
        >
            <div className="flex items-start gap-4">
                <BookCover
                    coverUrl={result.coverUrl}
                    title={result.title}
                    author={result.author ?? ""}
                    compact
                    className="h-20 w-16 shrink-0 rounded"
                />
                <div className="flex flex-1 flex-col gap-1 overflow-hidden">
                    <p className="text-card-foreground line-clamp-1 font-medium max-w-75" title={result.title}>
                        {result.title}
                    </p>
                    {result.author && (
                        <p className="text-muted-foreground text-sm">{result.author}</p>
                    )}
                    {result.year && (
                        <p className="text-muted-foreground text-sm">{result.year}</p>
                    )}
                </div>
            </div>
            <div className="shrink-0">
                {result.isInDatabase ? (
                    <Badge variant="default">
                        Disponible
                    </Badge>
                ) : (
                    <Badge variant="outline">
                        Importable
                    </Badge>
                )}
            </div>
        </Button>
    );
}
