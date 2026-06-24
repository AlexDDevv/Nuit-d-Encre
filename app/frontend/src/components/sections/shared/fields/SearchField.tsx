import { ComponentProps, forwardRef } from "react";
import { LuSearch, LuX } from "react-icons/lu";
import { Input } from "@/components/UI/form/Input";
import { atelierControlClass } from "@/components/sections/shared/atelierField";
import { cn } from "@/lib/utils";

type SearchFieldProps = ComponentProps<"input"> & {
    /** Classe appliquée au conteneur (dimensionnement, marges). */
    wrapperClassName?: string;
    /** Rend la loupe comme bouton submit (barres en `<form>`). */
    submit?: boolean;
    /** Libellé accessible de la loupe submit. */
    submitLabel?: string;
    /** Si fourni, affiche un bouton d'effacement à droite dès qu'il y a une valeur. */
    onClear?: () => void;
};

/**
 * Champ de recherche de l'atelier : contrôle stylé `atelierControlClass`, loupe en
 * préfixe (décorative ou bouton submit) et bouton d'effacement optionnel. Mutualise
 * les barres de recherche (livres, auteurs, panel admin).
 */
const SearchField = forwardRef<HTMLInputElement, SearchFieldProps>(
    (
        { wrapperClassName, submit, submitLabel, onClear, className, ...props },
        ref,
    ) => {
        const showClear = onClear !== undefined && !!props.value;

        return (
            <div
                className={cn(
                    "relative flex w-full items-center",
                    wrapperClassName,
                )}
            >
                {submit ? (
                    <button
                        type="submit"
                        aria-label={submitLabel}
                        className="text-muted-foreground hover:text-primary absolute left-2 top-1/2 z-10 grid h-7 w-7 -translate-y-1/2 place-items-center rounded-md transition-colors focus:outline-none"
                    >
                        <LuSearch size={17} />
                    </button>
                ) : (
                    <span className="text-muted-foreground/70 pointer-events-none absolute left-3.5 top-1/2 z-10 -translate-y-1/2">
                        <LuSearch size={17} />
                    </span>
                )}
                <Input
                    ref={ref}
                    errorMessage=""
                    hideErrorMessage
                    className={cn(
                        atelierControlClass,
                        "pl-11",
                        showClear && "pr-10",
                        className,
                    )}
                    {...props}
                />
                {showClear && (
                    <button
                        type="button"
                        onClick={onClear}
                        aria-label="Effacer la recherche"
                        className="text-muted-foreground hover:text-primary absolute right-2.5 top-1/2 z-10 grid h-6 w-6 -translate-y-1/2 place-items-center rounded-md transition-colors focus:outline-none"
                    >
                        <LuX />
                    </button>
                )}
            </div>
        );
    },
);
SearchField.displayName = "SearchField";

export default SearchField;
