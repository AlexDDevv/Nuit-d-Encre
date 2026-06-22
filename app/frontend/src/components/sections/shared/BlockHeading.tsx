import { IconType } from "react-icons";

/**
 * Editorial block heading: icon medallion + gilded eyebrow + title.
 * Shared by the major sections of "document" pages (Contact, etc.).
 */
export default function BlockHeading({
    icon: Icon,
    eyebrow,
    title,
}: {
    icon: IconType;
    eyebrow?: string;
    title: string;
}) {
    return (
        <div className="flex items-center gap-4">
            <span className="border-primary/30 bg-primary/[0.06] text-primary grid size-12 shrink-0 place-items-center rounded-xl border-2">
                <Icon size={22} strokeWidth={1.9} />
            </span>
            <div className="min-w-0">
                {eyebrow && (
                    <span className="text-primary/70 font-mono text-xs font-semibold tracking-[0.2em]">
                        {eyebrow}
                    </span>
                )}
                <h2 className="text-foreground font-title text-2xl font-bold leading-tight md:text-3xl">
                    {title}
                </h2>
            </div>
        </div>
    );
}
