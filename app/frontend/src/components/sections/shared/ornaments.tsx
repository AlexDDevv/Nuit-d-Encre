import { ReactNode } from "react";
import { LuExternalLink } from "react-icons/lu";
import { cn } from "@/lib/utils";

export function SectionSeparator({ className = "my-12" }: { className?: string }) {
    return (
        <div
            className={cn("flex items-center justify-center gap-4", className)}
            aria-hidden="true"
        >
            <span className="via-primary/25 to-primary/40 h-px flex-1 bg-linear-to-r from-transparent" />
            <span className="text-primary/60 rotate-45 text-xxs leading-none">
                ◆
            </span>
            <span className="via-primary/25 to-primary/40 h-px flex-1 bg-linear-to-l from-transparent" />
        </div>
    );
}

export function MonoEyebrow({
    children,
    className = "",
}: {
    children: ReactNode;
    className?: string;
}) {
    return (
        <span
            className={cn(
                "text-primary/70 inline-flex items-center gap-2 font-mono text-xs font-medium uppercase tracking-[0.34em]",
                className,
            )}
        >
            {children}
        </span>
    );
}

export function GoldLink({
    href,
    external = false,
    children,
}: {
    href: string;
    external?: boolean;
    children: ReactNode;
}) {
    return (
        <a
            href={href}
            target={external ? "_blank" : undefined}
            rel={external ? "noopener noreferrer" : undefined}
            className="group/link text-primary decoration-primary/40 hover:decoration-primary focus-visible:ring-primary/70 focus-visible:ring-offset-background inline-flex items-center gap-1 rounded-sm font-medium underline underline-offset-2 transition-colors duration-200 hover:text-[hsl(43_70%_88%)] focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
        >
            {children}
            {external && (
                <LuExternalLink
                    size={13}
                    className="opacity-60 transition-opacity group-hover/link:opacity-100"
                />
            )}
        </a>
    );
}
