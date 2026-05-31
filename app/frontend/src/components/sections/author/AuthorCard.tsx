import Button from "@/components/UI/Button/Button";
import { buildAuthorAriaLabel, slugify } from "@/lib/utils";
import { AuthorCardProps } from "@/types/types";
import { CiBookmark } from "react-icons/ci";
import { FaFeatherPointed } from "react-icons/fa6";

export default function AuthorCard({
    id,
    firstname,
    lastname,
    isIncomplete,
}: AuthorCardProps) {
    const path = `/authors/${id}-${slugify(firstname)}-${slugify(lastname)}`;
    const ariaLabel = buildAuthorAriaLabel(firstname, lastname);
    const isCurrent = path === window.location.pathname;
    const fullName = `${firstname} ${lastname}`;

    return (
        <Button
            variant="authorCard"
            size="authorCard"
            to={path}
            aria-current={isCurrent ? "page" : undefined}
            ariaLabel={ariaLabel}
            category="Auteur"
        >
            <FaFeatherPointed className="text-card-foreground h-5 w-5 shrink-0" />
            <h2
                className="text-card-foreground min-w-0 font-bold line-clamp-1"
                title={fullName}
            >
                {fullName}
            </h2>
            <CiBookmark className="text-border w-5 h-5 group-hover:text-primary absolute -top-1 right-5 transition-colors duration-200 ease-in-out shrink-0" />
            {isIncomplete && (
                <div className="bg-secondary absolute -left-5 top-2.5 flex -rotate-45 items-center justify-center px-3 py-0.5 shadow-md">
                    <span className="text-secondary-foreground text-xs">
                        Incomplet
                    </span>
                </div>
            )}
        </Button>
    );
}
