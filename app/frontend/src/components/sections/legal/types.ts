import type { LegalIconName } from "./icons";

export type FicheRow = {
    k: string;
    v: string;
    email?: boolean;
    link?: string;
};

export type LegalSection = {
    id: string;
    num: string;
    title: string;
    icon: LegalIconName;
    intro?: string;
    ficheLabel?: string;
    fiche?: FicheRow[];
    paras?: string[];
    contact?: string;
};

export type LegalContent = {
    lastUpdate: string;
    contactEmail: string;
    sections: LegalSection[];
};
