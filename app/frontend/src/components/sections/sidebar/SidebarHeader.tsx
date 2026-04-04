import { LuPanelsLeftBottom } from "react-icons/lu";
import Logo from "@/components/UI/Logo";
import Button from "@/components/UI/Button";
import { SidebarHeaderProps } from "@/types/types";

export default function SidebarHeader({
    collapsed,
    onToggle,
}: SidebarHeaderProps) {
    return (
        <div className="flex items-center justify-between gap-3 py-3 px-4 border-b border-border">
            {!collapsed && (
                <Logo to="/books" />
            )}
            <Button
                variant="icon"
                onClick={onToggle}
                ariaLabel={
                    collapsed
                        ? "Étendre la navigation"
                        : "Réduire la navigation"
                }
                aria-expanded={!collapsed}
                icon={<LuPanelsLeftBottom className="text-popover-foreground stroke-1 transition-all duration-200 ease-in-out hover:stroke-2" />}
                className="p-0 flex items-center justify-center"
            />
        </div>
    );
}
