import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useSearchParams } from "react-router-dom";
import { Label } from "@/components/UI/form/Label";
import SearchField from "@/components/sections/shared/fields/SearchField";

type FormValues = {
    search: string;
};

export default function SearchAuthor() {
    const [searchParams, setSearchParams] = useSearchParams();

    const { register, handleSubmit, watch } = useForm<FormValues>({
        defaultValues: {
            search: searchParams.get("search") || "",
        },
    });

    const searchValue = watch("search");

    useEffect(() => {
        if (searchValue === "") {
            const newParams = new URLSearchParams(searchParams);
            newParams.delete("search");
            setSearchParams(newParams);
        }
    }, [searchValue, searchParams, setSearchParams]);

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
            className="w-lg min-w-lg flex flex-1 items-center"
        >
            <Label htmlFor="search" className="sr-only">
                Rechercher un auteur
            </Label>
            <SearchField
                id="search"
                type="search"
                placeholder="Nom ou prénom…"
                submit
                submitLabel="Rechercher un auteur"
                {...register("search")}
                className="text-ellipsis whitespace-nowrap"
            />
        </form>
    );
}
