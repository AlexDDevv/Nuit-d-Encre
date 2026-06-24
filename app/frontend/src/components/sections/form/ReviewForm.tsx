import { LuSparkles } from "react-icons/lu";
import { FaFeatherPointed } from "react-icons/fa6";
import { useForm, Controller } from "react-hook-form";
import Button from "@/components/UI/Button/Button";
import { Textarea } from "@/components/UI/form/Textarea";
import FormWrapper from "@/components/UI/form/FormWrapper";
import { atelierTextareaClass } from "@/components/sections/shared/atelierField";
import { cn } from "@/lib/utils";
import RatingStars from "@/components/sections/library/UI/RatingStars";
import { Book, BookReview } from "@/types/types";
import { useToast } from "@/hooks/toast/useToast";
import { useBookReviewMutations } from "@/hooks/book/review/useBookReviewMutations";
import { parseGraphQLError } from "@/utils/graphql-error";

interface ReviewFormProps {
    book: Book;
    existingReview?: BookReview;
    onSuccess?: () => void;
    onCancel?: () => void;
}

type ReviewFormData = {
    rating: number;
    reviewText: string;
};

const DETAILED_THRESHOLD = 200;

export default function ReviewForm({
    book,
    existingReview,
    onSuccess,
    onCancel,
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
    const reviewTextValue = watch("reviewText") || "";
    const isDetailed = reviewTextValue.length >= DETAILED_THRESHOLD;

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
                    description:
                        "Votre critique a été mise à jour avec succès.",
                });
            } else {
                await createReview({
                    bookId: book.id,
                    rating: formData.rating,
                    reviewText: formData.reviewText.trim() || undefined,
                });
                showToast({
                    type: "success",
                    title: "Critique publiée !",
                    description: isDetailed
                        ? "Vous avez reçu un bonus d'XP pour votre critique détaillée !"
                        : "Merci d'avoir partagé votre avis !",
                });
            }
            onSuccess?.();
        } catch (error) {
            const { title, description } = parseGraphQLError(
                error,
                isEditing ? "updateReview" : "createReview",
            );
            showToast({ type: "error", title, description });
        }
    };

    return (
        <FormWrapper
            onSubmit={handleSubmit(onSubmit)}
            className="border-primary/30 mb-6 border-2"
        >
            {/* note */}
            <div className="flex flex-col items-end gap-1">
                <div className="flex w-full items-center justify-between">
                    <p className="text-foreground font-title font-bold">
                        Écrire ma critique
                    </p>
                    <div className="flex flex-wrap items-center gap-2">
                        <Controller
                            name="rating"
                            control={control}
                            rules={{
                                required: "Veuillez sélectionner une note",
                                min: {
                                    value: 1,
                                    message:
                                        "La note doit être d'au moins 1 étoile",
                                },
                            }}
                            render={({ field }) => (
                                <RatingStars
                                    value={field.value}
                                    onChange={field.onChange}
                                    size="sm"
                                />
                            )}
                        />
                        <span className="text-foreground font-body text-xs font-medium">
                            Votre note
                        </span>
                    </div>
                </div>
                {errors.rating && (
                    <p className="text-destructive text-xs font-medium">
                        {errors.rating.message}
                    </p>
                )}
            </div>

            {/* texte */}
            <Textarea
                id="reviewText"
                placeholder="Qu'avez-vous ressenti à la lecture de cet ouvrage ?"
                maxLength={5000}
                counter
                className={cn(atelierTextareaClass, "font-quote")}
                errorMessage={errors.reviewText?.message}
                {...register("reviewText", {
                    maxLength: {
                        value: 5000,
                        message:
                            "La critique ne peut pas dépasser 5000 caractères",
                    },
                })}
            />
            <div className="flex items-center gap-4">
                {/* astuce / bonus XP */}
                {isDetailed ? (
                    <div className="bg-primary/10 border-primary/20 flex flex-1 items-center justify-center gap-2 rounded-md border p-3">
                        <LuSparkles className="text-primary h-4 w-4 shrink-0" />
                        <p className="text-primary text-xs font-medium">
                            Vous recevrez un bonus d'XP pour cette critique
                            détaillée !
                        </p>
                    </div>
                ) : (
                    <div className="bg-muted border-border flex flex-1 items-center justify-center gap-2 rounded-md border p-3">
                        <LuSparkles className="text-primary h-4 w-4 shrink-0" />
                        <p className="text-muted-foreground text-xs">
                            <span className="font-medium">Astuce :</span> Les
                            critiques de plus de 200 caractères donnent un bonus
                            d'XP !
                        </p>
                    </div>
                )}

                {/* actions */}
                <div className="flex justify-end gap-3">
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
                        leftIcon={<FaFeatherPointed />}
                    >
                        {isEditing ? "Modifier" : "Publier"}
                    </Button>
                </div>
            </div>
        </FormWrapper>
    );
}
