import { FaCheck } from "react-icons/fa6";

/**
 * Marqueur doré discret « Dans ma bibliothèque » (coche dans une pastille dorée),
 * affiché en superposition uniquement lorsque le livre est dans la bibliothèque
 * de l'utilisateur.
 */
export default function LibraryMark() {
    return (
        <span
            className="bg-primary text-primary-foreground grid h-7 w-7 place-items-center rounded-full shadow-lg ring-1 ring-[hsl(20_3%_10%/0.5)]"
            title="Dans ma bibliothèque"
            aria-label="Dans ma bibliothèque"
            role="img"
        >
            <FaCheck aria-hidden="true" />
        </span>
    );
}
