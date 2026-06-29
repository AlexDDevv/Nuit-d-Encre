import { useMemo, useState } from "react";
import { useActivityFeed } from "@/hooks/follow/useActivityFeed";
import FeedTabs from "@/components/sections/feed/FeedTabs";
import FeedFilterBar from "@/components/sections/feed/FeedFilterBar";
import FeedList from "@/components/sections/feed/FeedList";
import DiscoveryBanner from "@/components/sections/feed/DiscoveryBanner";
import { FeedTimelineSkeleton } from "@/components/UI/skeleton/FeedSkeleton";
import Ornament from "@/components/sections/shared/Ornament";
import Button from "@/components/UI/Button";
import { describeFeedEntry } from "@/lib/profileActivity";
import { ActivityFilter, FeedTab } from "@/types/types";

const PAGE = 8;

/**
 * Page « Fil d'activité » : bascule abonnements / communauté, filtres par
 * catégorie et pagination. Sans abonnement, le fil s'ouvre d'office sur la
 * communauté (onglet verrouillé + encart de découverte).
 */
export default function Fil() {
    const [tab, setTab] = useState<FeedTab>("abonnements");
    const [filter, setFilter] = useState<ActivityFilter>("all");
    const [visible, setVisible] = useState(PAGE);

    const { followingEntries, globalEntries, isEmpty, loading } =
        useActivityFeed(tab);

    const forcedEmpty = isEmpty;
    const discovery = forcedEmpty || tab === "communaute";

    const changeTab = (next: FeedTab) => {
        setTab(next);
        setFilter("all");
        setVisible(PAGE);
    };
    const changeFilter = (next: ActivityFilter) => {
        setFilter(next);
        setVisible(PAGE);
    };

    const base = discovery ? globalEntries : followingEntries;
    const filtered = useMemo(
        () =>
            filter === "all"
                ? base
                : base.filter(
                    (entry) => describeFeedEntry(entry).kind === filter,
                ),
        [base, filter],
    );
    const shown = filtered.slice(0, visible);

    const subtitle = forcedEmpty
        ? "À défaut d'abonnements, le fil s'ouvre sur la communauté - un seuil vers d'autres veilleurs."
        : discovery
            ? "Les dernières traces d'encre de tous les lecteurs de Nuit d'Encre."
            : "Les dernières traces d'encre des lecteurs que vous suivez.";

    return (
        <section className="mx-auto w-full max-w-3xl px-4 py-7 md:px-6 md:py-9">
            <div className="mb-7 flex justify-center">
                <FeedTabs
                    value={forcedEmpty ? "communaute" : tab}
                    onChange={changeTab}
                    locked={forcedEmpty}
                />
            </div>

            <div className="mb-7 text-center">
                <Ornament width="w-12" className="mb-3" />
                <h1 className="text-foreground font-quote text-3xl font-medium leading-none md:text-4xl">
                    Fil d'activité
                </h1>
                <p className="text-muted-foreground font-body mx-auto mt-3 max-w-md text-sm leading-relaxed text-pretty">
                    {subtitle}
                </p>
            </div>

            {forcedEmpty && <DiscoveryBanner />}

            <div className="mb-8">
                <FeedFilterBar value={filter} onChange={changeFilter} />
            </div>

            {loading && shown.length === 0 ? (
                <FeedTimelineSkeleton />
            ) : shown.length === 0 ? (
                <div className="flex flex-col items-center gap-3 py-10 text-center">
                    <Ornament width="w-10" />
                    <p className="text-muted-foreground/80 font-quote text-base italic">
                        Aucune trace de cette nature pour l'instant.
                    </p>
                    {filter !== "all" && (
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => changeFilter("all")}
                        >
                            Voir tout le fil
                        </Button>
                    )}
                </div>
            ) : (
                <FeedList
                    entries={shown}
                    discovery={discovery}
                    hasMore={visible < filtered.length}
                    onLoadMore={() => setVisible((v) => v + PAGE)}
                />
            )}

            <footer className="mt-14 flex flex-col items-center gap-3 pb-6 text-center">
                <Ornament />
                <p className="text-muted-foreground/70 font-quote mx-auto max-w-md text-sm italic">
                    « Lire, c'est veiller à côté de quelqu'un. »
                </p>
            </footer>
        </section>
    );
}
