import FeedEntryCard from "./FeedEntryCard";
import Button from "@/components/UI/Button";
import { FeedListProps } from "@/types/types";

/** Liste d'entrées de fil + bouton « charger plus » optionnel. */
export default function FeedList({
    entries,
    hasMore,
    onLoadMore,
}: FeedListProps) {
    return (
        <div className="flex flex-col gap-3">
            {entries.map((e) => (
                <FeedEntryCard key={e.id} entry={e} />
            ))}
            {/* Pagination différée (MVP single-page) — activé quand le hook exposera hasMore/onLoadMore */}
            {hasMore && onLoadMore && (
                <Button variant="secondary" onClick={onLoadMore} fullWidth>
                    Charger plus
                </Button>
            )}
        </div>
    );
}
