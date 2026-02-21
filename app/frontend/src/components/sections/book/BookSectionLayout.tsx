import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { BooksSectionLayoutProps } from "@/types/types";

export default function BooksSectionLayout({
    title,
    seeMoreLink,
    className,
    children,
}: BooksSectionLayoutProps) {
    return (
        <section className="flex flex-col gap-10">
            <div className="bg-card flex items-end gap-6 rounded-md p-5 border-border border-2">
                <h3 className="text-muted-foreground font-semibold uppercase tracking-wider">
                    {title}
                </h3>
                {seeMoreLink && (
                    <Link
                        to={seeMoreLink.to}
                        className="text-card-foreground font-semibold italic hover:underline text-sm"
                        aria-label={seeMoreLink.ariaLabel}
                    >
                        Voir plus
                    </Link>
                )}
            </div>
            <div className={cn("flex flex-wrap items-center", className)}>
                {children}
            </div>
        </section>
    );
}