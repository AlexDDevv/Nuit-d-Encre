import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/UI/Select";
import { cn, slugify } from "@/lib/utils";
import { atelierSelectTriggerClass } from "@/components/sections/shared/atelierField";
import { Skeleton } from "@/components/UI/skeleton/Skeleton";
import { CategoryBook } from "@/types/types";
import { useLocation, useSearchParams } from "react-router-dom";
import Button from "@/components/UI/Button/Button";
import { useCategoriesData } from "@/hooks/category/useCategoriesData";

export default function SelectCategory() {
    const { categories, isLoadingCategories, errorCategories } =
        useCategoriesData();
    const [searchParams, setSearchParams] = useSearchParams();
    const location = useLocation();
    const isInBooksPage = location.pathname === "/books";

    if (isLoadingCategories) {
        return (
            <Skeleton className="bg-popover/70 border-border flex h-10 w-60 min-w-60 rounded-lg border-2" />
        );
    }

    if (errorCategories) {
        const isNotFoundError = errorCategories.graphQLErrors.some((error) =>
            error.message.includes("Failed to fetch categories"),
        );

        if (isNotFoundError) {
            throw new Response("Categories not found", { status: 404 });
        }

        // Pour les autres erreurs GraphQL
        throw new Response("Error loading categories", { status: 500 });
    }

    if (!categories) {
        throw new Response("Categories not found", { status: 404 });
    }

    const selectedCategoryId = searchParams.get("categoryId");

    const filterByCategory = (categoryId: string) => {
        const category = categories.find(
            (category: CategoryBook) => category.id === categoryId,
        );
        if (!category) return;

        const slug = slugify(category.name);
        const newParams = new URLSearchParams(searchParams);

        if (newParams.get("category") === slug) {
            newParams.delete("category");
            newParams.delete("categoryId");
        } else {
            newParams.set("category", slug);
            newParams.set("categoryId", category.id);
        }

        setSearchParams(newParams);
    };

    const handleResetFilter = () => {
        const newParams = new URLSearchParams(searchParams);
        newParams.delete("category");
        newParams.delete("categoryId");

        setSearchParams(newParams);
    };

    return (
        <>
            <Select
                value={selectedCategoryId ?? ""}
                onValueChange={filterByCategory}
            >
                <SelectTrigger
                    className={cn(atelierSelectTriggerClass, "w-60 min-w-60")}
                >
                    <SelectValue placeholder="Sélectionnez une catégorie" />
                </SelectTrigger>
                <SelectContent animate={true}>
                    {categories.map((category: CategoryBook, index: number) => (
                        <SelectItem
                            key={category.id}
                            value={category.id}
                            animate={true}
                            index={index}
                        >
                            {category.name}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
            {isInBooksPage && selectedCategoryId && (
                <Button
                    ariaLabel="Retirer le filtre sur la catégorie"
                    children="Retirer le filtre"
                    onClick={handleResetFilter}
                />
            )}
        </>
    );
}
