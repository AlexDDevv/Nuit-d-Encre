import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface RatingStarsProps {
    value: number;
    onChange?: (rating: number) => void;
    max?: number;
    size?: "sm" | "md" | "lg";
    readOnly?: boolean;
    showValue?: boolean;
    className?: string;
}

const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-5 w-5",
    lg: "h-6 w-6",
};

export default function RatingStars({
    value,
    onChange,
    max = 5,
    size = "md",
    readOnly = false,
    showValue = false,
    className,
}: RatingStarsProps) {
    const handleClick = (rating: number) => {
        if (!readOnly && onChange) {
            onChange(rating);
        }
    };

    return (
        <div className={cn("flex items-center gap-1", className)}>
            {Array.from({ length: max }, (_, index) => {
                const starValue = index + 1;
                const isFilled = starValue <= value;

                return (
                    <button
                        key={index}
                        type="button"
                        onClick={() => handleClick(starValue)}
                        disabled={readOnly}
                        className={cn(
                            "transition-colors",
                            !readOnly && "cursor-pointer hover:scale-110",
                            readOnly && "cursor-default",
                        )}
                        aria-label={`${starValue} étoile${starValue > 1 ? "s" : ""}`}
                    >
                        <Star
                            className={cn(
                                sizeClasses[size],
                                isFilled
                                    ? "fill-yellow-400 text-yellow-400"
                                    : "text-muted-foreground",
                            )}
                        />
                    </button>
                );
            })}
            {showValue && (
                <span className="text-foreground ml-2 text-sm font-medium">
                    {value}/{max}
                </span>
            )}
        </div>
    );
}