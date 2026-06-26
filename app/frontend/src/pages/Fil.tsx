import { useActivityFeed } from "@/hooks/follow/useActivityFeed";
import FeedList from "@/components/sections/feed/FeedList";
import FeedSkeleton from "@/components/UI/skeleton/FeedSkeleton";

/** Page « Fil d'activité » : abonnements, avec découverte en repli. */
export default function Fil() {
    const { entries, isEmpty, globalEntries, loading } = useActivityFeed();

    if (loading && entries.length === 0 && globalEntries.length === 0) {
        return <FeedSkeleton />;
    }

    return (
        <section className="mx-auto w-full max-w-2xl p-4">
            <h1 className="text-foreground font-title mb-6 text-2xl">
                Fil d'activité
            </h1>

            {isEmpty ? (
                <div className="flex flex-col gap-5">
                    <div className="border-border bg-card/40 rounded-xl border-2 border-dashed p-5 text-center">
                        <p className="text-muted-foreground text-sm">
                            Vous ne suivez encore personne. Cliquez sur le nom
                            d'un lecteur pour visiter son profil et le suivre.
                        </p>
                    </div>
                    <h2 className="text-muted-foreground text-xs tracking-[0.2em] uppercase">
                        Activité récente de la communauté
                    </h2>
                    <FeedList entries={globalEntries} />
                </div>
            ) : (
                <FeedList entries={entries} />
            )}
        </section>
    );
}
