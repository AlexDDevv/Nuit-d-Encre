import { FaFeatherPointed } from "react-icons/fa6";

type MonogramProps = {
    first: string;
    last: string;
};

/**
 * Monogramme d'auteur : initiales en serif sur une pastille dorée/sombre, avec
 * un ornement plume — l'identité visuelle d'une carte auteur à défaut de photo.
 */
export default function Monogram({ first, last }: MonogramProps) {
    const initials = `${first[0] ?? ""}${last[0] ?? ""}`.toUpperCase();

    return (
        <div className="relative grid h-21.5 w-21.5 place-items-center rounded-full bg-[radial-gradient(circle_at_32%_26%,hsl(43_30%_31%),hsl(20_3%_13%)_78%)] shadow-[inset_0_0_0_1px_hsl(43_59%_81%/0.28),0_6px_18px_-8px_hsl(20_3%_4%/0.9)] transition-shadow duration-200">
            <span className="text-primary font-quote text-3xl">
                {initials}
            </span>
            <span className="bg-card absolute -bottom-2 grid h-6 w-6 place-items-center rounded-full shadow-[inset_0_0_0_1px_hsl(43_59%_81%/0.25)]">
                <FaFeatherPointed
                    size={11}
                    className="text-foreground/70"
                    aria-hidden="true"
                />
            </span>
        </div>
    );
}
