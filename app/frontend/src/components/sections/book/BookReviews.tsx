import { useState } from "react";
import { Book, BookReview, BookReviewSortBy } from "@/types/types";
import BooksSectionLayout from "@/components/sections/book/BookSectionLayout";
import ReviewForm from "@/components/sections/form/ReviewForm";
import ReviewCard from "@/components/sections/book/ReviewCard";
import Modal from "@/components/UI/Modal";
import Button from "@/components/UI/Button/Button";
import SelectReviewSort from "@/components/sections/book/SelectReviewSort";
import Pagination from "@/components/UI/Pagination";
import { useAuthContext } from "@/hooks/auth/useAuthContext";
import { useToast } from "@/hooks/toast/useToast";
import { Pencil, MessageSquare, BookOpen, Heart } from "lucide-react";
import { useBookReviewsData } from "@/hooks/book/review/useBookReviewsData";
import { useMyBookReview } from "@/hooks/book/review/useBookReviewData";
import { useBookReviewMutations } from "@/hooks/book/review/useBookReviewMutations";
import { useBookRecommendationData } from "@/hooks/book/recommendation/useBookRecommendationData";
import { useBookRecommendationMutations } from "@/hooks/book/recommendation/useBookRecommendationMutations";
import { parseGraphQLError } from "@/utils/graphql-error";
import { useLocation } from "react-router-dom";

interface BookReviewsProps {
    book: Book;
    pageLimit?: number;
}

export default function BookReviews({ book, pageLimit = 5 }: BookReviewsProps) {
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
        pageLimit,
        sortBy,
    );
    const { myReview } = useMyBookReview(book.id);
    const { deleteReview, isDeletingReview } = useBookReviewMutations();
    const { bookRecommendation, isLoadingBookRecommendation } = useBookRecommendationData(user ? book.id : undefined);
    const { toggleBookRecommendation, isTogglingBookRecommendation } = useBookRecommendationMutations();

    const hasReviews = (totalCount ?? 0) > 0;
    const hasUserReviewed = !!myReview;
    const isRecommended = !!bookRecommendation;

    const handleToggleRecommendation = async () => {
        try {
            await toggleBookRecommendation(book.id);
        } catch (error) {
            const { title, description } = parseGraphQLError(error, "toggleRecommendation");
            showToast({ type: "error", title, description });
        }
    };

    const handleOpenModal = (review?: BookReview) => {
        setEditingReview(review);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingReview(undefined);
    };

    const handleDeleteReview = async (reviewId: string) => {
        try {
            await deleteReview(reviewId);
            showToast({
                type: "success",
                title: "Critique supprimée",
                description: "Votre critique a été supprimée avec succès.",
            });
        } catch (error) {
            const { title, description } = parseGraphQLError(error, "deleteReview");
            showToast({ type: "error", title, description });
        }
    };

    return (
        <>
            <BooksSectionLayout
                title="Avis et critiques"
                className="items-start"
            >
                {!hasReviews && (
                    <div className="bg-card border-2 border-border rounded-xl p-8 flex flex-col gap-6 w-full">
                        <div className="flex flex-col items-center gap-3 text-center">
                            <BookOpen className="h-10 w-10 text-muted-foreground" />
                            <p className="text-foreground text-lg font-semibold">
                                Aucune critique pour le moment
                            </p>
                            <p className="text-muted-foreground text-sm max-w-sm">
                                Soyez le premier à partager votre ressenti sur ce livre.
                            </p>
                        </div>
                        {user ? (
                            <div className="w-full max-w-2xl mx-auto">
                                <ReviewForm
                                    book={book}
                                    onSuccess={() => { }}
                                    variant="inline"
                                />
                            </div>
                        ) : (
                            <div className="flex justify-center">
                                <Button
                                    ariaLabel="Se connecter à Nuit d'Encre"
                                    variant="primary"
                                    to={`/connexion?redirect=${encodeURIComponent(location.pathname)}`}
                                >
                                    Se connecter pour laisser un avis
                                </Button>
                            </div>
                        )}
                    </div>
                )}
                {hasReviews && (
                    <div className="flex flex-col gap-5 w-full">
                        {user && (
                            <div className="flex justify-end gap-5">
                                <Button
                                    variant={isRecommended ? "secondary" : "outline"}
                                    onClick={handleToggleRecommendation}
                                    ariaLabel={isRecommended ? "Ne plus recommander ce livre" : "Recommander ce livre"}
                                    leftIcon={<Heart />}
                                    loading={isTogglingBookRecommendation}
                                    disabled={isTogglingBookRecommendation || isLoadingBookRecommendation}
                                >
                                    {isRecommended ? "Recommandé" : "Recommander"}
                                </Button>
                                <Button
                                    variant={hasUserReviewed ? "secondary" : "primary"}
                                    onClick={() => handleOpenModal(myReview)}
                                    ariaLabel={
                                        hasUserReviewed
                                            ? "Modifier ma critique"
                                            : "Écrire ma critique"
                                    }
                                    leftIcon={hasUserReviewed ? <Pencil /> : <MessageSquare />}
                                >
                                    {hasUserReviewed
                                        ? "Modifier ma critique"
                                        : "Écrire ma critique"}
                                </Button>
                            </div>
                        )}
                        <div className="flex flex-col gap-5">
                            <SelectReviewSort
                                value={sortBy}
                                onChange={setSortBy}
                            />
                            {isLoadingReviews ? (
                                <p className="text-muted-foreground text-center py-8">
                                    Chargement des critiques...
                                </p>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
                                    {reviews?.map((review) => (
                                        <ReviewCard
                                            key={review.id}
                                            review={review}
                                            onEdit={handleOpenModal}
                                            onDelete={handleDeleteReview}
                                            isDeletingReview={isDeletingReview}
                                        />
                                    ))}
                                </div>
                            )}
                        </div>
                        <Pagination
                            currentPage={page}
                            totalCount={totalCount ?? 0}
                            perPage={pageLimit}
                            onPageChange={setPage}
                        />
                    </div>
                )}
            </BooksSectionLayout>
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
