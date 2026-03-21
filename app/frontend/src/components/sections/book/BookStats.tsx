import { Book } from "@/types/types";
import RatingStars from "../library/UI/RatingStars";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/UI/Tooltip";

interface BookStatsProps {
    book: Book;
}

export default function BookStats({ book }: BookStatsProps) {
    const hasRating = book.averageRating != null;
    const hasRecommendations =
        book.recommendationCount != null && book.recommendationCount > 0;

    if (!hasRating && !hasRecommendations) return null;

    return (
        <div className="flex flex-col gap-1">
            {hasRating && (
                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <span className="w-fit">
                                <RatingStars
                                    value={book.averageRating!}
                                    readOnly
                                    size="sm"
                                />
                            </span>
                        </TooltipTrigger>
                        <TooltipContent
                            side="top"
                            className="max-w-xs border-2 py-2 px-4"
                            sideOffset={5}
                        >
                            <p className="font-semibold">
                                {Number(book.averageRating!.toFixed(1))} / 5
                            </p>
                            {book.reviewCount != null && (
                                <p className="text-muted-foreground text-xs">
                                    {book.reviewCount} critique{book.reviewCount > 1 ? "s" : ""}
                                </p>
                            )}
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>
            )}
            {hasRecommendations ? (
                <p className="text-secondary-foreground text-sm">
                    Recommandé par{" "}
                    <span className="text-foreground font-semibold">
                        {book.recommendationCount}{" "}
                        {book.recommendationCount! > 1 ? "personnes" : "personne"}
                    </span>
                </p>
            ) : (
                <p className="text-secondary-foreground text-sm">
                    Aucune personne ne l'a encore recommandé
                </p>
            )}
        </div>
    );
}
