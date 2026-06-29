import FilterChips from "@/components/UI/FilterChips";
import {
    CATEGORY_ICON,
    CATEGORY_LABEL,
    CATEGORY_ORDER,
} from "@/components/sections/shared/activityCategory";
import { ActivityFilter, ChipOption, FeedFilterBarProps } from "@/types/types";

const OPTIONS: ChipOption<ActivityFilter>[] = [
    { value: "all", label: "Tout" },
    ...CATEGORY_ORDER.map((cat) => ({
        value: cat,
        label: CATEGORY_LABEL[cat],
        icon: CATEGORY_ICON[cat],
    })),
];

/** Filtres par catégorie d'action du fil (« Tout » + les six familles). */
export default function FeedFilterBar({ value, onChange }: FeedFilterBarProps) {
    return (
        <FilterChips
            options={OPTIONS}
            value={value}
            onChange={onChange}
            ariaLabel="Filtrer par catégorie"
        />
    );
}
