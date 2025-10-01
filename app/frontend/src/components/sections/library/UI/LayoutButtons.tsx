import { Button } from "@/components/UI/Button";
import { cn } from "@/lib/utils";
import { LayoutButtonsProps, LayoutOptions } from "@/types/types";
import { Sheet, LayoutList, LibraryBig } from "lucide-react";

const LAYOUT_OPTIONS: LayoutOptions[] = [
    {
        icon: Sheet,
        label: "Disposer votre bibliothèque personnelle en grille",
        value: "grid",
    },
    {
        icon: LayoutList,
        label: "Disposer votre bibliothèque personnelle en liste",
        value: "list",
    },
    {
        icon: LibraryBig,
        label: "Disposer votre bibliothèque personnelle en étagère",
        value: "shelf",
    },
];

export default function LayoutButtons({
    activeLayout,
    onLayoutChange,
}: LayoutButtonsProps) {
    return (
        <div className="flex items-center justify-center gap-3">
            {LAYOUT_OPTIONS.map(({ icon, label, value }) => (
                <Button
                    key={value}
                    ariaLabel={label}
                    variant="layout"
                    size="xs"
                    icon={icon}
                    onClick={() => onLayoutChange(value)}
                    className={cn(activeLayout === value && "text-foreground")}
                />
            ))}
        </div>
    );
}
