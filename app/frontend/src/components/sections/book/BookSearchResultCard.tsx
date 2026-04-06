import { Link } from "react-router-dom";
import { BookSearchResultCardProps } from "@/types/types";
import { slugify, cn } from "@/lib/utils";
import { Badge } from "@/components/UI/Badge";

export default function BookSearchResultCard({ result, className }: BookSearchResultCardProps) {
    const to = result.isInDatabase && result.id
        ? `/books/${result.id}-${slugify(result.title)}`
        : `/books/preview/${result.isbn13}`;

    return (
        <Link
            to={to}
            className={cn(
                "border-border bg-card hover:border-primary focus-visible:ring-ring ring-offset-ring flex items-center gap-4 rounded-xl border-2 p-4 transition-all duration-200 ease-in-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
                className
            )}
            aria-label={`Voir ${result.title}${result.author ? ` par ${result.author}` : ""}`}
        >
            <div className="h-20 w-14 shrink-0 overflow-hidden rounded">
                <img
                    src={result.coverUrl ?? "/images/bookCover.svg"}
                    alt={`Couverture de ${result.title}`}
                    className="h-full w-full object-cover"
                    onError={(e) => {
                        (e.target as HTMLImageElement).src = "/images/bookCover.svg";
                    }}
                />
            </div>
            <div className="flex flex-1 flex-col gap-1 overflow-hidden">
                <p className="text-card-foreground line-clamp-2 font-medium" title={result.title}>
                    {result.title}
                </p>
                {result.author && (
                    <p className="text-muted-foreground text-sm">{result.author}</p>
                )}
                {result.year && (
                    <p className="text-muted-foreground text-sm">{result.year}</p>
                )}
            </div>
            <div className="shrink-0">
                {result.isInDatabase ? (
                    <Badge variant="default" className="text-xs">
                        Disponible
                    </Badge>
                ) : (
                    <Badge variant="outline" className="text-xs">
                        Importable
                    </Badge>
                )}
            </div>
        </Link>
    );
}
