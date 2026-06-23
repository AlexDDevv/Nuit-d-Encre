import { LuCheck, LuX } from "react-icons/lu";
import { cn } from "@/lib/utils";
import { PASSWORD_RULES, passwordScore } from "@/lib/password";
import { PasswordStrengthMeterProps } from "@/types/types";

const TIERS = [
    { at: 0, label: "Trop faible", tone: "text-muted-foreground/60" },
    { at: 2, label: "Faible", tone: "text-destructive" },
    { at: 3, label: "Correct", tone: "text-warning" },
    { at: 4, label: "Solide", tone: "text-primary" },
    { at: 5, label: "Scellé ✓", tone: "text-success" },
];

/** Jauge segmentée + checklist des critères du mot de passe (inscription). */
export default function PasswordStrengthMeter({
    value,
}: PasswordStrengthMeterProps) {
    const score = passwordScore(value);
    const empty = value.length === 0;
    const tier = [...TIERS].reverse().find((t) => score >= t.at) ?? TIERS[0];
    const segmentTone =
        score <= 2
            ? "bg-destructive/70"
            : score === 3
              ? "bg-warning"
              : score === 4
                ? "bg-primary/70"
                : "bg-success";

    return (
        <div className="mt-1 flex flex-col gap-2.5">
            {/* Jauge segmentée */}
            <div className="flex items-center gap-2">
                <div className="flex flex-1 gap-1" aria-hidden="true">
                    {PASSWORD_RULES.map((_, i) => (
                        <span
                            key={i}
                            className={cn(
                                "h-1.5 flex-1 rounded-full transition-all duration-300",
                                i < score ? segmentTone : "bg-border",
                            )}
                        />
                    ))}
                </div>
                <span
                    className={cn(
                        "text-xxs min-w-[68px] text-right font-mono font-semibold uppercase tracking-[0.12em]",
                        empty ? "text-muted-foreground/45" : tier.tone,
                    )}
                >
                    {empty ? "—" : tier.label}
                </span>
            </div>

            {/* Checklist des critères */}
            {value.length > 0 && (
                <ul
                    className="grid gap-1.5 sm:grid-cols-2"
                    aria-label="Critères du mot de passe"
                >
                    {PASSWORD_RULES.map((rule) => {
                        const ok = rule.test(value);
                        return (
                            <li
                                key={rule.id}
                                className="flex items-center gap-2"
                            >
                                <span
                                    className={cn(
                                        "grid h-[18px] w-[18px] shrink-0 place-items-center rounded-full border transition-all duration-200",
                                        ok
                                            ? "border-success/70 bg-success/15 text-success"
                                            : "border-border text-muted-foreground/45",
                                    )}
                                >
                                    {ok ? (
                                        <LuCheck size={11} strokeWidth={3} />
                                    ) : (
                                        <LuX size={10} strokeWidth={2.5} />
                                    )}
                                </span>
                                <span
                                    className={cn(
                                        "font-body text-xs transition-colors duration-200",
                                        ok
                                            ? "text-foreground/85"
                                            : "text-muted-foreground/70",
                                    )}
                                >
                                    {rule.label}
                                </span>
                            </li>
                        );
                    })}
                </ul>
            )}
        </div>
    );
}
