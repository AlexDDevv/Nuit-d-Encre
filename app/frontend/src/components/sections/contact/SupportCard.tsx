import { useRef, useState } from "react";
import { LuCheck, LuCopy, LuMail, LuSendHorizontal } from "react-icons/lu";
import Button from "@/components/UI/Button";
import {
    baseClasses,
    sizeClasses,
    variantClasses,
} from "@/components/UI/Button/Button.styles";
import { GoldLink } from "@/components/sections/shared/ornaments";
import { cn } from "@/lib/utils";

type SupportRow = { k: string; v: string; email?: boolean };

/**
 * Support "desk" card — monospace catalogue notice with email copy and a
 * mail-to shortcut.
 */
export default function SupportCard({
    email,
    delai,
}: {
    email: string;
    delai: string;
}) {
    const [copied, setCopied] = useState(false);
    const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

    const rows: SupportRow[] = [
        { k: "Email support", v: email, email: true },
        { k: "Délai de réponse", v: delai },
    ];

    const copy = async () => {
        try {
            await navigator.clipboard.writeText(email);
        } catch {
            const ta = document.createElement("textarea");
            ta.value = email;
            ta.style.position = "fixed";
            ta.style.opacity = "0";
            document.body.appendChild(ta);
            ta.select();
            try {
                document.execCommand("copy");
            } catch {
                /* clipboard unavailable — ignore */
            }
            document.body.removeChild(ta);
        }
        setCopied(true);
        if (timer.current) clearTimeout(timer.current);
        timer.current = setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="grain border-primary/30 bg-popover/70 relative overflow-hidden rounded-2xl border-2 shadow-[inset_0_1px_0_hsl(43_59%_81%/0.05),0_18px_40px_-24px_hsl(43_59%_40%/0.5)]">
            <div className="border-primary/20 bg-primary/[0.06] flex items-center justify-between gap-3 border-b px-5 py-3">
                <span className="flex items-center gap-2.5">
                    <LuMail size={15} className="text-primary/80" />
                    <span className="text-primary/80 font-mono text-xxs font-semibold uppercase tracking-[0.26em]">
                        Par courriel · Nous écrire
                    </span>
                </span>
                <span className="text-primary/50 rotate-45 text-xxxs leading-none">
                    ◆
                </span>
            </div>

            <dl className="px-5 py-1">
                {rows.map((r) => (
                    <div
                        key={r.k}
                        className="border-border/40 flex flex-col gap-1.5 border-b py-4 last:border-b-0 sm:flex-row sm:items-center sm:justify-between sm:gap-4"
                    >
                        <dt className="text-primary/55 shrink-0 font-mono text-xxs font-medium uppercase tracking-[0.16em]">
                            {r.k}
                        </dt>
                        <dd className="text-foreground/90 font-mono text-xs leading-relaxed">
                            {r.email ? (
                                <GoldLink href={`mailto:${r.v}`}>
                                    {r.v}
                                </GoldLink>
                            ) : (
                                r.v
                            )}
                        </dd>
                    </div>
                ))}
            </dl>

            <div className="border-primary/20 bg-card/40 flex flex-col gap-2.5 border-t px-5 py-4 sm:flex-row">
                <Button
                    variant="outline"
                    onClick={copy}
                    aria-live="polite"
                    leftIcon={copied ? <LuCheck size={16} /> : <LuCopy size={16} />}
                    className={cn(
                        "flex-1 justify-center gap-2 text-sm",
                        copied &&
                            "border-success/60 bg-success/10 hover:bg-success/10 text-[hsl(140_45%_72%)] hover:text-[hsl(140_45%_72%)]",
                    )}
                >
                    {copied ? "Copié ✓" : "Copier l'adresse"}
                </Button>
                <a
                    href={`mailto:${email}`}
                    className={cn(
                        baseClasses,
                        variantClasses.primary,
                        sizeClasses.md,
                        "flex-1 gap-2 text-sm",
                    )}
                >
                    <LuSendHorizontal size={15} />
                    Écrire un courrier
                </a>
            </div>
        </div>
    );
}
