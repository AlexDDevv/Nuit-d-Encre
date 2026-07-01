import { useForm } from "react-hook-form";
import Button from "@/components/UI/Button/Button";
import { Textarea } from "@/components/UI/form/Textarea";
import { useToast } from "@/hooks/toast/useToast";
import { useBookReviewCommentMutations } from "@/hooks/book/reviewComment/useBookReviewCommentMutations";
import { parseGraphQLError } from "@/utils/graphql-error";
import { ReviewCommentFormProps } from "@/types/types";

type ReviewCommentFormData = {
    content: string;
};

export default function ReviewCommentForm({
    reviewId,
    onSuccess,
}: ReviewCommentFormProps) {
    const { showToast } = useToast();
    const { createComment, isCreatingComment } =
        useBookReviewCommentMutations();
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<ReviewCommentFormData>({ defaultValues: { content: "" } });

    const onSubmit = async (formData: ReviewCommentFormData) => {
        try {
            await createComment(reviewId, formData.content.trim());
            reset();
            onSuccess?.();
        } catch (error) {
            const { title, description } = parseGraphQLError(
                error,
                "createBookReviewComment",
            );
            showToast({ type: "error", title, description });
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-2">
            <Textarea
                id="commentContent"
                placeholder="Répondre à cette critique..."
                maxLength={500}
                counter
                errorMessage={errors.content?.message}
                {...register("content", {
                    required: "Le commentaire ne peut pas être vide",
                    maxLength: {
                        value: 500,
                        message:
                            "Le commentaire ne peut pas dépasser 500 caractères",
                    },
                })}
            />
            <Button
                type="submit"
                variant="primary"
                size="sm"
                loading={isCreatingComment}
                disabled={isCreatingComment}
                ariaLabel="Publier le commentaire"
                className="self-end"
            >
                Publier
            </Button>
        </form>
    );
}
