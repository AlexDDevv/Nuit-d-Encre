import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/UI/Select";
import { cn, slugify } from "@/lib/utils";
import { Skeleton } from "@/components/UI/skeleton/Skeleton";
import { CategoryBook } from "@/types/types";
import { useSearchParams } from "react-router-dom";
import { Button } from "@/components/UI/Button";
import { useCategoriesData } from "@/hooks/category/useCategoriesData";

export default function SelectCategory() {
    const { categories, isLoadingCategories, errorCategories } =
        useCategoriesData();
    const [searchParams, setSearchParams] = useSearchParams();

    if (isLoadingCategories) {
        return (
            <Skeleton className="bg-input border-border flex h-10 w-60 min-w-60 rounded-lg border" />
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

    const openStateClasses =
        "data-[state=open]:ring-2 data-[state=open]:ring-ring data-[state=open]:ring-offset-2";

    return (
        <>
            <Select
                value={selectedCategoryId ?? ""}
                onValueChange={filterByCategory}
            >
                <SelectTrigger
                    className={cn(
                        "bg-input ring-offset-input text-accent-foreground focus-visible:ring-ring focus-within:ring-ring border-border flex w-60 min-w-60 rounded-lg border px-3 py-2 text-sm placeholder:italic placeholder:opacity-85 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
                        openStateClasses,
                    )}
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
            {selectedCategoryId && (
                <Button
                    ariaLabel="Retirer le filtre sur la catégorie"
                    children="Retirer le filtre"
                    onClick={handleResetFilter}
                    className="max-h-10"
                />
            )}
        </>
    );
}
