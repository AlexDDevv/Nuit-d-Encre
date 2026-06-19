import { ReactNode } from "react";
import { FaFeatherPointed } from "react-icons/fa6";

export default function CollectionSeam({
    icon,
    label,
}: {
    icon: ReactNode;
    label: ReactNode;
}) {
    return (
        <div className="-mt-10 flex items-center gap-3">
            <span className="inline-flex items-center gap-2 whitespace-nowrap font-mono text-xxs uppercase tracking-[0.24em] text-[hsl(43_30%_62%)]">
                {icon} {label}
            </span>
            <span className="h-px flex-1 bg-[linear-gradient(to_right,hsl(43_59%_81%/0.55),hsl(43_59%_81%/0.1))]" />
            <span className="text-primary/90 border-primary/30 inline-flex items-center gap-1.5 whitespace-nowrap rounded-full border bg-[hsl(20_3%_12%/0.6)] px-3 py-1 font-mono text-xxs tracking-wide">
                <FaFeatherPointed size={11} aria-hidden="true" /> Nuit d'Encre
            </span>
        </div>
    );
}
