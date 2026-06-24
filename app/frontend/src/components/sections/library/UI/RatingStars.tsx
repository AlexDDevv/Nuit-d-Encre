import { LuStar } from "react-icons/lu";
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
    return (
        <div
            className={cn("flex items-center gap-1", className)}
            {...(readOnly && {
                role: "img",
                "aria-label": `Note : ${value} sur ${max}`,
            })}
        >
            {Array.from({ length: max }, (_, index) => {
                const starValue = index + 1;
                const isFilled = starValue <= value;
                const star = (
                    <LuStar
                        className={cn(
                            sizeClasses[size],
                            isFilled
                                ? "fill-yellow-400 text-yellow-400"
                                : "text-muted-foreground",
                        )}
                    />
                );

                // Lecture seule : étoile décorative, sans fond ni bouton.
                if (readOnly) {
                    return (
                        <span
                            key={index}
                            aria-hidden="true"
                            className="inline-flex"
                        >
                            {star}
                        </span>
                    );
                }

                // Interactif : bouton nu (agrandissement au survol, anneau de focus).
                return (
                    <button
                        key={index}
                        type="button"
                        onClick={() => onChange?.(starValue)}
                        aria-label={`${starValue} étoile${starValue > 1 ? "s" : ""}`}
                        className="focus-visible:ring-ring cursor-pointer rounded-sm transition-transform hover:scale-110 focus-visible:outline-none focus-visible:ring-2"
                    >
                        {star}
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
