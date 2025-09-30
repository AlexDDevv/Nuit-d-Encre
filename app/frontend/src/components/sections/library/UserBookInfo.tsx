import { UserBookInfoProps } from "@/types/types";
import RatingStars from "@/components/sections/library/UI/RatingStars";

export default function UserBookInfo({
    category,
    rating,
    recommended,
}: UserBookInfoProps) {
    return (
        <>
            <p className="text-card-foreground">{category}</p>
            <RatingStars rating={rating} />
            <p className="text-card-foreground">
                Recommandé par x {recommended} lecteurs
            </p>
        </>
    );
}
