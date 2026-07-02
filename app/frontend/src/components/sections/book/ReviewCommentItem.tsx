import { useState } from "react";
import { LuFeather, LuTrash2 } from "react-icons/lu";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";
import Button from "@/components/UI/Button/Button";
import UserLink from "@/components/sections/profile/UserLink";
import { ReviewCommentItemProps } from "@/types/types";

/**
 * Un commentaire à plat sous une critique : identité de l'auteur (UserLink),
 * badge « Auteur de la critique » le cas échéant, texte, puis suppression avec
 * confirmation en ligne pour le propriétaire ou un admin.
 */
export default function ReviewCommentItem({
    comment,
    isReviewAuthor,
    canDelete,
    isDeleting,
    disabled,
    onDelete,
}: ReviewCommentItemProps) {
    const [confirming, setConfirming] = useState(false);

    const timeAgo = formatDistanceToNow(new Date(comment.createdAt), {
        addSuffix: true,
        locale: fr,
    });

    return (
        <li className="relative flex flex-col gap-1.5">
            <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                <UserLink
                    id={comment.user.id}
                    userName={comment.user.userName}
                    size="sm"
                />
                {isReviewAuthor && (
                    <span className="border-primary/35 bg-primary/15 text-primary inline-flex items-center gap-1 rounded-full border px-2 py-px font-mono text-xxs uppercase tracking-[0.16em]">
                        <LuFeather size={9} /> Auteur de la critique
                    </span>
                )}
                <span className="text-muted-foreground/70 font-mono text-xxs">
                    ·{" "}
                    {timeAgo}
                </span>
            </div>

            <p className="text-foreground/80 pl-10 font-body text-sm leading-relaxed whitespace-pre-wrap">
                {comment.content}
            </p>

            {canDelete && !confirming && (
                <div className="pl-10">
                    <Button
                        variant="destructiveGhost"
                        size="xs"
                        onClick={() => setConfirming(true)}
                        disabled={disabled}
                        ariaLabel="Supprimer ce commentaire"
                        leftIcon={<LuTrash2 />}
                    >
                        Supprimer
                    </Button>
                </div>
            )}

            {canDelete && confirming && (
                <div className="border-destructive/40 bg-destructive/10 ml-10 flex flex-wrap items-center gap-3 rounded-lg border px-3 py-2">
                    <span className="text-muted-foreground font-body text-xs">
                        Supprimer ce commentaire ?
                    </span>
                    <div className="ml-auto flex items-center gap-2">
                        <Button
                            variant="text"
                            size="xs"
                            onClick={() => setConfirming(false)}
                            disabled={isDeleting}
                        >
                            Annuler
                        </Button>
                        <Button
                            variant="destructive"
                            size="xs"
                            onClick={() => onDelete(comment.id)}
                            loading={isDeleting}
                            disabled={disabled}
                            ariaLabel="Confirmer la suppression"
                            leftIcon={<LuTrash2 />}
                        >
                            Supprimer
                        </Button>
                    </div>
                </div>
            )}
        </li>
    );
}
