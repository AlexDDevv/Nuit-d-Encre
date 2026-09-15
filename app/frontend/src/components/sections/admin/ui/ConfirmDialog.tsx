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
            <h3 className="font-title text-foreground text-xl font-bold">
                {title}
            </h3>
            <div className="font-body text-muted-foreground mt-2 text-sm leading-relaxed">
                {children}
            </div>
            {warning && (
                <div className="border-warning/45 bg-warning/10 mt-4 flex items-start gap-2.5 rounded-lg border px-3 py-2.5">
                    <LuTriangleAlert
                        size={16}
                        className="text-warning mt-0.5 shrink-0"
                    />
                    <p className="font-body text-sm leading-snug text-[hsl(25_70%_72%)]">
                        {warning}
                    </p>
                </div>
            )}
            <div className="xs:flex-row mt-6 flex flex-col gap-3">
                <Button
                    variant="outline"
                    onClick={onCancel}
                    disabled={loading}
                    className="xs:flex-auto"
                >
                    Annuler
                </Button>
                <Button
                    variant="destructive"
                    onClick={onConfirm}
                    disabled={loading}
                    loading={loading}
                    className="xs:flex-auto"
                    leftIcon={<LuTrash2 size={15} />}
                >
                    {confirmLabel}
                </Button>
            </div>
        </Modal>
    );
}
