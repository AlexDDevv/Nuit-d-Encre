import { cn } from "@/lib/utils";
import { LayoutButtonsProps, LayoutOptions } from "@/types/types";
import { LuSheet, LuLayoutList, LuLibraryBig } from "react-icons/lu";

const LAYOUT_OPTIONS: LayoutOptions[] = [
    {
        icon: LuSheet,
        label: "Disposer votre bibliothèque personnelle en grille",
        value: "grid",
    },
    {
        icon: LuLayoutList,
        label: "Disposer votre bibliothèque personnelle en liste",
        value: "list",
    },
    {
        icon: LuLibraryBig,
        label: "Disposer votre bibliothèque personnelle en étagère",
        value: "shelf",
    },
];

export default function LayoutButtons({
    activeLayout,
    onLayoutChange,
}: LayoutButtonsProps) {
    return (
        <div
            role="group"
            aria-label="Disposition de la bibliothèque"
            className="border-border inline-flex items-center gap-1 rounded-md border-2 bg-[hsl(20_3%_16%/0.5)] p-1 h-10"
        >
            {LAYOUT_OPTIONS.map(({ icon: Icon, label, value }) => {
                const active = activeLayout === value;
                return (
                    <button
                        key={value}
                        type="button"
                        aria-label={label}
                        aria-pressed={active}
                        title={label}
                        onClick={() => onLayoutChange(value)}
                        className={cn(
                            "focus-visible:ring-ring inline-flex cursor-pointer items-center rounded-sm px-2.5 py-1.5 transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 [&_svg]:h-4 [&_svg]:w-4",
                            active
                                ? "bg-primary text-primary-foreground"
                                : "text-muted-foreground hover:text-primary",
                        )}
                    >
                        <Icon />
                    </button>
                );
            })}
        </div>
    );
}
