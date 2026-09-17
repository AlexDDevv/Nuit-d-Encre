import { useEffect, useState } from "react";
import { useQuery, useMutation } from "@apollo/client";
import { FaStar } from "react-icons/fa6";
import BookCover from "@/components/sections/book/BookCover";
import SearchField from "@/components/sections/shared/fields/SearchField";
import ModalCloseButton from "@/components/UI/ModalCloseButton";
import { PLACE_LABEL } from "@/components/sections/library/favoriteBook/podium";
import {
    SET_FAVORITE_BOOK,
    GET_USER_FAVORITE_BOOKS,
} from "@/graphql/user/profile";
import { GET_USER_BOOKS } from "@/graphql/user/userBook";
import { cn } from "@/lib/utils";
import { FavoriteBookPickerProps, UserBook } from "@/types/types";

/** Modale de choix d'un livre de la bibliothèque pour une place du podium. */
export default function FavoriteBookPicker({
    rank,
    userId,
    onClose,
}: FavoriteBookPickerProps) {
    const [query, setQuery] = useState("");

    const { data, loading: loadingBooks } = useQuery(GET_USER_BOOKS, {
        variables: { filters: { limit: 200 } },
    });

    const [setFavoriteBook, { loading }] = useMutation(SET_FAVORITE_BOOK, {
        refetchQueries: [
            { query: GET_USER_FAVORITE_BOOKS, variables: { userId } },
        ],
        onCompleted: onClose,
    });

    useEffect(() => {
        document.body.style.overflow = "hidden";
        const onKey = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose();
        };
        document.addEventListener("keydown", onKey);
        return () => {
            document.body.style.overflow = "unset";
            document.removeEventListener("keydown", onKey);
        };
    }, [onClose]);

    const userBooks: UserBook[] = data?.userBooks?.userBooks ?? [];
    const filtered = query
        ? userBooks.filter((ub) =>
              ub.book.title.toLowerCase().includes(query.toLowerCase()),
          )
        : userBooks;

    return (
        <div
            className="z-70 fixed inset-0 flex items-center justify-center bg-[hsl(20_3%_7%/0.78)] px-4 backdrop-blur-[3px]"
            onMouseDown={(e) => {
                if (e.target === e.currentTarget) onClose();
            }}
        >
            <div
                role="dialog"
                aria-modal="true"
                aria-labelledby="picker-title"
                className="border-primary/40 max-w-135 bg-popover relative flex max-h-[90vh] w-full flex-col overflow-hidden rounded-2xl border-2 shadow-[0_40px_90px_-28px_hsl(20_3%_2%/0.95),0_0_0_1px_hsl(20_3%_8%)]"
            >
                <ModalCloseButton
                    onClick={onClose}
                    className="absolute right-3.5 top-3.5 z-10"
                />

                {/* en-tête + recherche */}
                <div className="shrink-0 px-5 pt-7 sm:px-8 sm:pt-8">
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
                            id="picker-title"
                            className="text-foreground font-quote text-3xl leading-tight tracking-tight"
                        >
                            Choisir un favori
                        </h2>
                        <p className="font-quote mx-auto mt-2 max-w-sm text-base italic leading-relaxed text-[hsl(20_12%_70%)]">
                            Quel ouvrage prendra la {PLACE_LABEL[rank]} de votre
                            podium{"\u00A0"}?
                        </p>
                    </div>

                    <SearchField
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        onClear={() => setQuery("")}
                        placeholder="Rechercher un titre…"
                        aria-label="Rechercher un titre"
                        wrapperClassName="mt-6"
                    />
                </div>

                {/* liste défilable */}
                <ul className="mt-4 flex min-h-0 flex-1 flex-col gap-2 overflow-y-auto border-t border-dashed border-[hsl(0_0%_100%/0.08)] px-5 py-4 sm:px-8">
                    {filtered.map((ub) => {
                        const author = `${ub.book.author.firstname} ${ub.book.author.lastname}`;
                        const current = ub.favoriteRank === rank;
                        return (
                            <li key={ub.id}>
                                <button
                                    type="button"
                                    disabled={loading || current}
                                    onClick={() =>
                                        setFavoriteBook({
                                            variables: {
                                                userBookId: ub.id,
                                                rank,
                                            },
                                        })
                                    }
                                    className={cn(
                                        "border-border group flex w-full cursor-pointer items-center gap-3.5 rounded-xl border bg-[hsl(20_3%_14%/0.6)] px-3 py-2.5 text-left transition-colors duration-200",
                                        "hover:border-primary/55 focus-visible:ring-primary/60 focus-visible:outline-none focus-visible:ring-2",
                                        "disabled:hover:border-border disabled:cursor-default",
                                        current && "border-primary/40",
                                    )}
                                >
                                    <BookCover
                                        coverUrl={ub.book.coverUrl}
                                        title={ub.book.title}
                                        author={author}
                                        compact
                                        className="border-border aspect-2/3 w-11 shrink-0 rounded-md border"
                                    />
                                    <div className="min-w-0 flex-1">
                                        <p className="text-foreground font-quote group-hover:text-primary truncate text-lg leading-tight transition-colors">
                                            {ub.book.title}
                                        </p>
                                        <p className="font-body mt-0.5 truncate text-xs text-[hsl(20_12%_72%)]">
                                            {author}
                                        </p>
                                        {(ub.book.category?.name ||
                                            ub.book.publishedYear) && (
                                            <p className="font-quote mt-0.5 truncate text-xs italic text-[hsl(43_30%_62%)]">
                                                {[
                                                    ub.book.category?.name,
                                                    ub.book.publishedYear,
                                                ]
                                                    .filter(Boolean)
                                                    .join(" · ")}
                                            </p>
                                        )}
                                    </div>
                                    {ub.favoriteRank && (
                                        <span className="bg-primary text-primary-foreground text-xxs inline-flex shrink-0 items-center gap-0.5 rounded-full px-1.5 py-0.5 font-mono font-medium">
                                            <FaStar
                                                size={10}
                                                aria-hidden="true"
                                            />{" "}
                                            {ub.favoriteRank}
                                        </span>
                                    )}
                                </button>
                            </li>
                        );
                    })}
                    {!loadingBooks && filtered.length === 0 && (
                        <li className="text-muted-foreground font-quote py-8 text-center text-base italic">
                            {userBooks.length === 0
                                ? "Aucun livre dans votre bibliothèque."
                                : "Aucun titre ne correspond."}
                        </li>
                    )}
                </ul>
            </div>
        </div>
    );
}
