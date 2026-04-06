import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useSearchParams } from "react-router-dom";
import { Search } from "lucide-react";
import { Label } from "@/components/UI/form/Label";
import { Input } from "@/components/UI/form/Input";
import Button from "@/components/UI/Button/Button";
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
                className="absolute right-1.5 h-fit p-1.5"
            >
                <Search className="text-primary-foreground h-4 w-4" />
            </Button>
        </form>
    );
}
