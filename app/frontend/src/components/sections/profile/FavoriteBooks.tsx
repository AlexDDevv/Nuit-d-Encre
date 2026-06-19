import { useState } from "react";
import { Link } from "react-router-dom";
import { useQuery, useMutation } from "@apollo/client";
import { FaStar, FaArrowUp, FaArrowDown, FaXmark, FaPlus } from "react-icons/fa6";
import BookCover from "@/components/sections/book/BookCover";
import {
    GET_USER_FAVORITE_BOOKS,
    SET_FAVORITE_BOOK,
    REMOVE_FAVORITE_BOOK,
} from "@/graphql/user/profile";
import { slugify } from "@/lib/utils";
import { UserBook } from "@/types/types";
import { SectionHeading } from "./ProfileUI";
import FavoriteBookPicker from "./FavoriteBookPicker";

interface FavoriteBooksProps {
    userId: string;
    isOwner: boolean;
    editing: boolean;
}

const RANKS = [1, 2, 3] as const;

function Cover({ fav, rank }: { fav: UserBook; rank: number }) {
    const author = `${fav.book.author.firstname} ${fav.book.author.lastname}`.trim();
    return (
        <Link
            to={`/books/${fav.book.id}-${slugify(fav.book.title)}`}
            className="group/cover border-border hover:border-primary/50 relative block aspect-2/3 w-full overflow-hidden rounded-lg border-2 shadow-[0_10px_30px_-12px_hsl(0_0%_0%/0.8)] transition-all duration-200"
        >
            <BookCover
                coverUrl={fav.book.coverUrl}
                title={fav.book.title}
                author={author}
                className="absolute inset-0 h-full w-full"
            />
            <span className="border-primary/25 pointer-events-none absolute inset-1.5 rounded border" />
            <span className="border-primary/70 bg-background/80 text-primary absolute top-2 right-2 grid h-7 w-7 place-items-center rounded-full border-2 font-title text-sm font-black">
                {rank}
            </span>
        </Link>
    );
}

function EmptyCover({
    rank,
    editable,
    onAdd,
}: {
    rank: number;
    editable: boolean;
    onAdd: () => void;
}) {
    const content = (
        <>
            <span className="border-border text-muted-foreground/70 grid h-9 w-9 place-items-center rounded-full border-2">
                {editable ? <FaPlus size={16} /> : <FaStar size={14} />}
            </span>
            <span className="text-muted-foreground/70 font-quote text-sm italic">
                {editable ? "Ajouter un favori" : "Place à pourvoir"}
            </span>
            <span className="text-muted-foreground/40 font-title text-xs font-bold tracking-widest uppercase">
                Rang {rank}
            </span>
        </>
    );
    const base =
        "flex aspect-2/3 w-full flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed border-border/80 bg-popover/40 px-3 text-center transition-colors duration-200";
    return editable ? (
        <button
            type="button"
            onClick={onAdd}
            className={`${base} hover:border-primary/40`}
        >
            {content}
        </button>
    ) : (
        <div className={base}>{content}</div>
    );
}

export default function FavoriteBooks({
    userId,
    isOwner,
    editing,
}: FavoriteBooksProps) {
    const [pickerRank, setPickerRank] = useState<1 | 2 | 3 | null>(null);
    const [busy, setBusy] = useState(false);

    const { data, refetch } = useQuery(GET_USER_FAVORITE_BOOKS, {
        variables: { userId },
    });

    const [setFavoriteBook] = useMutation(SET_FAVORITE_BOOK);
    const [removeFavoriteBook] = useMutation(REMOVE_FAVORITE_BOOK, {
        onCompleted: () => refetch(),
    });

    const favorites: UserBook[] = data?.getUserFavoriteBooks ?? [];
    const byRank = (rank: number) =>
        favorites.find((f) => f.favoriteRank === rank);

    // Permute le contenu de deux rangs adjacents. setFavoriteBook libère
    // le rang ciblé : on réaffecte ensuite le livre déplacé à l'ancien rang,
    // puis on rafraîchit une seule fois à la fin de l'enchaînement.
    const move = async (rank: number, dir: -1 | 1) => {
        const target = rank + dir;
        if (target < 1 || target > 3 || busy) return;
        const current = byRank(rank);
        if (!current) return;
        const other = byRank(target);
        setBusy(true);
        try {
            await setFavoriteBook({
                variables: { userBookId: current.id, rank: target },
            });
            if (other) {
                await setFavoriteBook({
                    variables: { userBookId: other.id, rank },
                });
            }
            await refetch();
        } finally {
            setBusy(false);
        }
    };

    const remove = (userBookId: string) =>
        removeFavoriteBook({ variables: { userBookId } });

    return (
        <section className="fade-up">
            <SectionHeading
                icon={FaStar}
                right={
                    editing && (
                        <span className="text-muted-foreground font-body text-xs italic">
                            Réordonnez vos trois favoris
                        </span>
                    )
                }
            >
                Livres favoris
            </SectionHeading>

            <div className="grid grid-cols-3 items-end gap-3 sm:gap-4">
                {RANKS.map((rank, i) => {
                    const fav = byRank(rank);
                    return (
                        <div
                            key={rank}
                            className={i === 0 ? "sm:-translate-y-2" : ""}
                        >
                            {fav ? (
                                <div className="group relative">
                                    <Cover fav={fav} rank={rank} />
                                    {editing && isOwner && (
                                        <div className="mt-2 flex items-center justify-center gap-1.5">
                                            <button
                                                type="button"
                                                aria-label="Monter dans le classement"
                                                disabled={rank === 1 || busy}
                                                onClick={() => move(rank, -1)}
                                                className="border-border text-foreground hover:border-primary hover:text-primary disabled:hover:border-border disabled:hover:text-foreground grid h-7 w-7 place-items-center rounded-md border-2 transition-colors disabled:opacity-30"
                                            >
                                                <FaArrowUp size={13} />
                                            </button>
                                            <button
                                                type="button"
                                                aria-label="Descendre dans le classement"
                                                disabled={rank === 3 || busy}
                                                onClick={() => move(rank, 1)}
                                                className="border-border text-foreground hover:border-primary hover:text-primary disabled:hover:border-border disabled:hover:text-foreground grid h-7 w-7 place-items-center rounded-md border-2 transition-colors disabled:opacity-30"
                                            >
                                                <FaArrowDown size={13} />
                                            </button>
                                            <button
                                                type="button"
                                                aria-label="Retirer des favoris"
                                                onClick={() => remove(fav.id)}
                                                className="border-destructive/50 text-destructive hover:bg-destructive grid h-7 w-7 place-items-center rounded-md border-2 transition-colors hover:text-white"
                                            >
                                                <FaXmark size={13} />
                                            </button>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <EmptyCover
                                    rank={rank}
                                    editable={editing && isOwner}
                                    onAdd={() => setPickerRank(rank)}
                                />
                            )}
                        </div>
                    );
                })}
            </div>

            {pickerRank && (
                <FavoriteBookPicker
                    rank={pickerRank}
                    userId={userId}
                    onClose={() => setPickerRank(null)}
                />
            )}
        </section>
    );
}
