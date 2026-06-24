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
                <span className="border-destructive/45 bg-destructive/12 text-destructive grid h-12 w-12 shrink-0 place-items-center rounded-full border-2">
                    <LuTrash2 size={20} />
                </span>
                <div className="flex-1">
                    <h3 className="font-title text-foreground text-xl font-bold">
                        {title}
                    </h3>
                    <div className="font-body text-muted-foreground mt-2 text-sm leading-relaxed">
                        {children}
                    </div>
                    {warning && (
                        <div className="border-warning/45 bg-warning/10 mt-3 flex items-start gap-2.5 rounded-lg border px-3 py-2.5">
                            <LuTriangleAlert
                                size={16}
                                className="text-warning mt-0.5 shrink-0"
                            />
                            <p className="font-body text-sm leading-snug text-[hsl(25_70%_72%)]">
                                {warning}
                            </p>
                        </div>
                    )}
                </div>
            </div>
            <div className="mt-6 flex items-center justify-end gap-3">
                <Button variant="outline" onClick={onCancel} disabled={loading}>
                    Annuler
                </Button>
                <Button
                    variant="destructive"
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
