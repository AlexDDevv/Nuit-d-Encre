import { Button } from "@/components/UI/Button";
import SearchBook from "../../book/SearchBook";
import SelectCategory from "../../book/SelectCategory";
import FilterUserBookStatus from "./FilterUserBookStatus";
import { FiltersUserBooksProps } from "@/types/types";

export default function FiltersUserBooks({
    searchParams,
    selectedStatus,
    onStatusChange,
    filters,
    onClearAll,
}: FiltersUserBooksProps) {
    const hasCategory = !!searchParams.get("categoryId");
    const hasStatus = !!selectedStatus || filters.length > 0;

    const activeFiltersCount = Number(hasCategory) + Number(hasStatus);

    const hasAnyFilter = activeFiltersCount > 0;

    const clearButtonLabel =
        activeFiltersCount > 1
            ? "Supprimer les filtres"
            : "Supprimer le filtre";

    return (
        <div className="flex items-center justify-center gap-5">
            <SearchBook isInLibrary={true} />
            <SelectCategory />
            <FilterUserBookStatus
                selectedStatus={selectedStatus}
                onStatusChange={onStatusChange}
            />
            {hasAnyFilter && (
                <Button
                    ariaLabel={clearButtonLabel}
                    variant="destructive"
                    onClick={onClearAll}
                >
                    {clearButtonLabel}
                </Button>
            )}
        </div>
    );
}
