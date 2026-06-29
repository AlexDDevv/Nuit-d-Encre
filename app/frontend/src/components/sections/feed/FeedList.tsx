import { Fragment } from "react";
import { LuArrowRight, LuLoader } from "react-icons/lu";
import FeedRow from "./FeedRow";
import FeedTimeSeparator from "./FeedTimeSeparator";
import Ornament from "@/components/sections/shared/Ornament";
import Button from "@/components/UI/Button";
import { timeBucket } from "@/lib/profileActivity";
import { cn } from "@/lib/utils";
import { FeedListProps } from "@/types/types";

/**
 * Le fil chronologique : médaillons reliés par un filet doré (ou profond en
 * découverte), repères temporels intercalés, puis pagination « Charger plus »
 * ou ornement de clôture en fin de liste.
 */
export default function FeedList({
    entries,
    discovery,
    hasMore,
    loadingMore,
    onLoadMore,
}: FeedListProps) {
    let lastBucket = "";

    return (
        <>
            <ol
                className="relative flex flex-col gap-7"
                aria-label={
                    discovery
                        ? "Activité de la communauté"
                        : "Activité des lecteurs suivis"
                }
            >
                <span
                    aria-hidden="true"
                    className={cn(
                        "absolute bottom-4 left-5.25 top-4 w-px",
                        discovery
                            ? "bg-secondary/60"
                            : "from-primary/10 via-primary/35 to-primary/10 bg-linear-to-b",
                    )}
                />
                {entries.map((entry) => {
                    const bucket = timeBucket(entry.createdAt);
                    const showSeparator = bucket.key !== lastBucket;
                    lastBucket = bucket.key;
                    return (
                        <Fragment key={entry.id}>
                            {showSeparator && (
                                <FeedTimeSeparator
                                    label={bucket.label}
                                    discovery={discovery}
                                />
                            )}
                            <FeedRow entry={entry} discovery={discovery} />
                        </Fragment>
                    );
                })}
            </ol>

            {hasMore ? (
                <div className="mt-8 flex justify-center">
                    <Button
                        variant="outline"
                        size="lg"
                        onClick={onLoadMore}
                        disabled={loadingMore}
                        leftIcon={
                            loadingMore ? (
                                <LuLoader size={16} className="animate-spin" />
                            ) : undefined
                        }
                        rightIcon={
                            loadingMore ? undefined : <LuArrowRight size={16} />
                        }
                    >
                        {loadingMore ? "Lecture en cours…" : "Charger plus"}
                    </Button>
                </div>
            ) : (
                entries.length > 0 && (
                    <div className="fade-up mt-9 flex flex-col items-center gap-3 text-center">
                        <Ornament width="w-12" />
                        <p className="text-muted-foreground/70 font-quote text-sm italic">
                            Vous êtes à jour - la nuit reprend son cours.
                        </p>
                    </div>
                )
            )}
        </>
    );
}
