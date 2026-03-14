import { BookFormat, UserBookStatus } from "@/types/types";

export const formatLabelMap: Record<BookFormat, string> = {
    hardcover: "Livre relié",
    paperback: "Livre broché",
    softcover: "Livre de poche",
    pocket: "Livre de poche",
};

export const languageLabelMap: Record<string, string> = {
    fr: "Français",
    en: "Anglais",
    es: "Espagnol",
    de: "Allemand",
    it: "Italien",
};

export const languageLabelToCode = Object.fromEntries(
    Object.entries(languageLabelMap).map(([code, label]) => [label, code]),
);

export const statusLabelMap: Record<UserBookStatus, string> = {
    TO_READ: "À lire",
    READING: "En cours",
    READ: "Lu",
    PAUSED: "En pause",
};
