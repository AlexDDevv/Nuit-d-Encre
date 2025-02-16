import { Search } from "lucide-react";

export default function Form() {
    return (
        <form className="relative flex max-w-3xl grow items-center justify-center">
            <input
                className="bg-input text-accent-foreground focus:outline-ring h-10 w-full rounded-md border-0 p-2 text-xs italic placeholder:opacity-85 focus:outline-2"
                type="search"
                placeholder="Rechercher sur The good corner"
            />
            <div className="bg-primary absolute right-2 cursor-pointer rounded-md p-2">
                <Search className="text-primary-foreground h-4 w-4" />
            </div>
        </form>
    );
}
