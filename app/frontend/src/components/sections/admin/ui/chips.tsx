import { cn } from "@/lib/utils";
import { Chipset } from "@/components/UI/Chipset";
import type { UserRole } from "@/types/types";

/** Ornement : filet — losange — filet. */
export function Ornament({
    className = "",
    width = "w-10",
}: {
    className?: string;
    width?: string;
}) {
    return (
        <span
            className={cn(
                "inline-flex items-center gap-2 text-primary/55",
                className,
            )}
            aria-hidden="true"
        >
            <span
                className={cn(
                    "h-px bg-gradient-to-r from-transparent to-primary/55",
                    width,
                )}
            />
            <span className="rotate-45 text-[8px] leading-none">◆</span>
            <span
                className={cn(
                    "h-px bg-gradient-to-l from-transparent to-primary/55",
                    width,
                )}
            />
        </span>
    );
}

const CHIP_TEXT = "px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-[0.1em]";

const ROLE_META: Record<
    UserRole,
    { label: string; cls: string; diamond?: boolean }
> = {
    admin: {
        label: "Administrateur",
        cls: "border-primary/45 bg-primary/15 text-primary",
        diamond: true,
    },
    moderator: {
        label: "Modérateur",
        cls: "border-secondary/70 bg-secondary/45 text-secondary-foreground",
    },
    user: {
        label: "Lecteur",
        cls: "border-border bg-muted/60 text-muted-foreground",
    },
};

/** Pastille de rôle (Administrateur / Modérateur / Lecteur). */
export function RoleChip({ role }: { role: UserRole }) {
    const meta = ROLE_META[role] ?? ROLE_META.user;
    return (
        <Chipset
            ariaLabel={`Rôle : ${meta.label}`}
            rounded
            variant="muted"
            className={cn(CHIP_TEXT, meta.cls)}
        >
            {meta.diamond && <span className="text-[8px] leading-none">◆</span>}
            {meta.label}
        </Chipset>
    );
}

/** Pastille de statut d'une critique (Normal / Signalé). */
export function StatusChip({ signaled = false }: { signaled?: boolean }) {
    return (
        <Chipset
            ariaLabel={signaled ? "Signalé" : "Normal"}
            rounded
            variant="muted"
            className={cn(
                CHIP_TEXT,
                signaled &&
                    "border-warning/55 bg-warning/15 text-[hsl(25_85%_66%)]",
            )}
        >
            <span
                className={cn(
                    "h-1.5 w-1.5 rounded-full",
                    signaled ? "bg-warning" : "bg-muted-foreground/50",
                )}
            />
            {signaled ? "Signalé" : "Normal"}
        </Chipset>
    );
}

const FORMAT_LABELS: Record<string, string> = {
    hardcover: "Relié",
    paperback: "Broché",
    softcover: "Souple",
    pocket: "Poche",
};

/** Pastille de format de livre. */
export function FormatChip({ format }: { format: string }) {
    const label = FORMAT_LABELS[format] ?? format;
    return (
        <Chipset
            ariaLabel={`Format : ${label}`}
            variant="muted"
            className="rounded-md bg-popover/70 px-2 py-0.5 text-[11px] font-bold tracking-wide"
        >
            {label}
        </Chipset>
    );
}

/** Médaillon doré d'une note sur 5. */
export function NoteBadge({ note }: { note: number }) {
    return (
        <span className="inline-flex items-baseline gap-0.5 rounded-md border border-primary/35 bg-primary/10 px-2 py-0.5 font-title text-primary">
            <span className="text-[15px] font-black leading-none">{note}</span>
            <span className="text-[10px] font-bold text-primary/65">/5</span>
        </span>
    );
}
