import { IconType } from "react-icons";

export type ContactStat = {
    icon: IconType;
    value: string;
    label: string;
};

export type FaqEntry = {
    q: string;
    a: string;
};

export type UsefulLink = {
    icon: IconType;
    label: string;
    href: string;
    /** Internal route (react-router) rather than an anchor / external link. */
    internal?: boolean;
    /** Flags a "sister page" (another page of the same documentary universe). */
    sister?: boolean;
};
