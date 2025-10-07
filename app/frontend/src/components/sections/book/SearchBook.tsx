import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useSearchParams } from "react-router-dom";
import { Search } from "lucide-react";
import { Label } from "@/components/UI/form/Label";
import { Input } from "@/components/UI/form/Input";
import { Button } from "@/components/UI/Button";
import { cn } from "@/lib/utils";
import { useDebounce } from "@/hooks/search/useDebounce";

type FormValues = {
    search: string;
};

export default function SearchBook({ isInLibrary }: { isInLibrary?: boolean }) {
    const [searchParams, setSearchParams] = useSearchParams();

    const { register, handleSubmit, watch } = useForm<FormValues>({
        defaultValues: {
            search: searchParams.get("search") || "",
        },
    });

    const searchValue = watch("search");
    const debouncedSearchValue = useDebounce(searchValue, 300);

    useEffect(() => {
        // If isInLibrary, get automatic search with debounce
        if (isInLibrary) {
            const newParams = new URLSearchParams(searchParams);

            if (debouncedSearchValue.trim()) {
                newParams.set("search", debouncedSearchValue.trim());
            } else {
                newParams.delete("search");
            }

            setSearchParams(newParams);
        } else {
            if (searchValue === "") {
                const newParams = new URLSearchParams(searchParams);
                newParams.delete("search");
                setSearchParams(newParams);
            }
        }
    }, [
        debouncedSearchValue,
        isInLibrary,
        searchParams,
        setSearchParams,
        searchValue,
    ]);

    const onSubmit = (data: FormValues) => {
        const newParams = new URLSearchParams(searchParams);

        if (data.search.trim()) {
            newParams.set("search", data.search.trim());
        } else {
            newParams.delete("search");
        }

        setSearchParams(newParams);
    };

    return (
        <form
            onSubmit={handleSubmit(onSubmit)}
            className={cn(
                "relative flex items-center justify-center",
                isInLibrary ? "min-w-60" : "min-w-sm",
            )}
        >
            <Label htmlFor="search" className="sr-only">
                Rechercher un livre
            </Label>
            <Input
                id="search"
                type="search"
                placeholder="Rechercher un livre..."
                errorMessage=""
                {...register("search")}
                className="text-ellipsis whitespace-nowrap pr-10"
            />
            <Button
                type="submit"
                ariaLabel="Rechercher un livre"
                className="absolute right-1.5 p-1.5"
            >
                <Search className="text-primary-foreground h-4 w-4" />
            </Button>
        </form>
    );
}
