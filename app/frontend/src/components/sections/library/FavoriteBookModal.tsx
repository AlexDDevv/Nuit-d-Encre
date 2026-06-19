import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useMutation, useQuery } from "@apollo/client";
import { FaXmark, FaStar, FaTrashCan, FaCheck } from "react-icons/fa6";
import {
    SET_FAVORITE_BOOK,
    REMOVE_FAVORITE_BOOK,
    GET_USER_FAVORITE_BOOKS,
} from "@/graphql/user/profile";
import { useAuthContext } from "@/hooks/auth/useAuthContext";
import { useToast } from "@/hooks/toast/useToast";
import { FavoriteBookModalProps } from "@/types/types";
import { Rank, Slot, PLACE_LABEL } from "./favoriteBook/podium";
import Socle from "./favoriteBook/Socle";
import FavoriteBookReminder from "./favoriteBook/FavoriteBookReminder";
import FavoriteMoveNote from "./favoriteBook/FavoriteMoveNote";

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
            className="fixed inset-0 z-70 flex items-start justify-center overflow-y-auto bg-[hsl(20_3%_7%/0.78)] px-4 py-8 backdrop-blur-[3px] sm:items-center sm:py-10"
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
                className="border-primary/40 relative w-full max-w-135 rounded-2xl border-2 bg-popover shadow-[0_40px_90px_-28px_hsl(20_3%_2%/0.95),0_0_0_1px_hsl(20_3%_8%)]"
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
                            className="text-foreground font-quote text-3xl leading-tight tracking-tight"
                        >
                            Vos favoris
                        </h2>
                        <p
                            id="fav-sub"
                            className="mx-auto mt-2 max-w-sm font-quote text-base italic leading-relaxed text-[hsl(20_12%_70%)]"
                        >
                            Choisissez la place de ce livre sur votre podium.
                        </p>
                    </div>

                    {/* rappel du livre */}
                    <FavoriteBookReminder book={book} />

                    {/* podium */}
                    <div className="mt-7 rounded-xl border border-border bg-[radial-gradient(120%_90%_at_50%_0%,hsl(43_18%_17%/0.55),hsl(20_3%_15%/0.2)_70%)] px-3 pb-3 pt-2 sm:px-5">
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
                    <FavoriteMoveNote
                        selectedRank={selectedRank}
                        isFavorite={isFavorite}
                        displaced={displaced}
                        moved={moved}
                        favoriteRank={favoriteRank}
                    />

                    {/* actions */}
                    <div className="mt-6 flex flex-wrap items-center justify-end gap-2.5 border-t border-dashed border-[hsl(0_0%_100%/0.08)] pt-5">
                        {isFavorite && selectedRank != null && (
                            <button
                                type="button"
                                onClick={() => setSelectedRank(null)}
                                disabled={loading}
                                className="border-destructive/40 hover:border-destructive/70 focus-visible:ring-primary inline-flex cursor-pointer items-center gap-2 rounded-lg border px-3.5 py-2 font-body text-xs font-bold text-[hsl(3_84%_64%)] transition-colors duration-200 hover:bg-[hsl(3_84%_51%/0.1)] focus-visible:outline-none focus-visible:ring-2 disabled:cursor-not-allowed disabled:opacity-60"
                            >
                                <FaTrashCan size={14} aria-hidden="true" />
                                Retirer des favoris
                            </button>
                        )}

                        <button
                            type="button"
                            onClick={handleValidate}
                            disabled={loading || !changed}
                            className="bg-primary text-primary-foreground focus-visible:ring-primary inline-flex cursor-pointer items-center justify-center gap-1.5 rounded-lg px-4 py-2 font-body text-sm font-bold shadow-[0_14px_32px_-14px_hsl(43_59%_60%/0.6)] transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 focus-visible:ring-offset-popover"
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
