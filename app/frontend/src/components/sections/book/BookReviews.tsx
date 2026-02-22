import { useState } from "react";
import { Book, BookReview, BookReviewSortBy } from "@/types/types";
import BooksSectionLayout from "@/components/sections/book/BookSectionLayout";
import ReviewForm from "@/components/sections/form/ReviewForm";
import ReviewCard from "@/components/sections/book/ReviewCard";
import Modal from "@/components/UI/Modal";
import { Button } from "@/components/UI/Button";
import { useAuthContext } from "@/hooks/auth/useAuthContext";
import { useToast } from "@/hooks/toast/useToast";
import { Pencil, MessageSquare } from "lucide-react";
import { useBookReviewsData } from "@/hooks/book/review/useBookReviewsData";
import { useMyBookReview } from "@/hooks/book/review/useBookReviewData";
import { useBookReviewMutations } from "@/hooks/book/review/useBookReviewMutations";
import RatingStars from "../library/UI/RatingStars";
import { useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";

interface BookReviewsProps {
    book: Book;
}

type SortOption = {
    value: BookReviewSortBy;
    label: string;
};

const sortOptions: SortOption[] = [
    { value: BookReviewSortBy.HELPFUL, label: "Plus utiles" },
    { value: BookReviewSortBy.RECENT, label: "Plus récentes" },
    { value: BookReviewSortBy.OLDEST, label: "Plus anciennes" },
    { value: BookReviewSortBy.RATING_HIGH, label: "Note élevée" },
    { value: BookReviewSortBy.RATING_LOW, label: "Note basse" },
];

export default function BookReviews({ book }: BookReviewsProps) {
    const { user } = useAuthContext();
    const { showToast } = useToast();
    const location = useLocation();

    const [sortBy, setSortBy] = useState<BookReviewSortBy>(
        BookReviewSortBy.HELPFUL,
    );
    const [page, setPage] = useState(1);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingReview, setEditingReview] = useState<BookReview | undefined>(
        undefined,
    );

    const { reviews, totalCount, isLoadingReviews } = useBookReviewsData(
        book.id,
        page,
        10,
        sortBy,
    );
    const { myReview } = useMyBookReview(book.id);
    const { deleteReview, isDeletingReview } = useBookReviewMutations();

    const hasReviews = (totalCount ?? 0) > 0;
    const hasUserReviewed = !!myReview;

    const handleOpenModal = (review?: BookReview) => {
        setEditingReview(review);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingReview(undefined);
    };

    const handleDeleteReview = async (reviewId: string) => {
        if (
            !confirm(
                "Êtes-vous sûr de vouloir supprimer votre critique ? Cette action est irréversible.",
            )
        ) {
            return;
        }

        try {
            await deleteReview(reviewId);
            showToast({
                type: "success",
                title: "Critique supprimée",
                description: "Votre critique a été supprimée avec succès.",
            });
        } catch (error) {
            showToast({
                type: "error",
                title: "Erreur",
                description:
                    "Impossible de supprimer votre critique. Veuillez réessayer.",
            });
        }
    };

    return (
        <>
            <BooksSectionLayout
                title="Avis et critiques"
                className="items-start"
            >
                {/* Header with rating summary and action button */}
                {hasReviews && (
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-6">
                            {/* Average rating */}
                            {book.averageRating && (
                                <div className="flex items-center gap-3">
                                    <RatingStars
                                        value={book.averageRating}
                                        readOnly
                                        size="md"
                                    />
                                    <p className="text-foreground text-lg font-semibold">
                                        {book.averageRating.toFixed(1)}/5
                                    </p>
                                </div>
                            )}

                            {/* Review count */}
                            <p className="text-muted-foreground text-sm">
                                Basé sur {totalCount} critique
                                {totalCount && totalCount > 1 ? "s" : ""}
                            </p>
                        </div>

                        {/* Write/Edit review button */}
                        {user && (
                            <Button
                                variant={
                                    hasUserReviewed ? "secondary" : "primary"
                                }
                                onClick={() => handleOpenModal(myReview)}
                                ariaLabel={
                                    hasUserReviewed
                                        ? "Modifier ma critique"
                                        : "Écrire ma critique"
                                }
                            >
                                {hasUserReviewed ? (
                                    <>
                                        <Pencil className="h-4 w-4" />
                                        Modifier ma critique
                                    </>
                                ) : (
                                    <>
                                        <MessageSquare className="h-4 w-4" />
                                        Écrire ma critique
                                    </>
                                )}
                            </Button>
                        )}
                    </div>
                )}

                {/* Empty state with inline form */}
                {!hasReviews && (
                    <div className={cn("bg-card border-border flex flex-col gap-5 rounded-xl border-2 p-6", user && "min-w-135")}>
                        <div className="flex flex-col gap-2">
                            <p className="text-foreground text-lg font-semibold">
                                Ce livre n'a reçu aucune critique pour le
                                moment.
                            </p>
                            <div className="flex items-end gap-2">
                                <p className="text-muted-foreground">
                                    Soyez le premier à partager votre avis !
                                </p>
                                <MessageSquare className="h-5 w-5 text-muted-foreground" />
                            </div>
                        </div>
                        {user ? (
                            <div className="w-full max-w-2xl">
                                <ReviewForm
                                    book={book}
                                    onSuccess={() => {
                                        // Reviews will auto-refresh via refetchQueries
                                    }}
                                    variant="inline"
                                />
                            </div>
                        ) : (
                            <div className="w-full flex justify-end">
                                <Button
                                    ariaLabel="Se connecter à Nuit d'Encre"
                                    children="Se connecter"
                                    variant="primary"
                                    to={`/connexion?redirect=${encodeURIComponent(location.pathname)}`}
                                />
                            </div>
                        )}
                    </div>
                )}

                {/* Reviews list with sorting */}
                {hasReviews && (
                    <>
                        {/* Sort selector */}
                        <div className="flex items-center gap-3">
                            <label
                                htmlFor="sort-reviews"
                                className="text-muted-foreground text-sm font-medium"
                            >
                                Trier par :
                            </label>
                            <select
                                id="sort-reviews"
                                value={sortBy}
                                onChange={(e) =>
                                    setSortBy(e.target.value as BookReviewSortBy)
                                }
                                className="bg-input border-border text-foreground rounded-md border px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                            >
                                {sortOptions.map((option) => (
                                    <option
                                        key={option.value}
                                        value={option.value}
                                    >
                                        {option.label}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Reviews list */}
                        <div className="flex flex-col gap-4">
                            {isLoadingReviews ? (
                                <p className="text-muted-foreground text-center">
                                    Chargement des critiques...
                                </p>
                            ) : (
                                reviews?.map((review) => (
                                    <ReviewCard
                                        key={review.id}
                                        review={review}
                                        onEdit={handleOpenModal}
                                        onDelete={handleDeleteReview}
                                        isDeletingReview={isDeletingReview}
                                    />
                                ))
                            )}
                        </div>

                        {/* Pagination (if needed) */}
                        {totalCount && totalCount > 10 && (
                            <div className="flex items-center justify-center gap-4">
                                <Button
                                    variant="secondary"
                                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                                    disabled={page === 1}
                                    ariaLabel="Page précédente"
                                >
                                    Précédent
                                </Button>
                                <span className="text-muted-foreground text-sm">
                                    Page {page} sur {Math.ceil(totalCount / 10)}
                                </span>
                                <Button
                                    variant="secondary"
                                    onClick={() => setPage((p) => p + 1)}
                                    disabled={page >= Math.ceil(totalCount / 10)}
                                    ariaLabel="Page suivante"
                                >
                                    Suivant
                                </Button>
                            </div>
                        )}
                    </>
                )}
            </BooksSectionLayout>

            {/* Review modal */}
            <Modal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                title={
                    editingReview
                        ? "Modifier ma critique"
                        : "Écrire ma critique"
                }
                size="lg"
            >
                <ReviewForm
                    book={book}
                    existingReview={editingReview}
                    onSuccess={handleCloseModal}
                    onCancel={handleCloseModal}
                    variant="modal"
                />
            </Modal>
        </>
    );
}