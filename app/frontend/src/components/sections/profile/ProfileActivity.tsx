import { FaPenToSquare } from "react-icons/fa6";
import { UserAction } from "@/types/types";
import {
    describeAction,
    formatRelativeDate,
    sortByRecent,
} from "@/lib/profileActivity";
import { CATEGORY_ICON } from "@/components/sections/shared/activityCategory";
import { Card, SectionHeading } from "./ProfileUI";

const MAX_EVENTS = 8;

export default function ProfileActivity({
    actions,
}: {
    actions: UserAction[];
}) {
    const events = sortByRecent(actions).slice(0, MAX_EVENTS);

    return (
        <section className="fade-up">
            <SectionHeading icon={FaPenToSquare}>
                Activité récente
            </SectionHeading>
            <Card glow={false} className="p-5 md:p-6">
                {events.length === 0 ? (
                    <p className="text-muted-foreground/70 font-quote py-6 text-center text-base italic">
                        Aucune activité pour le moment.
                    </p>
                ) : (
                    <div className="relative">
                        <span className="bg-border absolute bottom-1 left-5 top-1 w-px" />
                        <ul className="flex flex-col gap-5">
                            {events.map((ev, i) => {
                                const { label, kind } = describeAction(ev);
                                const Icon = CATEGORY_ICON[kind];
                                return (
                                    <li
                                        key={i}
                                        className="relative flex items-start gap-4"
                                    >
                                        <span className="border-border bg-popover text-primary/75 relative z-10 grid h-10 w-10 shrink-0 place-items-center rounded-full border-2">
                                            <Icon size={16} />
                                        </span>
                                        <div className="flex-1 pt-0.5">
                                            <p className="text-foreground/90 font-body text-base leading-snug">
                                                {label}
                                            </p>
                                            <div className="mt-1 flex items-center gap-2.5">
                                                {ev.xp > 0 && (
                                                    <span className="border-primary/40 bg-primary/10 text-primary font-title inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-bold">
                                                        +{ev.xp} XP
                                                    </span>
                                                )}
                                                <span className="text-muted-foreground text-xs">
                                                    {formatRelativeDate(
                                                        ev.createdAt,
                                                    )}
                                                </span>
                                            </div>
                                        </div>
                                    </li>
                                );
                            })}
                        </ul>
                    </div>
                )}
            </Card>
        </section>
    );
}
