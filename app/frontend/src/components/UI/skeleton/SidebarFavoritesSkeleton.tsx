import { Skeleton } from "@/components/UI/skeleton/Skeleton";
import { LuBookOpenCheck } from "react-icons/lu";

interface SidebarFavoritesSkeletonProps {
    collapsed: boolean;
}

export default function SidebarFavoritesSkeleton({
    collapsed,
}: SidebarFavoritesSkeletonProps) {
    return (
        <section aria-label="Livres favoris" className="flex flex-col gap-2 p-4 pb-0">
            {!collapsed && (
                <h2 className="text-popover-foreground flex items-center gap-3 text-sm font-medium">
                    <LuBookOpenCheck className="shrink-0" />
                    <span>Vos livres favoris</span>
                </h2>
            )}
            <div className="flex flex-col gap-1">
                {[1, 2, 3].map((i) => (
                    <Skeleton key={i} className="h-10 w-full rounded-md" />
                ))}
            </div>
        </section>
    );
}
