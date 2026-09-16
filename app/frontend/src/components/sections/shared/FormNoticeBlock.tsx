import { ReactNode } from "react";

/**
 * Notice de catalogue monospace : coque encadrée à filet pointillé, en-tête
 * « Notice technique » + référence, et grille de champs passée en children.
 */
export default function FormNoticeBlock({
    refLabel = "FICHE Nº",
    refValue,
    children,
}: {
    refLabel?: string;
    refValue: ReactNode;
    children: ReactNode;
}) {
    return (
        <div className="grain border-border bg-popover/55 xs:p-4 relative overflow-hidden rounded-xl border-2 p-3 sm:p-5">
            <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0"
                style={{
                    background:
                        "radial-gradient(360px 120px at 50% -10%, hsl(43 45% 55% / 0.10), transparent 70%)",
                }}
            />
            <div className="border-border xs:flex-row xs:items-center xs:justify-between xs:gap-3 relative mb-4 flex flex-col items-start gap-1 border-b border-dashed pb-3">
                <span className="text-primary/75 text-xxs flex items-center gap-2 font-mono font-semibold uppercase tracking-[0.28em]">
                    <span className="text-primary/55 text-xxxs rotate-45 leading-none">
                        ◆
                    </span>{" "}
                    Notice technique
                </span>
                <span className="text-muted-foreground/55 text-xxs font-mono tracking-[0.16em]">
                    {refLabel} {refValue}
                </span>
            </div>
            <div className="relative grid gap-x-5 gap-y-4 sm:grid-cols-2">
                {children}
            </div>
        </div>
    );
}
