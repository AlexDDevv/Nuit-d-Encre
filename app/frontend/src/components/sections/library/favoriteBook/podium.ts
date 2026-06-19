export type Rank = 1 | 2 | 3;

/** Occupant courant d'un socle (ou null si la place est libre). */
export type Slot = { userBookId: string; title: string } | null;

export const PLACE_LABEL: Record<Rank, string> = {
    1: "1ʳᵉ place",
    2: "2ᵉ place",
    3: "3ᵉ place",
};
