import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { useSearchParams } from "react-router-dom"
import { Search } from "lucide-react"
import { Label } from "@/components/UI/form/Label"
import { Input } from "@/components/UI/form/Input"
import { Button } from "@/components/UI/Button"

type FormValues = {
    search: string
}

export default function SearchBook() {
    const [searchParams, setSearchParams] = useSearchParams()

    const { register, handleSubmit, watch } = useForm<FormValues>({
        defaultValues: {
            search: searchParams.get("search") || "",
        },
    })

    const searchValue = watch("search")

    useEffect(() => {
        if (searchValue === "") {
            const newParams = new URLSearchParams(searchParams)
            newParams.delete("search")
            setSearchParams(newParams)
        }
    }, [searchValue, searchParams, setSearchParams])

    const onSubmit = (data: FormValues) => {
        const newParams = new URLSearchParams(searchParams)

        if (data.search.trim()) {
            newParams.set("search", data.search.trim())
        } else {
            newParams.delete("search")
        }

        setSearchParams(newParams)
    }

    return (
        <form
            onSubmit={handleSubmit(onSubmit)}
            className="relative flex flex-1 items-center justify-center w-sm min-w-sm"
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
                className="pr-10 text-ellipsis whitespace-nowrap"
            />
            <Button
                type="submit"
                ariaLabel="Rechercher un livre"
                className="absolute right-1.5 p-1.5"
            >
                <Search className="h-4 w-4 text-primary-foreground" />
            </Button>
        </form>
    )
}
