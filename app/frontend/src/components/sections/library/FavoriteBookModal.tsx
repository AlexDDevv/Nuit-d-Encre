import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useMutation, useQuery } from "@apollo/client";
import {
    FaXmark,
    FaStar,
    FaCrown,
    FaTrashCan,
    FaCheck,
    FaCircleInfo,
    FaArrowRightArrowLeft,
} from "react-icons/fa6";
import {
    SET_FAVORITE_BOOK,
    REMOVE_FAVORITE_BOOK,
    GET_USER_FAVORITE_BOOKS,
} from "@/graphql/user/profile";
import BookCover from "@/components/sections/book/BookCover";
import { useAuthContext } from "@/hooks/auth/useAuthContext";
import { useToast } from "@/hooks/toast/useToast";
import { cn } from "@/lib/utils";
import { FavoriteBookModalProps } from "@/types/types";

type Rank = 1 | 2 | 3;

const ORDINAL: Record<Rank, string> = { 1: "ʳᵉ", 2: "ᵉ", 3: "ᵉ" };
const PLACE_LABEL: Record<Rank, string> = {
    1: "1ʳᵉ place",
    2: "2ᵉ place",
    3: "3ᵉ place",
};

/** Occupant courant d'un socle (ou null si la place est libre). */
type Slot = { userBookId: string; title: string } | null;

/** Dégradés parchemin/or — hiérarchie par luminosité, jamais or/argent/bronze. */
const BASE_GRADIENT: Record<Rank, string> = {
    1: "bg-[linear-gradient(180deg,hsl(43_34%_31%)_0%,hsl(43_30%_21%)_55%,hsl(20_4%_16%)_100%)]",
    2: "bg-[linear-gradient(180deg,hsl(43_27%_27%)_0%,hsl(43_24%_19%)_55%,hsl(20_4%_16%)_100%)]",
    3: "bg-[linear-gradient(180deg,hsl(43_21%_23%)_0%,hsl(43_18%_18%)_55%,hsl(20_3%_16%)_100%)]",
};
const SELECTED_GRADIENT =
    "bg-[linear-gradient(180deg,hsl(43_46%_44%)_0%,hsl(43_38%_30%)_55%,hsl(43_32%_22%)_100%)]";

const HEIGHT: Record<Rank, string> = { 1: "h-37.5", 2: "h-29", 3: "h-23" };
const NUMERAL_COLOR: Record<Rank, string> = {
    1: "text-primary",
    2: "text-[hsl(43_50%_72%)]",
    3: "text-[hsl(43_40%_62%)]",
};

// ── Un socle du podium ────────────────────────────────────────────────────────
function Socle({
    rank,
    selected,
    current,
    occupant,
    bookTitle,
    onPick,
}: {
    rank: Rank;
    selected: boolean;
    current: boolean;
    occupant: Slot;
    bookTitle: string;
    onPick: (rank: Rank) => void;
}) {
    const occName =
        occupant && !selected ? occupant.title : null;
    const numColor = selected ? "text-[hsl(43_59%_21%)]" : NUMERAL_COLOR[rank];

    return (
        <div className="flex w-full flex-col items-center">
            {/* libellé de l'occupant (au-dessus) */}
            <div className="mb-2 flex h-9 flex-col items-center justify-end text-center">
                {selected ? (
                    <span className="border-primary/50 text-primary inline-flex items-center gap-1 whitespace-nowrap rounded-full border bg-[hsl(43_59%_81%/0.16)] px-2 py-0.75 font-body text-[10.5px] font-bold">
                        <FaCheck size={10} aria-hidden="true" /> Ce livre
                    </span>
                ) : occName ? (
                    <span
                        className="max-w-32.5 truncate font-quote text-[11px] italic leading-tight text-[hsl(20_12%_58%)]"
                        title={`Occupée par « ${occName} »`}
                    >
                        occupée par
                        <br />
                        <span className="font-body text-[10.5px] not-italic text-[hsl(43_30%_64%)]">
                            « {occName} »
                        </span>
                    </span>
                ) : (
                    <span className="font-quote text-[11px] italic text-[hsl(20_12%_46%)]">
                        libre
                    </span>
                )}
            </div>

            <button
                type="button"
                onClick={() => onPick(rank)}
                aria-pressed={selected}
                aria-label={`Placer « ${bookTitle} » en ${PLACE_LABEL[rank]}${
                    current ? " (position actuelle)" : ""
                }${
                    occName
                        ? `. Occupée par ${occName}, qui quittera vos favoris`
                        : ""
                }`}
                className={cn(
                    "focus-visible:ring-primary focus-visible:ring-offset-[hsl(20_3%_16%)] group relative flex w-full cursor-pointer flex-col items-center justify-start gap-2 overflow-hidden rounded-t-xl border-2 pt-4 transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
                    HEIGHT[rank],
                    selected
                        ? cn(
                              SELECTED_GRADIENT,
                              "border-t-primary border-x-[hsl(43_59%_81%/0.6)] border-b-transparent shadow-[0_-2px_30px_-6px_hsl(43_59%_60%/0.55),inset_0_1px_0_hsl(43_59%_81%/0.4)]",
                          )
                        : cn(
                              BASE_GRADIENT[rank],
                              "border-[hsl(0_0%_24%)] shadow-[inset_0_1px_0_hsl(43_59%_81%/0.08)] hover:border-t-primary hover:border-x-[hsl(43_59%_81%/0.6)] hover:shadow-[0_-2px_22px_-10px_hsl(43_59%_60%/0.45),inset_0_1px_0_hsl(43_59%_81%/0.12)]",
                          ),
                )}
            >
                {/* emblème */}
                <span
                    className={cn(
                        "grid place-items-center transition-transform duration-200 group-hover:-translate-y-0.5",
                        numColor,
                    )}
                >
                    {rank === 1 ? (
                        <FaCrown size={24} aria-hidden="true" />
                    ) : (
                        <FaStar size={17} aria-hidden="true" />
                    )}
                </span>
                {/* numéral ordinal */}
                <span
                    className={cn(
                        "font-title flex items-start font-black leading-none",
                        rank === 1 ? "text-[40px]" : "text-[34px]",
                        numColor,
                    )}
                >
                    {rank}
                    <span className="font-quote mt-0.5 text-[14px] font-medium">
                        {ORDINAL[rank]}
                    </span>
                </span>
                {/* badge « actuel » */}
                {current && (
                    <span
                        className={cn(
                            "absolute left-1/2 top-1 -translate-x-1/2 rounded-full border bg-[hsl(20_3%_9%/0.55)] px-2 py-px font-mono text-[8.5px] font-medium uppercase tracking-wider",
                            selected
                                ? "border-[hsl(43_59%_21%/0.5)] text-[hsl(43_59%_21%)]"
                                : "border-primary/40 text-primary",
                        )}
                    >
                        actuel
                    </span>
                )}
                {/* veinure de la marche */}
                <span className="pointer-events-none absolute inset-x-0 bottom-0 h-5 bg-[linear-gradient(to_top,hsl(20_3%_6%/0.5),transparent)]" />
            </button>

            {/* libellé de la place (sous le socle) */}
            <p
                className={cn(
                    "font-quote mt-3 text-center text-[14px]",
                    selected ? "text-primary" : "text-[hsl(20_12%_72%)]",
                )}
            >
                {PLACE_LABEL[rank]}
            </p>
        </div>
    );
}

// ── La modale ───────────────────────────────────────────────────────────────
export default function FavoriteBookModal({
    isOpen,
    onClose,
    userBookId,
    book,
    isFavorite,
    favoriteRank,
}: FavoriteBookModalProps) {
    const { user } = useAuthContext();
    const { showToast } = useToast();
    const dialogRef = useRef<HTMLDivElement>(null);

    const [selectedRank, setSelectedRank] = useState<Rank | null>(
        (favoriteRank as Rank) ?? null,
    );

    const refetchQueries = ["UserBooks", "GetUserFavoriteBooks"];
    const [setFavoriteBook, { loading: setting }] = useMutation(
        SET_FAVORITE_BOOK,
        { refetchQueries, awaitRefetchQueries: true },
    );
    const [removeFavoriteBook, { loading: removing }] = useMutation(
        REMOVE_FAVORITE_BOOK,
        { refetchQueries, awaitRefetchQueries: true },
    );
    const loading = setting || removing;

    // Occupants courants du podium (pour signaler les places déjà prises).
    const { data } = useQuery(GET_USER_FAVORITE_BOOKS, {
        variables: { userId: user?.id },
        skip: !isOpen || !user?.id,
        fetchPolicy: "network-only",
    });

    const slots = useMemo<Record<Rank, Slot>>(() => {
        const next: Record<Rank, Slot> = { 1: null, 2: null, 3: null };
        for (const fav of data?.getUserFavoriteBooks ?? []) {
            const rank = fav.favoriteRank as Rank | null;
            if (rank && rank >= 1 && rank <= 3) {
                next[rank] = { userBookId: fav.id, title: fav.book.title };
            }
        }
        return next;
    }, [data]);

    // Resynchronise la sélection à chaque ouverture.
    useEffect(() => {
        if (isOpen) setSelectedRank((favoriteRank as Rank) ?? null);
    }, [isOpen, favoriteRank]);

    // Verrou de défilement + Échap + piège de focus.
    useEffect(() => {
        if (!isOpen) return;
        document.body.style.overflow = "hidden";
        const node = dialogRef.current;
        const focusables = () =>
            node?.querySelectorAll<HTMLElement>(
                'button, [href], input, [tabindex]:not([tabindex="-1"])',
            ) ?? [];
        focusables()[0]?.focus();

        const onKey = (e: KeyboardEvent) => {
            if (e.key === "Escape") {
                e.preventDefault();
                onClose();
                return;
            }
            if (e.key !== "Tab") return;
            const els = Array.from(focusables());
            if (!els.length) return;
            const first = els[0];
            const last = els[els.length - 1];
            if (e.shiftKey && document.activeElement === first) {
                e.preventDefault();
                last.focus();
            } else if (!e.shiftKey && document.activeElement === last) {
                e.preventDefault();
                first.focus();
            }
        };
        document.addEventListener("keydown", onKey);
        return () => {
            document.body.style.overflow = "unset";
            document.removeEventListener("keydown", onKey);
        };
    }, [isOpen, onClose]);

    const onPick = useCallback((rank: Rank) => setSelectedRank(rank), []);

    const handleValidate = useCallback(async () => {
        const bookTitle = book.title;
        if (selectedRank === (favoriteRank ?? null)) {
            onClose();
            return;
        }
        try {
            if (selectedRank == null) {
                await removeFavoriteBook({ variables: { userBookId } });
                showToast({
                    type: "success",
                    title: "Favoris",
                    description: `« ${bookTitle} » a été retiré de vos favoris.`,
                });
            } else {
                await setFavoriteBook({
                    variables: { userBookId, rank: selectedRank },
                });
                showToast({
                    type: "success",
                    title: "Favoris",
                    description: `« ${bookTitle} » est épinglé en ${PLACE_LABEL[selectedRank]}.`,
                });
            }
            onClose();
        } catch {
            showToast({
                type: "error",
                title: "Erreur",
                description: "La mise à jour de vos favoris a échoué...",
            });
        }
    }, [
        selectedRank,
        favoriteRank,
        userBookId,
        book.title,
        setFavoriteBook,
        removeFavoriteBook,
        showToast,
        onClose,
    ]);

    if (!isOpen) return null;

    const author = `${book.author.firstname} ${book.author.lastname}`;
    const changed = selectedRank !== (favoriteRank ?? null);
    const moved =
        selectedRank != null &&
        favoriteRank != null &&
        selectedRank !== favoriteRank;
    const displaced =
        selectedRank != null &&
        slots[selectedRank] &&
        slots[selectedRank]!.userBookId !== userBookId
            ? slots[selectedRank]!.title
            : null;

    return (
        <div
            className="fixed inset-0 z-[70] flex items-start justify-center overflow-y-auto bg-[hsl(20_3%_7%/0.78)] px-4 py-8 backdrop-blur-[3px] sm:items-center sm:py-10"
            onMouseDown={(e) => {
                if (e.target === e.currentTarget) onClose();
            }}
        >
            <div
                ref={dialogRef}
                role="dialog"
                aria-modal="true"
                aria-labelledby="fav-title"
                aria-describedby="fav-sub"
                className="border-primary/40 relative w-full max-w-135 rounded-2xl border-2 bg-[hsl(20_3%_16%)] shadow-[0_40px_90px_-28px_hsl(20_3%_2%/0.95),0_0_0_1px_hsl(20_3%_8%)]"
            >
                {/* fermeture */}
                <button
                    type="button"
                    onClick={onClose}
                    aria-label="Fermer"
                    className="hover:border-primary/55 hover:text-primary focus-visible:ring-primary absolute right-3.5 top-3.5 z-10 grid h-9 w-9 cursor-pointer place-items-center rounded-full border border-[hsl(0_0%_30%)] bg-[hsl(20_3%_13%/0.6)] text-[hsl(20_12%_70%)] transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2"
                >
                    <FaXmark size={17} aria-hidden="true" />
                </button>

                <div className="px-6 pb-6 pt-7 sm:px-8 sm:pb-7 sm:pt-8">
                    {/* en-tête */}
                    <div className="text-center">
                        <div className="mb-2.5 flex items-center justify-center gap-2.5">
                            <span className="h-px w-7 bg-[hsl(43_59%_81%/0.45)]" />
                            <FaStar
                                size={13}
                                className="text-primary/70"
                                aria-hidden="true"
                            />
                            <span className="h-px w-7 bg-[hsl(43_59%_81%/0.45)]" />
                        </div>
                        <h2
                            id="fav-title"
                            className="text-foreground font-quote text-[30px] leading-tight tracking-tight"
                        >
                            Vos favoris
                        </h2>
                        <p
                            id="fav-sub"
                            className="mx-auto mt-2 max-w-sm font-quote text-[15px] italic leading-relaxed text-[hsl(20_12%_70%)]"
                        >
                            Choisissez la place de ce livre sur votre podium.
                        </p>
                    </div>

                    {/* rappel du livre */}
                    <div className="mx-auto mt-6 flex max-w-sm items-center gap-3.5 rounded-xl border border-[hsl(0_0%_24%)] bg-[hsl(20_3%_14%/0.6)] px-3.5 py-3">
                        <BookCover
                            coverUrl={book.coverUrl}
                            title={book.title}
                            author={author}
                            className="aspect-2/3 w-15 shrink-0 rounded-md border border-[hsl(0_0%_24%)] shadow-[0_10px_22px_-10px_hsl(20_3%_3%/0.9)] sm:w-17"
                        />
                        <div className="min-w-0 flex-1">
                            <p className="text-primary/55 font-mono text-[9.5px] uppercase tracking-[0.18em]">
                                Ouvrage à épingler
                            </p>
                            <h3 className="text-foreground font-quote mt-1 text-[19px] leading-tight">
                                {book.title}
                            </h3>
                            <p className="mt-0.5 font-body text-[12.5px] text-[hsl(20_12%_72%)]">
                                {author}
                            </p>
                            {(book.category?.name || book.publishedYear) && (
                                <p className="font-quote mt-0.5 text-[12px] italic text-[hsl(43_30%_62%)]">
                                    {[
                                        book.category?.name,
                                        book.publishedYear,
                                    ]
                                        .filter(Boolean)
                                        .join(" · ")}
                                </p>
                            )}
                        </div>
                    </div>

                    {/* podium */}
                    <div className="mt-7 rounded-xl border border-[hsl(0_0%_24%)] bg-[radial-gradient(120%_90%_at_50%_0%,hsl(43_18%_17%/0.55),hsl(20_3%_15%/0.2)_70%)] px-3 pb-3 pt-2 sm:px-5">
                        <div className="flex items-end justify-center gap-3 sm:gap-4">
                            {([2, 1, 3] as Rank[]).map((rank) => (
                                <div
                                    key={rank}
                                    className={rank === 1 ? "w-[34%]" : "w-[30%]"}
                                >
                                    <Socle
                                        rank={rank}
                                        selected={selectedRank === rank}
                                        current={favoriteRank === rank}
                                        occupant={slots[rank]}
                                        bookTitle={book.title}
                                        onPick={onPick}
                                    />
                                </div>
                            ))}
                        </div>
                        {/* sol du podium */}
                        <div className="mt-1 h-2 rounded-full bg-[linear-gradient(to_bottom,hsl(43_30%_30%),hsl(43_30%_16%))] shadow-[0_6px_14px_-4px_hsl(20_3%_3%/0.85),inset_0_1px_0_hsl(43_59%_81%/0.16)]" />
                    </div>

                    {/* note de déplacement / aide */}
                    <div className="mt-4 flex items-start justify-center gap-2 text-center">
                        {moved || displaced ? (
                            <FaArrowRightArrowLeft
                                size={13}
                                className="text-primary/55 mt-px shrink-0"
                                aria-hidden="true"
                            />
                        ) : (
                            <FaCircleInfo
                                size={13}
                                className="text-primary/55 mt-px shrink-0"
                                aria-hidden="true"
                            />
                        )}
                        <p className="font-body text-[12px] leading-snug text-[hsl(20_12%_64%)]">
                            {selectedRank == null ? (
                                isFavorite ? (
                                    <>Ce livre ne figurera plus dans vos favoris.</>
                                ) : (
                                    <>
                                        Touchez un socle pour épingler ce livre.
                                        Une place occupée fera quitter l'autre
                                        ouvrage.
                                    </>
                                )
                            ) : displaced ? (
                                <>
                                    Prendra la{" "}
                                    <span className="text-primary">
                                        {PLACE_LABEL[selectedRank]}
                                    </span>{" "}
                                    — «{" "}
                                    <span className="text-primary">
                                        {displaced}
                                    </span>{" "}
                                    » quittera vos favoris.
                                </>
                            ) : moved ? (
                                <>
                                    Sera déplacé de la{" "}
                                    <span className="text-primary">
                                        {PLACE_LABEL[favoriteRank as Rank]}
                                    </span>{" "}
                                    vers la{" "}
                                    <span className="text-primary">
                                        {PLACE_LABEL[selectedRank]}
                                    </span>
                                    .
                                </>
                            ) : (
                                <>
                                    Épinglé en{" "}
                                    <span className="text-primary">
                                        {PLACE_LABEL[selectedRank]}
                                    </span>
                                    . Touchez un autre socle pour le déplacer.
                                </>
                            )}
                        </p>
                    </div>

                    {/* actions */}
                    <div className="mt-6 flex flex-wrap items-center justify-end gap-2.5 border-t border-dashed border-[hsl(0_0%_100%/0.08)] pt-5">
                        {isFavorite && selectedRank != null && (
                            <button
                                type="button"
                                onClick={() => setSelectedRank(null)}
                                disabled={loading}
                                className="border-destructive/40 hover:border-destructive/70 focus-visible:ring-primary inline-flex cursor-pointer items-center gap-2 rounded-lg border px-3.5 py-2 font-body text-[12.5px] font-bold text-[hsl(3_84%_64%)] transition-colors duration-200 hover:bg-[hsl(3_84%_51%/0.1)] focus-visible:outline-none focus-visible:ring-2 disabled:cursor-not-allowed disabled:opacity-60"
                            >
                                <FaTrashCan size={14} aria-hidden="true" />
                                Retirer des favoris
                            </button>
                        )}

                        <button
                            type="button"
                            onClick={handleValidate}
                            disabled={loading || !changed}
                            className="bg-primary text-primary-foreground focus-visible:ring-primary focus-visible:ring-offset-[hsl(20_3%_16%)] inline-flex cursor-pointer items-center justify-center gap-1.5 rounded-lg px-4 py-2 font-body text-[13px] font-bold shadow-[0_14px_32px_-14px_hsl(43_59%_60%/0.6)] transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            <FaCheck size={14} aria-hidden="true" />
                            {loading ? "Validation…" : "Valider"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
