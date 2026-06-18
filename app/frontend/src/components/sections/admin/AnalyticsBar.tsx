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
                        className="group flex items-center gap-3.5 rounded-xl border-2 border-border bg-card px-4 py-3.5 transition-all duration-200 hover:border-primary/45 hover:shadow-[0_0_24px_-8px_hsl(43_59%_60%/0.3)]"
                    >
                        <span className="grid h-11 w-11 shrink-0 place-items-center rounded-lg border-2 border-border bg-popover text-primary/80 transition-colors duration-200 group-hover:border-primary/45 group-hover:text-primary">
                            <Icon size={20} />
                        </span>
                        <div className="min-w-0 leading-none">
                            <div className="font-title text-[26px] font-black tracking-tight text-foreground">
                                {loading || value === undefined ? (
                                    <Skeleton className="inline-block h-6 w-12 align-middle" />
                                ) : (
                                    value.toLocaleString("fr-FR")
                                )}
                            </div>
                            <div className="mt-1 font-body text-[11px] font-bold uppercase tracking-[0.14em] text-muted-foreground">
                                {stat.label}
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
