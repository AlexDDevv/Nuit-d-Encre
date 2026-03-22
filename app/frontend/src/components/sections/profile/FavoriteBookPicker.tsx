import { useQuery, useMutation } from "@apollo/client";
import { SET_FAVORITE_BOOK, GET_USER_FAVORITE_BOOKS } from "@/graphql/user/profile";
import { GET_USER_BOOKS } from "@/graphql/user/userBook";
import { UserBook } from "@/types/types";

interface FavoriteBookPickerProps {
    rank: 1 | 2 | 3;
    userId: string;
    onClose: () => void;
}

export default function FavoriteBookPicker({ rank, userId, onClose }: FavoriteBookPickerProps) {
    const { data } = useQuery(GET_USER_BOOKS, {
        variables: { filters: { limit: 200 } },
    });

    const [setFavoriteBook] = useMutation(SET_FAVORITE_BOOK, {
        refetchQueries: [
            { query: GET_USER_FAVORITE_BOOKS, variables: { userId } },
        ],
        onCompleted: onClose,
    });

    const userBooks: UserBook[] = data?.userBooks?.userBooks ?? [];

    return (
        <div className="fixed inset-0 bg-background/80 flex items-center justify-center z-50">
            <div className="bg-card border border-border rounded-lg p-4 w-full max-w-md max-h-96 flex flex-col">
                <div className="flex justify-between items-center mb-3">
                    <h3 className="font-bold text-foreground">Choisir le favori #{rank}</h3>
                    <button onClick={onClose} className="text-muted-foreground hover:text-foreground text-lg leading-none">✕</button>
                </div>
                <div className="overflow-y-auto flex-1 space-y-2">
                    {userBooks.map((ub) => (
                        <button
                            key={ub.id}
                            onClick={() =>
                                setFavoriteBook({ variables: { userBookId: ub.id, rank } })
                            }
                            className="w-full text-left px-3 py-2 rounded hover:bg-accent transition-colors"
                        >
                            <p className="font-medium text-foreground text-sm">{ub.book.title}</p>
                            <p className="text-xs text-muted-foreground">
                                {ub.book.author.firstname} {ub.book.author.lastname}
                            </p>
                        </button>
                    ))}
                    {userBooks.length === 0 && (
                        <p className="text-sm text-muted-foreground text-center py-4">Aucun livre dans ta bibliothèque</p>
                    )}
                </div>
            </div>
        </div>
    );
}
