import { useState } from "react";
import { useQuery, useMutation } from "@apollo/client";
import { GET_USER_FAVORITE_BOOKS, REMOVE_FAVORITE_BOOK } from "@/graphql/user/profile";
import { UserBook } from "@/types/types";
import FavoriteBookPicker from "./FavoriteBookPicker";

interface FavoriteBooksSectionProps {
    userId: string;
    isOwner: boolean;
}

const RANKS = [1, 2, 3] as const;

export default function FavoriteBooksSection({ userId, isOwner }: FavoriteBooksSectionProps) {
    const [pickerRank, setPickerRank] = useState<1 | 2 | 3 | null>(null);

    const { data } = useQuery(GET_USER_FAVORITE_BOOKS, {
        variables: { userId },
    });

    const [removeFavoriteBook] = useMutation(REMOVE_FAVORITE_BOOK, {
        refetchQueries: [{ query: GET_USER_FAVORITE_BOOKS, variables: { userId } }],
    });

    const favorites: UserBook[] = data?.getUserFavoriteBooks ?? [];
    const byRank = (rank: number) => favorites.find((f) => f.favoriteRank === rank);

    return (
        <div className="bg-card rounded-lg p-4 border border-border">
            <h2 className="font-bold text-foreground mb-4">Livres favoris</h2>

            <div className="flex gap-4 justify-center">
                {RANKS.map((rank) => {
                    const fav = byRank(rank);
                    return (
                        <div key={rank} className="flex flex-col items-center gap-2 w-28">
                            <span className="text-xs text-muted-foreground font-medium">#{rank}</span>
                            <div className="w-full aspect-[2/3] bg-accent rounded flex items-center justify-center overflow-hidden border border-border">
                                {fav ? (
                                    <div className="text-center p-2">
                                        <p className="text-xs font-medium text-foreground leading-tight line-clamp-3">
                                            {fav.book.title}
                                        </p>
                                        <p className="text-xs text-muted-foreground mt-1">
                                            {fav.book.author.firstname} {fav.book.author.lastname}
                                        </p>
                                    </div>
                                ) : isOwner ? (
                                    <button
                                        onClick={() => setPickerRank(rank)}
                                        className="text-muted-foreground text-2xl hover:text-primary transition-colors"
                                        title="Ajouter un favori"
                                    >
                                        +
                                    </button>
                                ) : (
                                    <span className="text-xs text-muted-foreground">—</span>
                                )}
                            </div>
                            {isOwner && fav && (
                                <div className="flex gap-2 text-xs">
                                    <button
                                        onClick={() => setPickerRank(rank)}
                                        className="text-primary hover:underline"
                                    >
                                        Changer
                                    </button>
                                    <button
                                        onClick={() =>
                                            removeFavoriteBook({ variables: { userBookId: fav.id } })
                                        }
                                        className="text-destructive hover:underline"
                                    >
                                        Retirer
                                    </button>
                                </div>
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
        </div>
    );
}
