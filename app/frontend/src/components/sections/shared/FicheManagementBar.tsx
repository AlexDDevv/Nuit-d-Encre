import { cn } from "@/lib/utils";
import Button from "@/components/UI/Button/Button";

export default function FicheManagementBar({
    canEdit,
    canDelete,
    editTo,
    editLabel,
    editAriaLabel,
    onDelete,
    isDeleting,
    deleteAriaLabel,
    className,
}: {
    canEdit: boolean;
    canDelete: boolean;
    editTo: string;
    editLabel: string;
    editAriaLabel: string;
    onDelete: () => void;
    isDeleting: boolean;
    deleteAriaLabel: string;
    className?: string;
}) {
    if (!canEdit && !canDelete) return null;
    return (
        <section
            className={cn(
                "flex items-center justify-between border-t border-[hsl(0_0%_100%/0.06)] pt-6",
                className,
            )}
        >
            <span className="text-muted-foreground font-mono text-xxs uppercase tracking-[0.2em]">
                Gestion de la fiche · propriétaire ou administrateur
            </span>
            <div className="flex flex-wrap gap-3">
                {canEdit && (
                    <Button
                        ariaLabel={editAriaLabel}
                        to={editTo}
                        variant="outline"
                        size="sm"
                    >
                        {editLabel}
                    </Button>
                )}
                {canDelete && (
                    <Button
                        ariaLabel={deleteAriaLabel}
                        variant="destructive"
                        size="sm"
                        onClick={onDelete}
                        loading={isDeleting}
                        disabled={isDeleting}
                    >
                        Supprimer
                    </Button>
                )}
            </div>
        </section>
    );
}
