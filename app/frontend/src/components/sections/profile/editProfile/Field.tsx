import { FaCircleExclamation } from "react-icons/fa6";

// — Champ : étiquette ornementale + indice + erreur inline —
export default function Field({
    id,
    label,
    hint,
    error,
    children,
}: {
    id: string;
    label: string;
    hint?: string;
    error?: string;
    children: React.ReactNode;
}) {
    return (
        <div className="flex flex-col gap-1.5">
            <label
                htmlFor={id}
                className="flex items-baseline justify-between gap-3"
            >
                <span className="text-foreground/85 font-quote text-base italic">
                    {label}
                </span>
                {hint && (
                    <span className="text-muted-foreground/70 font-body text-xs tracking-wider uppercase">
                        {hint}
                    </span>
                )}
            </label>
            {children}
            {error && (
                <p
                    role="alert"
                    className="text-destructive flex items-center gap-1.5 font-body text-xs font-bold"
                >
                    <FaCircleExclamation size={13} /> {error}
                </p>
            )}
        </div>
    );
}
