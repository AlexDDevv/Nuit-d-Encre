import { useState } from "react";
import { useQuery, useMutation } from "@apollo/client";
import { FaXmark, FaMagnifyingGlass } from "react-icons/fa6";
import BookCover from "@/components/sections/book/BookCover";
import { SET_FAVORITE_BOOK, GET_USER_FAVORITE_BOOKS } from "@/graphql/user/profile";
import { GET_USER_BOOKS } from "@/graphql/user/userBook";
import { UserBook } from "@/types/types";

interface FavoriteBookPickerProps {
    rank: 1 | 2 | 3;
    userId: string;
    onClose: () => void;
}

export default function FavoriteBookPicker({
    rank,
    userId,
    onClose,
}: FavoriteBookPickerProps) {
    const [query, setQuery] = useState("");

    const { data } = useQuery(GET_USER_BOOKS, {
        variables: { filters: { limit: 200 } },
    });

    const [setFavoriteBook, { loading }] = useMutation(SET_FAVORITE_BOOK, {
        refetchQueries: [
            { query: GET_USER_FAVORITE_BOOKS, variables: { userId } },
        ],
        onCompleted: onClose,
    });

    const userBooks: UserBook[] = data?.userBooks?.userBooks ?? [];
    const filtered = query
        ? userBooks.filter((ub) =>
              ub.book.title.toLowerCase().includes(query.toLowerCase()),
          )
        : userBooks;

    return (
        <div
            className="bg-background/80 fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-sm"
            onClick={onClose}
        >
            <div
                className="border-border bg-popover flex max-h-[80vh] w-full max-w-md flex-col rounded-xl border-2 shadow-2xl"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="border-border flex items-center justify-between gap-3 border-b-2 px-5 py-4">
                    <h3 className="text-foreground font-quote text-lg font-medium tracking-wide">
                        Choisir le favori{" "}
                        <span className="text-primary">#{rank}</span>
                    </h3>
                    <button
                        type="button"
                        onClick={onClose}
                        aria-label="Fermer"
                        className="text-muted-foreground hover:text-foreground hover:bg-muted/60 grid h-8 w-8 place-items-center rounded-lg transition-colors"
                    >
                        <FaXmark size={16} />
                    </button>
                </div>

                <div className="px-5 pt-4">
                    <div className="border-border bg-card focus-within:border-primary/60 flex items-center gap-2 rounded-lg border-2 px-3 py-2 transition-colors">
                        <FaMagnifyingGlass
                            size={13}
                            className="text-muted-foreground"
                        />
                        <input
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            placeholder="Rechercher un titre…"
                            className="text-foreground placeholder:text-muted-foreground/60 w-full bg-transparent text-sm focus:outline-none"
                        />
                    </div>
                </div>

                <div className="flex-1 space-y-1.5 overflow-y-auto p-4">
                    {filtered.map((ub) => (
                        <button
                            key={ub.id}
                            type="button"
                            disabled={loading}
                            onClick={() =>
                                setFavoriteBook({
                                    variables: { userBookId: ub.id, rank },
                                })
                            }
                            className="hover:bg-muted/60 group flex w-full items-center gap-3 rounded-lg px-2 py-2 text-left transition-colors disabled:opacity-50"
                        >
                            <BookCover
                                coverUrl={ub.book.coverUrl}
                                title={ub.book.title}
                                author={`${ub.book.author.firstname} ${ub.book.author.lastname}`}
                                compact
                                className="border-border h-14 w-10 shrink-0 rounded border"
                            />
                            <div className="min-w-0">
                                <p className="text-foreground truncate text-sm font-medium">
                                    {ub.book.title}
                                </p>
                                <p className="text-muted-foreground truncate text-xs">
                                    {ub.book.author.firstname}{" "}
                                    {ub.book.author.lastname}
                                </p>
                            </div>
                        </button>
                    ))}
                    {filtered.length === 0 && (
                        <p className="text-muted-foreground py-6 text-center font-quote text-sm italic">
                            {userBooks.length === 0
                                ? "Aucun livre dans votre bibliothèque."
                                : "Aucun titre ne correspond."}
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
}
