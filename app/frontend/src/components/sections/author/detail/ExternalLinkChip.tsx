import { ReactNode } from "react";
import { FaArrowUpRightFromSquare } from "react-icons/fa6";

type ExternalLinkChipProps = {
    href: string;
    icon: ReactNode;
    label: string;
};

/**
 * Chip de lien externe (Wikipédia / site officiel) — ouverture dans un nouvel
 * onglet, annoncée pour l'accessibilité.
 */
export default function ExternalLinkChip({
    href,
    icon,
    label,
}: ExternalLinkChipProps) {
    return (
        <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`${label} (nouvel onglet)`}
            className="group border-border hover:border-primary/60 text-muted-foreground hover:text-primary focus-visible:ring-ring inline-flex items-center gap-2 rounded-full border-2 bg-[hsl(20_3%_14%/0.6)] px-3.5 py-2 font-body text-sm transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
        >
            {icon}
            {label}
            <FaArrowUpRightFromSquare
                size={11}
                className="opacity-50 transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                aria-hidden="true"
            />
        </a>
    );
}
