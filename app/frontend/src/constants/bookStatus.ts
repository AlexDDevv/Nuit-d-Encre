import { UserBookStatusConfig } from "@/types/types";
import { BookmarkPlus, BookOpenCheck, Pause, BookCheck } from "lucide-react";

export const BOOK_STATES: readonly UserBookStatusConfig[] = [
    {
        icon: BookmarkPlus,
        label: "À lire",
        value: "TO_READ",
    },
    {
        icon: BookOpenCheck,
        label: "En cours",
        value: "READING",
    },
    {
        icon: Pause,
        label: "En pause",
        value: "PAUSED",
    },
    {
        icon: BookCheck,
        label: "Lu",
        value: "READ",
    },
] as const;

export const OPEN_STATE_CLASSES =
    "data-[state=open]:ring-2 data-[state=open]:ring-ring data-[state=open]:ring-offset-2";
