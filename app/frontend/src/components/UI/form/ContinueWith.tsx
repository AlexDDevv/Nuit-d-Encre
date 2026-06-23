import { ContinueWithProps } from "@/types/types";

/** Séparateur orné : filet doré - losange ◆ - libellé - losange ◆ - filet doré. */
export default function ContinueWith({ label = "ou" }: ContinueWithProps) {
    return (
        <div className="my-5 flex items-center gap-3" aria-hidden="true">
            <span className="to-primary/35 bg-linear-to-r h-px flex-1 from-transparent" />
            <span className="flex items-center gap-1.5">
                <span className="text-primary/45 text-xxxs rotate-45 leading-none">
                    ◆
                </span>
                <span className="font-quote text-muted-foreground/80 text-sm italic">
                    {label}
                </span>
                <span className="text-primary/45 text-xxxs rotate-45 leading-none">
                    ◆
                </span>
            </span>
            <span className="to-primary/35 bg-linear-to-l h-px flex-1 from-transparent" />
        </div>
    );
}
