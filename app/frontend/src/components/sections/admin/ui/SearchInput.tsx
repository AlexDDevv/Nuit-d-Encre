import { LuSearch, LuX } from "react-icons/lu";
import { cn } from "@/lib/utils";
import { Input } from "@/components/UI/form/Input";

type SearchInputProps = {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    className?: string;
};

/**
 * Champ de recherche du panel admin, bâti sur l'`Input` partagé : icône loupe à
 * gauche et bouton d'effacement à droite.
 */
export function SearchInput({
    value,
    onChange,
    placeholder = "Rechercher…",
    className = "",
}: SearchInputProps) {
    return (
        <div className={cn("relative", className)}>
            <LuSearch
                size={16}
                className="pointer-events-none absolute left-3 top-1/2 z-10 -translate-y-1/2 text-muted-foreground/70"
            />
            <Input
                type="text"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder}
                aria-label={placeholder}
                errorMessage=""
                className="pl-9 pr-9"
            />
            {value && (
                <button
                    onClick={() => onChange("")}
                    aria-label="Effacer la recherche"
                    className="absolute right-2.5 top-1/2 z-10 grid h-6 w-6 -translate-y-1/2 place-items-center rounded-md text-muted-foreground transition-colors hover:text-primary"
                >
                    <LuX size={14} />
                </button>
            )}
        </div>
    );
}
