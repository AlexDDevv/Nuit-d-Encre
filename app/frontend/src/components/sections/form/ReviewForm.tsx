import { Button } from "@/components/UI/Button";
import { Textarea } from "@/components/UI/form/Textarea";
import { Label } from "@/components/UI/form/Label";
import FormWrapper from "@/components/UI/form/FormWrapper";
import { Book, BookReview } from "@/types/types";
import { useToast } from "@/hooks/toast/useToast";
import { Sparkles } from "lucide-react";
import { useForm, Controller } from "react-hook-form";
import { useBookReviewMutations } from "@/hooks/book/review/useBookReviewMutations";
import RatingStars from "@/components/sections/library/UI/RatingStars";

interface ReviewFormProps {
    book: Book;
    existingReview?: BookReview;
    onSuccess?: () => void;
    onCancel?: () => void;
    variant?: "inline" | "modal";
}

type ReviewFormData = {
    rating: number;
    reviewText: string;
};

export default function ReviewForm({
    book,
    existingReview,
    onSuccess,
    onCancel,
    variant = "modal",
}: ReviewFormProps) {
    const { showToast } = useToast();
    const { createReview, isCreatingReview, updateReview, isUpdatingReview } =
        useBookReviewMutations();

    const {
        register,
        handleSubmit,
        control,
        watch,
        formState: { errors },
    } = useForm<ReviewFormData>({
        mode: "onBlur",
        defaultValues: {
            rating: existingReview?.rating || 0,
            reviewText: existingReview?.reviewText || "",
        },
    });

    const isLoading = isCreatingReview || isUpdatingReview;
    const isEditing = !!existingReview;

    // Watch reviewText to show XP bonus hints
    const reviewTextValue = watch("reviewText") || "";

    const onSubmit = async (formData: ReviewFormData) => {
        if (formData.rating === 0) {
            showToast({
                type: "error",
                title: "Note requise",
                description: "Veuillez sélectionner une note avant de publier.",
            });
            return;
        }

        try {
            if (isEditing) {
                await updateReview(existingReview.id, {
                    rating: formData.rating,
                    reviewText: formData.reviewText.trim() || undefined,
                });

                showToast({
                    type: "success",
                    title: "Critique modifiée !",
                    description: "Votre critique a été mise à jour avec succès.",
                });
            } else {
                await createReview({
                    bookId: Number(book.id),
                    rating: formData.rating,
                    reviewText: formData.reviewText.trim() || undefined,
                });

                showToast({
                    type: "success",
                    title: "Critique publiée !",
                    description:
                        formData.reviewText.length > 200
                            ? "Vous avez reçu un bonus d'XP pour votre critique détaillée !"
                            : "Merci d'avoir partagé votre avis !",
                });
            }

            onSuccess?.();
        } catch (error) {
            showToast({
                type: "error",
                title: "Erreur",
                description: isEditing
                    ? "Impossible de modifier votre critique. Veuillez réessayer."
                    : "Impossible de publier votre critique. Veuillez réessayer.",
            });
        }
    };

    return (
        <div className="flex flex-col gap-6">
            {/* Book info (only in modal variant) */}
            {variant === "modal" && (
                <div className="flex items-center gap-4">
                    <div className="h-16 w-12 flex-shrink-0">
                        <img
                            src="/images/bookCover.svg"
                            alt={book.title}
                            className="h-full w-full rounded-sm object-cover"
                        />
                    </div>
                    <div>
                        <h3 className="text-foreground font-semibold">
                            {book.title}
                        </h3>
                        <p className="text-muted-foreground text-sm">
                            par {book.author.firstname} {book.author.lastname}
                        </p>
                    </div>
                </div>
            )}

            <FormWrapper onSubmit={handleSubmit(onSubmit)}>
                {/* Rating */}
                <div className="flex flex-col gap-2">
                    <Label htmlFor="rating" required>
                        Votre note
                    </Label>
                    <Controller
                        name="rating"
                        control={control}
                        rules={{
                            required: "Veuillez sélectionner une note",
                            min: {
                                value: 1,
                                message: "La note doit être d'au moins 1 étoile",
                            },
                        }}
                        render={({ field }) => (
                            <RatingStars
                                value={field.value}
                                onChange={field.onChange}
                                size="lg"
                                showValue
                            />
                        )}
                    />
                    {errors.rating && (
                        <p className="text-destructive text-xs font-medium">
                            {errors.rating.message}
                        </p>
                    )}
                </div>

                {/* Review text */}
                <div className="flex flex-col gap-2">
                    <Label htmlFor="reviewText">Votre critique (optionnel)</Label>
                    <Textarea
                        id="reviewText"
                        placeholder="Partagez votre avis sur ce livre..."
                        maxLength={5000}
                        counter
                        className="min-h-32"
                        errorMessage={errors.reviewText?.message}
                        {...register("reviewText", {
                            maxLength: {
                                value: 5000,
                                message:
                                    "La critique ne peut pas dépasser 5000 caractères",
                            },
                        })}
                    />

                    {/* XP bonus hint */}
                    {reviewTextValue.length < 200 && reviewTextValue.length > 0 && (
                        <div className="bg-muted border-border flex items-start gap-2 rounded-md border p-3">
                            <Sparkles className="text-primary mt-0.5 h-4 w-4 flex-shrink-0" />
                            <p className="text-muted-foreground text-xs">
                                <span className="font-medium">Astuce :</span> Les
                                critiques de plus de 200 caractères donnent un
                                bonus d'XP ! (
                                {200 - reviewTextValue.length} caractères restants)
                            </p>
                        </div>
                    )}

                    {reviewTextValue.length >= 200 && (
                        <div className="bg-primary/10 border-primary/20 flex items-start gap-2 rounded-md border p-3">
                            <Sparkles className="text-primary mt-0.5 h-4 w-4 flex-shrink-0" />
                            <p className="text-primary text-xs font-medium">
                                Vous recevrez un bonus d'XP pour cette critique
                                détaillée !
                            </p>
                        </div>
                    )}
                </div>

                {/* Actions */}
                <div className="flex gap-3">
                    {onCancel && (
                        <Button
                            type="button"
                            variant="secondary"
                            onClick={onCancel}
                            disabled={isLoading}
                            ariaLabel="Annuler"
                        >
                            Annuler
                        </Button>
                    )}
                    <Button
                        type="submit"
                        variant="primary"
                        loading={isLoading}
                        disabled={isLoading}
                        ariaLabel={
                            isEditing
                                ? "Modifier ma critique"
                                : "Publier ma critique"
                        }
                        className="flex-1"
                    >
                        {isEditing
                            ? "Modifier ma critique"
                            : "Publier ma critique"}
                    </Button>
                </div>
            </FormWrapper>
        </div>
    );
}