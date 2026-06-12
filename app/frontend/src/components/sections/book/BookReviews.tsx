import { useState } from "react";
import { useLocation } from "react-router-dom";
import { FaFeatherPointed, FaLock } from "react-icons/fa6";
import { Book, BookReview, BookReviewSortBy } from "@/types/types";
import ReviewForm from "@/components/sections/form/ReviewForm";
import ReviewCard from "@/components/sections/book/ReviewCard";
import SelectReviewSort from "@/components/sections/book/SelectReviewSort";
import SectionLead from "@/components/sections/book/detail/SectionLead";
import RecommendToggle from "@/components/sections/book/detail/RecommendToggle";
import RatingStars from "@/components/sections/library/UI/RatingStars";
import Button from "@/components/UI/Button/Button";
import Pagination from "@/components/UI/Pagination";
import { useAuthContext } from "@/hooks/auth/useAuthContext";
import { useToast } from "@/hooks/toast/useToast";
import { useBookReviewsData } from "@/hooks/book/review/useBookReviewsData";
import { useMyBookReview } from "@/hooks/book/review/useBookReviewData";
import { useBookReviewMutations } from "@/hooks/book/review/useBookReviewMutations";
import { useBookRecommendationData } from "@/hooks/book/recommendation/useBookRecommendationData";
import { useBookRecommendationMutations } from "@/hooks/book/recommendation/useBookRecommendationMutations";
import { parseGraphQLError } from "@/utils/graphql-error";

interface BookReviewsProps {
    book: Book;
    pageLimit?: number;
}

export default function BookReviews({ book, pageLimit = 6 }: BookReviewsProps) {
    const { user } = useAuthContext();
    const { showToast } = useToast();
    const location = useLocation();

    const [sortBy, setSortBy] = useState<BookReviewSortBy>(
        BookReviewSortBy.HELPFUL,
    );
    const [page, setPage] = useState(1);
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
    const { bookRecommendation, isLoadingBookRecommendation } =
        useBookRecommendationData(user ? book.id : undefined);
    const { toggleBookRecommendation, isTogglingBookRecommendation } =
        useBookRecommendationMutations();

    const hasReviews = (totalCount ?? 0) > 0;
    const hasUserReviewed = !!myReview;
    const isRecommended = !!bookRecommendation;

    const avgRating = book.averageRating ?? null;
    const reviewCount = book.reviewCount ?? 0;
    const recCount = book.recommendationCount ?? 0;
    const loginHref = `/connexion?redirect=${encodeURIComponent(location.pathname)}`;

    const handleToggleRecommendation = async () => {
        try {
            await toggleBookRecommendation(book.id);
        } catch (error) {
            const { title, description } = parseGraphQLError(
                error,
                "toggleRecommendation",
            );
            showToast({ type: "error", title, description });
        }
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

    const handleEdit = (review: BookReview) => setEditingReview(review);
    const handleCancelEdit = () => setEditingReview(undefined);

    return (
        <section>
            <SectionLead
                kicker="La veillée des lecteurs"
                title="Critiques"
                right={
                    hasReviews ? (
                        <SelectReviewSort value={sortBy} onChange={setSortBy} />
                    ) : undefined
                }
            />

            {/* synthèse chiffrée + recommandation */}
            <div className="border-border bg-card/40 mb-6 flex flex-wrap items-center justify-between gap-5 rounded-xl border-2 px-5 py-4">
                <div className="flex items-center gap-4">
                    <div className="flex items-baseline gap-2">
                        <span className="text-foreground font-quote text-[40px] leading-none">
                            {avgRating != null
                                ? avgRating.toFixed(1).replace(".", ",")
                                : "—"}
                        </span>
                        <span className="text-muted-foreground font-body text-[14px]">
                            / 5
                        </span>
                    </div>
                    <div className="flex flex-col gap-1">
                        {avgRating != null ? (
                            <RatingStars value={avgRating} readOnly size="sm" />
                        ) : (
                            <span className="text-muted-foreground font-quote text-[13px] italic">
                                Aucune note pour l'instant
                            </span>
                        )}
                        <span className="text-muted-foreground font-body text-[12.5px]">
                            d'après {reviewCount} critique
                            {reviewCount > 1 ? "s" : ""}
                        </span>
                    </div>
                </div>

                {user && (
                    <div className="flex flex-col items-end gap-1.5">
                        <RecommendToggle
                            on={isRecommended}
                            count={recCount}
                            onToggle={handleToggleRecommendation}
                            disabled={
                                isTogglingBookRecommendation ||
                                isLoadingBookRecommendation
                            }
                        />
                        <span className="text-muted-foreground font-body text-[11.5px]">
                            Conseillez cet ouvrage à la communauté.
                        </span>
                    </div>
                )}
            </div>

            {/* état vide — au-dessus du formulaire */}
            {!hasReviews && (
                <div className="border-border mb-6 flex flex-col items-center gap-3 rounded-xl border-2 border-dashed bg-[hsl(20_3%_14%/0.4)] px-6 py-14 text-center">
                    <span className="ring-primary/25 grid h-12 w-12 place-items-center rounded-full bg-[hsl(43_30%_25%/0.3)] ring-1">
                        <FaFeatherPointed
                            size={18}
                            className="text-primary/70"
                            aria-hidden="true"
                        />
                    </span>
                    <p className="text-foreground/85 font-quote text-[18px] italic">
                        Aucune critique pour l'instant.
                    </p>
                    <p className="text-muted-foreground max-w-[40ch] font-body text-[13px]">
                        Cet ouvrage attend sa première veillée.{" "}
                        {user
                            ? "Soyez la première plume à en parler."
                            : "Connectez-vous pour être la première plume à en parler."}
                    </p>
                </div>
            )}

            {/* écrire / éditer sa critique */}
            {editingReview ? (
                <ReviewForm
                    book={book}
                    existingReview={editingReview}
                    onSuccess={handleCancelEdit}
                    onCancel={handleCancelEdit}
                />
            ) : user ? (
                !hasUserReviewed && <ReviewForm book={book} />
            ) : (
                <div
                    className="border-primary/30 mb-6 flex flex-col items-start gap-3 rounded-xl border-2 border-dashed bg-[hsl(20_3%_14%/0.5)] px-5 py-5 sm:flex-row sm:items-center sm:justify-between"
                >
                    <p className="text-foreground/85 font-quote inline-flex items-center gap-2.5 text-[15px] italic">
                        <FaLock
                            size={15}
                            className="text-primary/70"
                            aria-hidden="true"
                        />
                        Rejoignez la veillée pour laisser votre critique.
                    </p>
                    <Button
                        variant="primary"
                        size="sm"
                        to={loginHref}
                        ariaLabel="Se connecter pour laisser un avis"
                    >
                        Se connecter
                    </Button>
                </div>
            )}

            {/* liste des critiques */}
            {hasReviews && (
                <>
                    {isLoadingReviews ? (
                        <p className="text-muted-foreground py-8 text-center">
                            Chargement des critiques…
                        </p>
                    ) : (
                        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                            {reviews?.map((review) => (
                                <ReviewCard
                                    key={review.id}
                                    review={review}
                                    onEdit={handleEdit}
                                    onDelete={handleDeleteReview}
                                    isDeletingReview={isDeletingReview}
                                />
                            ))}
                        </div>
                    )}
                    <Pagination
                        className="mx-auto mt-6 w-max"
                        currentPage={page}
                        totalCount={totalCount ?? 0}
                        perPage={pageLimit}
                        onPageChange={setPage}
                    />
                </>
            )}
        </section>
    );
}
