import { UserBookInfoProps } from "@/types/types";
import RatingStars from "@/components/sections/library/UI/RatingStars";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/UI/Tooltip";

export default function UserBookInfo({
    category,
    averageRating,
    reviewCount,
    recommendationCount,
}: UserBookInfoProps) {
    return (
        <>
            <p className="text-secondary-foreground">{category}</p>
            {averageRating != null ? (
                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <span className="w-fit">
                                <RatingStars
                                    value={averageRating}
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
                                {Number(averageRating.toFixed(1))} / 5
                            </p>
                            {reviewCount != null && (
                                <p className="text-muted-foreground text-xs">
                                    {reviewCount} critique{reviewCount > 1 ? "s" : ""}
                                </p>
                            )}
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>
            ) : (
                <p className="text-secondary-foreground">Aucune note</p>
            )}
            <p className="text-secondary-foreground">
                Recommandé par {recommendationCount ?? 0} lecteur
                {(recommendationCount ?? 0) > 1 ? "s" : ""}
            </p>
        </>
    );
}
