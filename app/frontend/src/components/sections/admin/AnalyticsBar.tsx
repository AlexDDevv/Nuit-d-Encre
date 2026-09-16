import type { IconType } from "react-icons";
import {
    LuBookOpen,
    LuFeather,
    LuMessageSquareQuote,
    LuTags,
    LuUsers,
} from "react-icons/lu";
import type { AdminStats } from "@/types/types";
import { Skeleton } from "@/components/UI/skeleton/Skeleton";

type StatDef = { key: keyof AdminStats; label: string; icon: IconType };

const STATS: StatDef[] = [
    { key: "users", label: "Utilisateurs", icon: LuUsers },
    { key: "books", label: "Livres", icon: LuBookOpen },
    { key: "authors", label: "Auteurs", icon: LuFeather },
    { key: "reviews", label: "Critiques", icon: LuMessageSquareQuote },
    { key: "categories", label: "Catégories", icon: LuTags },
];

/** Barre d'analytics permanente : 5 compteurs globaux de la plateforme. */
export function AnalyticsBar({
    stats,
    loading,
}: {
    stats?: AdminStats;
    loading?: boolean;
}) {
    return (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
            {STATS.map((stat) => {
                const Icon = stat.icon;
                const value = stats?.[stat.key];
                return (
                    <div
                        key={stat.key}
                        className="border-border bg-card hover:border-primary/45 group flex items-center gap-2.5 rounded-xl border-2 px-3 py-3 transition-all duration-200 hover:shadow-[0_0_24px_-8px_hsl(43_59%_60%/0.3)] sm:gap-3.5 sm:px-4 sm:py-3.5"
                    >
                        <span className="border-border bg-popover text-primary/80 group-hover:border-primary/45 group-hover:text-primary grid h-9 w-9 shrink-0 place-items-center rounded-lg border-2 transition-colors duration-200 sm:h-11 sm:w-11">
                            <Icon className="size-4 sm:size-5" />
                        </span>
                        <div className="min-w-0 leading-none">
                            <div className="font-title text-foreground text-xl font-black tracking-tight sm:text-3xl">
                                {loading || value === undefined ? (
                                    <Skeleton className="inline-block h-6 w-12 align-middle" />
                                ) : (
                                    value.toLocaleString("fr-FR")
                                )}
                            </div>
                            <div className="font-body text-xxs text-muted-foreground mt-1 truncate font-bold uppercase tracking-widest sm:text-xs sm:tracking-[0.14em]">
                                {stat.label}
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
