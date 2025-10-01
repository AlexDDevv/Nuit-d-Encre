import { useMemo } from "react";
import { UserBookStatus } from "@/types/types";
import { BOOK_STATES } from "@/constants/bookStatus";

export function useUserBookStatusMapping() {
    return useMemo(() => {
        const labelToEnum = {} as Record<string, UserBookStatus>;
        const enumToLabel = {} as Record<UserBookStatus, string>;

        for (let i = 0; i < BOOK_STATES.length; i++) {
            const { label, value } = BOOK_STATES[i];
            labelToEnum[label] = value;
            enumToLabel[value] = label;
        }

        return { labelToEnum, enumToLabel };
    }, []);
}
