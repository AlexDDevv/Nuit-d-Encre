import { Fragment } from "react";
import { Link } from "react-router-dom";
import Ornament from "@/components/sections/shared/Ornament";
import { USEFUL_LINKS } from "@/data/contact";
import { UsefulLink as UsefulLinkType } from "./types";

const linkClasses =
    "group focus-visible:ring-primary/70 inline-flex items-center gap-2 rounded-md px-2 py-1.5 transition-colors duration-200 focus:outline-none focus-visible:ring-2";

function LinkBody({ link }: { link: UsefulLinkType }) {
    const Icon = link.icon;
    return (
        <>
            <Icon
                size={15}
                className="text-primary/60 group-hover:text-primary transition-colors"
            />
            <span className="text-muted-foreground group-hover:text-foreground group-hover:decoration-primary/70 font-body text-sm font-medium underline decoration-transparent underline-offset-4 transition-all duration-200">
                {link.label}
                {link.sister && (
                    <span className="text-primary/45 ml-1.5 align-middle font-mono text-xxs uppercase tracking-[0.16em]">
                        page sœur
                    </span>
                )}
            </span>
        </>
    );
}

// Internal route (react-router) or anchor / external link.
function UsefulLinkItem({ link }: { link: UsefulLinkType }) {
    if (link.internal) {
        return (
            <Link to={link.href} className={linkClasses}>
                <LinkBody link={link} />
            </Link>
        );
    }
    return (
        <a href={link.href} className={linkClasses}>
            <LinkBody link={link} />
        </a>
    );
}

/** "Useful links" band - gilded rules, diamond separators. */
export default function UsefulLinks() {
    return (
        <div className="grain border-border bg-card/55 relative overflow-hidden rounded-2xl border-2 px-6 py-7 md:px-9 md:py-8">
            <div className="flex flex-col items-center gap-1.5 text-center">
                <Ornament width="w-10" />
                <span className="text-primary/70 mt-1 font-quote text-xs uppercase tracking-[0.28em]">
                    Liens utiles
                </span>
            </div>
            <div className="mt-6 flex flex-wrap items-center justify-center gap-x-1 gap-y-3">
                {USEFUL_LINKS.map((link, i) => (
                    <Fragment key={link.label}>
                        {i > 0 && (
                            <span
                                aria-hidden="true"
                                className="text-primary/35 rotate-45 px-3 text-xxxs leading-none"
                            >
                                ◆
                            </span>
                        )}
                        <UsefulLinkItem link={link} />
                    </Fragment>
                ))}
            </div>
        </div>
    );
}
