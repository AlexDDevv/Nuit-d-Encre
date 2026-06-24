import SearchField from "@/components/sections/shared/fields/SearchField";

type SearchInputProps = {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    className?: string;
};

/**
 * Champ de recherche du panel admin : adaptateur contrôlé au-dessus de
 * `SearchField` (loupe à gauche, effacement à droite).
 */
export function SearchInput({
    value,
    onChange,
    placeholder = "Rechercher…",
    className = "",
}: SearchInputProps) {
    return (
        <SearchField
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onClear={() => onChange("")}
            placeholder={placeholder}
            aria-label={placeholder}
            wrapperClassName={className}
        />
    );
}
