import { Heart } from "lucide-react";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/UI/Tooltip";
import { FavoriteBookProps } from "@/types/types";

export default function FavoriteBook({ isFavorite, favoriteRank }: FavoriteBookProps) {
    if (!isFavorite) return null;

    return (
        <TooltipProvider>
            <Tooltip>
                <TooltipTrigger asChild>
                    <Heart className="h-4 w-4 fill-primary stroke-primary" />
                </TooltipTrigger>
                <TooltipContent
                    side="top"
                    className="max-w-xs border-2 py-2 px-4"
                    sideOffset={5}
                >
                    <p className="font-semibold">Livre favori #{favoriteRank}</p>
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    );
}
