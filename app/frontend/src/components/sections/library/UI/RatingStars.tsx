import { Star } from "lucide-react";

export default function RatingStars({ rating }: { rating: number }) {
    return (
        <div className="flex items-center gap-2">
            {rating}
            {[...Array(5)].map((_, i) => (
                <Star key={i} className="text-secondary-foreground h-4 w-4" />
            ))}
        </div>
    );
}
