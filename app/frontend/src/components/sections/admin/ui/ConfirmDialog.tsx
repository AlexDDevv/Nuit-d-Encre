import type { ReactNode } from "react";
import { LuTrash2, LuTriangleAlert } from "react-icons/lu";
import Modal from "@/components/UI/Modal";
import Button from "@/components/UI/Button/Button";

type ConfirmDialogProps = {
    open: boolean;
    onCancel: () => void;
    onConfirm: () => void;
    title: string;
    children?: ReactNode;
    confirmLabel?: string;
    warning?: ReactNode;
    loading?: boolean;
};

/**
 * Dialog de confirmation destructive, bâti sur le `Modal` partagé (overlay,
 * fermeture Échap, verrou de scroll) et les boutons `Button` du projet.
 */
export function ConfirmDialog({
    open,
    onCancel,
    onConfirm,
    title,
    children,
    confirmLabel = "Supprimer",
    warning,
    loading = false,
}: ConfirmDialogProps) {
    return (
        <Modal isOpen={open} onClose={onCancel} size="sm">
            <div className="flex items-start gap-4">
                <span className="grid h-12 w-12 shrink-0 place-items-center rounded-full border-2 border-destructive/45 bg-destructive/12 text-destructive">
                    <LuTrash2 size={20} />
                </span>
                <div className="flex-1">
                    <h3 className="font-title text-[19px] font-bold text-foreground">
                        {title}
                    </h3>
                    <div className="mt-2 font-body text-[14px] leading-relaxed text-muted-foreground">
                        {children}
                    </div>
                    {warning && (
                        <div className="mt-3 flex items-start gap-2.5 rounded-lg border border-warning/45 bg-warning/10 px-3 py-2.5">
                            <LuTriangleAlert
                                size={16}
                                className="mt-0.5 shrink-0 text-warning"
                            />
                            <p className="font-body text-[13px] leading-snug text-[hsl(25_70%_72%)]">
                                {warning}
                            </p>
                        </div>
                    )}
                </div>
            </div>
            <div className="mt-6 flex items-center justify-end gap-3">
                <Button
                    variant="outline"
                    size="md"
                    onClick={onCancel}
                    disabled={loading}
                >
                    Annuler
                </Button>
                <Button
                    variant="destructive"
                    size="md"
                    onClick={onConfirm}
                    disabled={loading}
                    loading={loading}
                    leftIcon={<LuTrash2 size={15} />}
                >
                    {confirmLabel}
                </Button>
            </div>
        </Modal>
    );
}
