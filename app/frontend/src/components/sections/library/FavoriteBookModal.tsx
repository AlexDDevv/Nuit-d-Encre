import { useMutation } from "@apollo/client";
import { SET_FAVORITE_BOOK, REMOVE_FAVORITE_BOOK } from "@/graphql/user/profile";
import Modal from "@/components/UI/Modal";
import Button from "@/components/UI/Button/Button";
import { cn } from "@/lib/utils";
import { FavoriteBookModalProps } from "@/types/types";

const PODIUM = [
    { rank: 2 as const, height: "h-16", label: "2ème" },
    { rank: 1 as const, height: "h-24", label: "1er" },
    { rank: 3 as const, height: "h-12", label: "3ème" },
];

export default function FavoriteBookModal({
    isOpen,
    onClose,
    userBookId,
    isFavorite,
    favoriteRank,
}: FavoriteBookModalProps) {
    const [setFavoriteBook] = useMutation(SET_FAVORITE_BOOK, {
        refetchQueries: ["UserBooks"],
        onCompleted: onClose,
    });

    const [removeFavoriteBook] = useMutation(REMOVE_FAVORITE_BOOK, {
        refetchQueries: ["UserBooks"],
        onCompleted: onClose,
    });

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Favoris">
            <div className="flex flex-col items-center gap-8">
                <p className="text-muted-foreground">
                    Choisissez la place de ce livre sur votre podium de favoris.
                </p>
                <div className="flex items-end justify-center gap-3">
                    {PODIUM.map(({ rank, height, label }) => (
                        <button
                            key={rank}
                            type="button"
                            onClick={() =>
                                setFavoriteBook({ variables: { userBookId, rank } })
                            }
                            aria-label={`Placer en ${label} position`}
                            className={cn(
                                "flex w-20 cursor-pointer flex-col items-center justify-end rounded-t-md border-2 pb-3 transition-all",
                                height,
                                favoriteRank === rank
                                    ? "border-primary bg-secondary text-primary"
                                    : "border-border bg-card text-muted-foreground hover:border-primary hover:bg-muted hover:text-foreground",
                            )}
                        >
                            <span className="text-lg font-bold">{label}</span>
                        </button>
                    ))}
                </div>
                {isFavorite && (
                    <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => removeFavoriteBook({ variables: { userBookId } })}
                        ariaLabel="Retirer ce livre des favoris"
                        fullWidth
                    >
                        Retirer des favoris
                    </Button>
                )}
            </div>
        </Modal>
    );
}
