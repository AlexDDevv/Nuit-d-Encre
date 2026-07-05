import { cn } from "@/lib/utils";

export default function Diamond({ className }: { className?: string }) {
    return (
        <span className={cn("text-primary/40", className)} aria-hidden="true">
            ◆
        </span>
    );
}
