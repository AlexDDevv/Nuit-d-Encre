import { cn } from "@/lib/utils";
import { LuPanelsLeftBottom } from "react-icons/lu";
import Logo from "@/components/UI/Logo";
import Button from "@/components/UI/Button";
import { SidebarHeaderProps } from "@/types/types";

export default function SidebarHeader({
    collapsed,
    onToggle,
}: SidebarHeaderProps) {
    return (
        <div
            className={cn(
                "border-border flex items-center border-b px-4 py-3",
                collapsed ? "justify-center" : "justify-between",
            )}
        >
            <div
                className={cn(
                    "overflow-hidden whitespace-nowrap transition-[max-width] duration-150",
                    collapsed ? "max-w-0" : "max-w-50",
                )}
            >
                <div
                    className={cn(
                        "transition-opacity",
                        collapsed
                            ? "opacity-0 duration-150"
                            : "opacity-100 delay-150 duration-200",
                    )}
                >
                    <Logo to="/books" />
                </div>
            </div>
            <Button
                variant="icon"
                onClick={onToggle}
                ariaLabel={
                    collapsed
                        ? "Étendre la navigation"
                        : "Réduire la navigation"
                }
                aria-expanded={!collapsed}
                icon={
                    <LuPanelsLeftBottom className="text-popover-foreground stroke-1 transition-all duration-200 ease-in-out hover:stroke-2" />
                }
                className="p-0"
            />
        </div>
    );
}
