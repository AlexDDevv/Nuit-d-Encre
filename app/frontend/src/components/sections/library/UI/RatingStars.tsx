import { LuStar } from "react-icons/lu";
import { cn } from "@/lib/utils";
import Button from "@/components/UI/Button/Button";

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
                    <Button
                        key={index}
                        variant="ghost"
                        size="xs"
                        onClick={() => handleClick(starValue)}
                        disabled={readOnly}
                        ariaLabel={`${starValue} étoile${starValue > 1 ? "s" : ""}`}
                        className={cn(
                            "transition-colors hover:no-underline p-0 h-fit",
                            !readOnly && "cursor-pointer hover:scale-110",
                            readOnly && "cursor-default",
                        )}
                    >
                        <LuStar
                            className={cn(
                                sizeClasses[size],
                                isFilled
                                    ? "fill-yellow-400 text-yellow-400"
                                    : "text-muted-foreground",
                            )}
                        />
                    </Button>
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