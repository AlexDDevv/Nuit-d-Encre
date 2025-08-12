import { useState } from "react";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/UI/Select";
import { cn } from "@/lib/utils";
import { useBook } from "@/hooks/useBook";
import Loader from "@/components/UI/Loader";
import { categoryPropsType } from "@/types/types";

export default function SelectCategory() {
    const { categories, loadingCategories, errorCategories } = useBook()
    const [selectedCategory, setSelectedCategory] = useState<string>("");

    if (loadingCategories) {
        return (
            <Loader />
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

    const openStateClasses =
        "data-[state=open]:ring-2 data-[state=open]:ring-ring data-[state=open]:ring-offset-2";

    return (
        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className={cn(
                "bg-input ring-offset-input text-accent-foreground focus-visible:ring-ring focus-within:ring-ring border-border flex w-full rounded-lg border px-3 py-2 text-sm placeholder:italic placeholder:opacity-85 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 max-w-80 mx-auto",
                openStateClasses
            )}>
                <SelectValue placeholder="Sélectionnez une catégorie" />
            </SelectTrigger>
            <SelectContent animate={true}>
                {categories.map((category: categoryPropsType) => (
                    <SelectItem
                        key={category.id}
                        value={category.id}
                        animate={true}
                    >
                        {category.name}
                    </SelectItem>
                ))}
            </SelectContent>
        </Select>
    );
}