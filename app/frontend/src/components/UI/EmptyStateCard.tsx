import { ReactNode } from "react";
import { cn } from "@/lib/utils";

export default function EmptyStateCard({
    icon,
    title,
    description,
    align = "start",
    iconSize = "sm",
}: {
    icon: ReactNode;
    title: ReactNode;
    description: ReactNode;
    align?: "start" | "center";
    iconSize?: "sm" | "md";
}) {
    const centered = align === "center";
    return (
        <div
            className={cn(
                "border-border flex flex-col gap-3 rounded-xl border-2 border-dashed bg-[hsl(20_3%_14%/0.4)] px-6",
                centered
                    ? "items-center py-16 text-center"
                    : "items-start py-12",
            )}
        >
            <span
                className={cn(
                    "ring-primary/25 grid place-items-center rounded-full bg-[hsl(43_30%_25%/0.3)] ring-1",
                    iconSize === "md" ? "h-12 w-12" : "h-11 w-11",
                )}
            >
                {icon}
            </span>
            <p
                className={cn(
                    "text-foreground/85 font-quote text-[18px] italic",
                    !centered && "leading-snug",
                )}
            >
                {title}
            </p>
            <p
                className={cn(
                    "text-muted-foreground font-body",
                    centered
                        ? "max-w-[44ch] text-[13px]"
                        : "max-w-[46ch] text-[13.5px]",
                )}
            >
                {description}
            </p>
        </div>
    );
}
