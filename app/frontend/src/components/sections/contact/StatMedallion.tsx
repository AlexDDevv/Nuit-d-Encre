import { ContactStat } from "./types";

/** Ornamental "figure" medallion — gilded icon + emphasized value. */
export default function StatMedallion({ icon: Icon, value, label }: ContactStat) {
    return (
        <div className="grain group border-border bg-card/60 hover:border-primary/45 relative flex items-center gap-3.5 overflow-hidden rounded-xl border-2 px-4 py-3.5 transition-all duration-200 hover:-translate-y-0.5">
            <span className="border-primary/40 from-primary/20 text-primary group-hover:border-primary/70 grid size-11 shrink-0 place-items-center rounded-full border-2 bg-linear-to-b to-transparent transition-colors duration-200">
                <Icon size={19} strokeWidth={1.8} />
            </span>
            <span className="flex flex-col leading-none">
                <span className="text-gradient-gold font-title text-2xl font-black tabular-nums">
                    {value}
                </span>
                <span className="text-muted-foreground mt-1.5 font-quote text-xs italic">
                    {label}
                </span>
            </span>
        </div>
    );
}
