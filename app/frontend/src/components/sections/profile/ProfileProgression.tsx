import { useEffect, useState } from "react";
import { FaAward, FaChevronRight } from "react-icons/fa6";
import { TITLES, MAX_LEVEL, xpForLevel, titleAt } from "@/constants/titles";
import { User } from "@/types/types";
import { Card, SectionHeading } from "./ProfileUI";

function LevelMedallion({ level, pct }: { level: number; pct: number }) {
    const R = 58;
    const C = 2 * Math.PI * R;
    const [draw, setDraw] = useState(0);
    useEffect(() => {
        const t = setTimeout(() => setDraw(pct), 120);
        return () => clearTimeout(t);
    }, [pct]);

    return (
        <div className="relative grid h-37 w-37 shrink-0 place-items-center">
            <svg
                width="148"
                height="148"
                viewBox="0 0 148 148"
                className="absolute -rotate-90"
            >
                <circle
                    cx="74"
                    cy="74"
                    r={R}
                    fill="none"
                    stroke="hsl(0 0% 24%)"
                    strokeWidth="7"
                />
                <circle
                    cx="74"
                    cy="74"
                    r={R}
                    fill="none"
                    stroke="url(#goldArc)"
                    strokeWidth="7"
                    strokeLinecap="round"
                    strokeDasharray={C}
                    strokeDashoffset={C * (1 - draw)}
                    style={{
                        transition:
                            "stroke-dashoffset 1.4s cubic-bezier(.2,.8,.2,1)",
                    }}
                />
                <defs>
                    <linearGradient id="goldArc" x1="0" y1="0" x2="1" y2="1">
                        <stop offset="0%" stopColor="hsl(43 64% 84%)" />
                        <stop offset="100%" stopColor="hsl(36 42% 52%)" />
                    </linearGradient>
                </defs>
            </svg>
            <div className="flex flex-col items-center">
                <span className="text-primary/70 font-quote text-xs tracking-[0.3em] uppercase">
                    Niveau
                </span>
                <span className="text-foreground font-title text-5xl leading-none font-black">
                    {level}
                </span>
            </div>
        </div>
    );
}

function XpBar({ pct }: { pct: number }) {
    const [w, setW] = useState(0);
    useEffect(() => {
        const t = setTimeout(() => setW(pct), 150);
        return () => clearTimeout(t);
    }, [pct]);

    return (
        <div className="xp-shimmer border-border bg-muted/70 relative h-3.5 w-full overflow-hidden rounded-full border">
            <div
                className="h-full rounded-full bg-linear-to-r from-[hsl(38_45%_55%)] via-[hsl(43_60%_78%)] to-[hsl(43_64%_84%)] shadow-[0_0_14px_-1px_hsl(43_59%_70%/0.7)]"
                style={{
                    width: `${w * 100}%`,
                    transition: "width 1.4s cubic-bezier(.2,.8,.2,1)",
                }}
            />
        </div>
    );
}

function TitleFrieze({ level }: { level: number }) {
    return (
        <div className="no-scrollbar -mx-1 overflow-x-auto px-1 pt-9 pb-7">
            <div className="flex w-full min-w-140 items-start">
                {TITLES.map((t, i) => {
                    const status =
                        t.level < level
                            ? "past"
                            : t.level === level
                                ? "current"
                                : "future";
                    const dot =
                        status === "current"
                            ? "h-5 w-5 bg-primary border-primary node-glow"
                            : status === "past"
                                ? "h-3 w-3 bg-primary/70 border-primary/70"
                                : "h-3 w-3 bg-transparent border-border";
                    return (
                        <div
                            key={t.level}
                            className="group relative flex flex-1 flex-col items-center"
                        >
                            {i > 0 && (
                                <span
                                    className={`absolute top-2 left-1/2 h-px w-full ${t.level <= level
                                            ? "bg-primary/55"
                                            : "bg-border"
                                        }`}
                                />
                            )}
                            <span
                                className={`relative z-10 mt-0.5 grid place-items-center rounded-full border-2 transition-all ${dot}`}
                            >
                                {status === "current" && (
                                    <span className="h-1.5 w-1.5 rounded-full bg-primary-foreground" />
                                )}
                            </span>
                            <span
                                className={`mt-2 text-xs font-bold ${status === "future"
                                        ? "text-muted-foreground/55"
                                        : "text-primary/80"
                                    }`}
                            >
                                {t.level}
                            </span>
                            {status === "current" && (
                                <span className="text-foreground/90 mt-0.5 max-w-18.5 text-center font-quote text-xs leading-tight italic">
                                    {t.label}
                                </span>
                            )}
                            <span className="border-border bg-popover text-foreground pointer-events-none absolute -top-9 z-20 rounded-md border px-2 py-1 text-xs whitespace-nowrap opacity-0 shadow-lg transition-opacity duration-150 group-hover:opacity-100">
                                {t.label}
                            </span>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

export default function ProfileProgression({ user }: { user: User }) {
    const need = xpForLevel(user.level);
    const pct = Math.min(user.xp / need, 1);
    const remaining = Math.max(need - user.xp, 0);
    const isMax = user.level >= MAX_LEVEL;
    const title = user.title?.label ?? titleAt(user.level);
    const nextTitle = titleAt(user.level + 1);

    return (
        <Card glow={false} className="fade-up relative overflow-hidden p-5 md:p-7">
            <div className="pointer-events-none absolute -top-16 -right-10 h-64 w-64 rounded-full bg-[radial-gradient(circle,hsl(43_45%_40%/0.22),transparent_70%)]" />
            <SectionHeading icon={FaAward}>Progression</SectionHeading>

            <div className="flex flex-col items-center gap-6 md:flex-row md:items-center md:gap-8">
                <LevelMedallion level={user.level} pct={pct} />

                <div className="w-full flex-1">
                    <div className="mb-3 flex flex-col gap-1 text-center md:flex-row md:items-end md:justify-between md:text-left">
                        <div>
                            <div className="text-muted-foreground font-quote text-xs tracking-[0.25em] uppercase">
                                Titre actuel
                            </div>
                            <div className="text-gradient-gold font-quote text-2xl font-semibold whitespace-nowrap">
                                {title}
                            </div>
                        </div>
                        <div className="text-center md:text-right">
                            <span className="text-foreground font-title text-3xl font-black">
                                {Math.round(pct * 100)}
                            </span>
                            <span className="text-primary/70 font-title text-lg font-bold">
                                {" "}
                                %
                            </span>
                        </div>
                    </div>

                    <XpBar pct={pct} />

                    <div className="mt-2.5 flex flex-wrap items-center justify-between gap-x-4 gap-y-1 text-sm">
                        <span className="text-foreground/90 font-body font-bold whitespace-nowrap">
                            {user.xp.toLocaleString("fr-FR")}{" "}
                            <span className="text-muted-foreground">
                                / {need.toLocaleString("fr-FR")} XP
                            </span>
                        </span>
                        {!isMax ? (
                            <span className="text-muted-foreground inline-flex items-center gap-1.5">
                                <span>Prochain palier</span>
                                <FaChevronRight
                                    size={11}
                                    className="text-primary/60"
                                />
                                <span className="text-foreground/85 font-quote text-base italic">
                                    Niveau {user.level + 1} - {nextTitle}
                                </span>
                            </span>
                        ) : (
                            <span className="text-primary font-quote text-base italic">
                                Palier ultime atteint
                            </span>
                        )}
                    </div>
                    {!isMax && (
                        <div className="text-primary/70 mt-1.5 text-center text-sm md:text-left">
                            Plus que{" "}
                            <span className="font-bold">
                                {remaining.toLocaleString("fr-FR")} XP
                            </span>{" "}
                            pour devenir{" "}
                            <span className="font-quote italic">
                                {nextTitle}
                            </span>
                            .
                        </div>
                    )}
                </div>
            </div>

            <div className="border-border/70 mt-7 border-t-2 pt-5">
                <div className="text-muted-foreground mb-3 flex items-center gap-2 font-quote text-xs tracking-[0.22em] uppercase">
                    L'échelle des dix titres
                </div>
                <TitleFrieze level={user.level} />
            </div>
        </Card>
    );
}
