import { IconType } from "react-icons";
import {
    FaBookOpen,
    FaCircleCheck,
    FaPenToSquare,
    FaFeatherPointed,
    FaThumbsUp,
    FaWandMagicSparkles,
} from "react-icons/fa6";
import { ProfileStats as Stats } from "@/lib/profileActivity";
import { Card, SectionHeading } from "./ProfileUI";

const STAT_META: { key: keyof Stats; label: string; icon: IconType }[] = [
    { key: "added", label: "Livres ajoutés", icon: FaBookOpen },
    { key: "finished", label: "Livres terminés", icon: FaCircleCheck },
    { key: "reviews", label: "Critiques écrites", icon: FaPenToSquare },
    { key: "authors", label: "Auteurs ajoutés", icon: FaFeatherPointed },
    { key: "recommendations", label: "Recommandations", icon: FaThumbsUp },
];

export default function ProfileStats({ stats }: { stats: Stats }) {
    return (
        <section className="fade-up">
            <SectionHeading icon={FaWandMagicSparkles}>
                Statistiques
            </SectionHeading>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
                {STAT_META.map(({ key, label, icon: Icon }) => (
                    <Card
                        key={key}
                        className="group flex flex-col items-center gap-2 p-4 text-center"
                    >
                        <span className="border-border bg-popover text-primary/80 group-hover:border-primary/50 group-hover:text-primary grid h-10 w-10 place-items-center rounded-lg border-2 transition-colors duration-200">
                            <Icon size={18} />
                        </span>
                        <span className="text-foreground font-title text-3xl leading-none font-black">
                            {stats[key].toLocaleString("fr-FR")}
                        </span>
                        <span className="text-muted-foreground text-[12px] font-bold tracking-wide uppercase">
                            {label}
                        </span>
                    </Card>
                ))}
            </div>
        </section>
    );
}
