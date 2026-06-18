import { LuHeart } from "react-icons/lu"
import { Chipset } from "@/components/UI/Chipset"
import { cn } from "@/lib/utils"
import { RecommendationCountProps } from "@/types/types"

/**
 * RecommendationCount Component
 * @description
 * Displays the number of recommendations a book has received.
 * Uses the Chipset component for consistent styling.
 *
 * @param count - The number of recommendations
 * @param className - Additional CSS classes
 * @param showIcon - Whether to show the heart icon (default: false)
 * @param variant - Chipset variant to use (default: "primary")
 * @param rounded - Whether to use rounded corners (default: false)
 *
 * @example
 * ```tsx
 * <RecommendationCount count={42} />
 * <RecommendationCount count={10} variant="outline" rounded />
 * ```
 */
export function RecommendationCount({
    count,
    className,
    showIcon = false,
    variant = "primary",
    rounded = false,
}: RecommendationCountProps) {
    return (
        <Chipset
            variant={variant}
            rounded={rounded}
            ariaLabel={`${count} recommandation${count !== 1 ? "s" : ""} pour ce livre`}
            className={cn("gap-2", className)}
        >
            {showIcon && <LuHeart className="size-3" fill="currentColor" />}
            <span className="font-semibold">{count}</span>
            <span className="hidden sm:inline">
                {count !== 1 ? "recommandations" : "recommandation"}
            </span>
        </Chipset>
    )
}
