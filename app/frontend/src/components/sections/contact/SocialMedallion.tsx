import { SocialLink } from "@/types/types";

/** Social medallion - gilded badge + label + handle. */
export default function SocialMedallion({
    icon: Icon,
    url,
    label,
    handle,
}: SocialLink) {
    return (
        <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`${label} (s'ouvre dans un nouvel onglet)`}
            className="group grain border-border bg-card/60 hover:border-primary/55 focus-visible:ring-primary/70 focus-visible:ring-offset-background relative flex items-center gap-3 overflow-hidden rounded-xl border-2 px-4 py-3 transition-all duration-200 hover:-translate-y-0.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
        >
            <span className="border-primary/40 from-primary/15 text-primary/85 group-hover:border-primary/75 group-hover:text-primary grid size-11 shrink-0 place-items-center rounded-full border-2 bg-linear-to-b to-transparent transition-all duration-200 group-hover:shadow-[0_0_18px_-4px_hsl(43_59%_70%/0.7)]">
                <Icon size={19} />
            </span>
            <span className="flex min-w-0 flex-col leading-tight">
                <span className="text-foreground/90 group-hover:text-foreground font-body text-sm font-bold transition-colors">
                    {label}
                </span>
                {handle && (
                    <span className="text-muted-foreground group-hover:text-primary/70 truncate font-mono text-xs transition-colors">
                        {handle}
                    </span>
                )}
            </span>
        </a>
    );
}
