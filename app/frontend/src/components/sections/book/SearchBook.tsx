import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useSearchParams } from "react-router-dom";
import { Label } from "@/components/UI/form/Label";
import SearchField from "@/components/sections/shared/fields/SearchField";
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
        if (isInLibrary) {
            setSearchParams((prev) => {
                const param = new URLSearchParams(prev);
                if (debouncedSearchValue.trim()) {
                    param.set("search", debouncedSearchValue.trim());
                } else {
                    param.delete("search");
                }
                return param;
            });
        } else if (searchValue === "") {
            setSearchParams((prev) => {
                const param = new URLSearchParams(prev);
                param.delete("search");
                return param;
            });
        }
    }, [debouncedSearchValue, isInLibrary, searchValue, setSearchParams]);

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
                "flex items-center",
                isInLibrary ? "min-w-60" : "min-w-md",
            )}
        >
            <Label htmlFor="search" className="sr-only">
                Rechercher un livre
            </Label>
            <SearchField
                id="search"
                type="search"
                placeholder="Titre, auteur, ISBN…"
                submit
                submitLabel="Rechercher un livre"
                {...register("search")}
                className="text-ellipsis whitespace-nowrap"
            />
        </form>
    );
}
