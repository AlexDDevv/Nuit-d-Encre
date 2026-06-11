import { BookSearchResult } from "@/types/types";
import { sourceInfo } from "./previewLabels";

function AbsentCover({ title, source }: { title: string; source: string }) {
    return (
        <div
            className="absolute inset-0 flex flex-col items-center justify-center gap-4 px-6 text-center"
            style={{
                backgroundImage:
                    "repeating-linear-gradient(135deg, hsl(20 3% 11%) 0 11px, hsl(20 3% 14.5%) 11px 22px)",
            }}
        >
            <div
                className="pointer-events-none absolute rounded"
                style={{ inset: 14, border: "1px dashed hsl(43 59% 81% / 0.22)" }}
            />
            <span
                className="font-mono text-[10px] uppercase tracking-[0.26em]"
                style={{ color: "hsl(43 59% 81% / 0.4)" }}
            >
                couverture&nbsp;absente
            </span>
            <h3
                className="text-foreground/85 font-quote leading-[1.18]"
                style={{ fontSize: title.length > 30 ? 21 : 27 }}
            >
                {title}
            </h3>
            <span className="h-px w-10" style={{ background: "hsl(43 59% 81% / 0.35)" }} />
            <span
                className="font-mono text-[10px] tracking-wide"
                style={{ color: "hsl(20 12% 55%)" }}
            >
                numérisé&nbsp;·&nbsp;{source}
            </span>
        </div>
    );
}

function AccessionStamp({ short, code }: { short: string; code: string }) {
    return (
        <div
            className="pointer-events-none absolute -right-3 top-5 z-20 select-none"
            style={{ transform: "rotate(8deg)" }}
        >
            <div
                className="flex flex-col items-center gap-1 px-3 py-2"
                style={{
                    border: "2px double hsl(43 59% 81% / 0.55)",
                    borderRadius: 4,
                    background: "hsl(20 3% 10% / 0.55)",
                    boxShadow: "0 2px 10px -4px hsl(20 3% 4% / 0.8)",
                }}
            >
                <span
                    className="font-mono text-[7.5px] uppercase tracking-[0.2em]"
                    style={{ color: "hsl(43 59% 81% / 0.62)" }}
                >
                    Fonds&nbsp;numérique
                </span>
                <span
                    className="font-mono text-[11px] font-medium uppercase tracking-[0.12em]"
                    style={{ color: "hsl(43 59% 81% / 0.92)" }}
                >
                    {short}
                </span>
                <span className="h-px w-full" style={{ background: "hsl(43 59% 81% / 0.35)" }} />
                <span
                    className="font-mono text-[7.5px] tracking-[0.1em]"
                    style={{ color: "hsl(43 59% 81% / 0.5)" }}
                >
                    Nº&nbsp;{code}
                </span>
            </div>
        </div>
    );
}

export function ArrivingCover({ book }: { book: BookSearchResult }) {
    const { label, short } = sourceInfo(book.source);
    const code = (book.isbn13 ?? "").slice(-6) || "——————";

    return (
        <div className="relative" style={{ perspective: 1000 }}>
            <div
                className="pointer-events-none absolute -inset-6 rounded-[28px]"
                style={{
                    background:
                        "radial-gradient(60% 55% at 50% 38%, hsl(43 59% 81% / 0.12), transparent 70%)",
                    opacity: 0.45,
                }}
            />
            <div
                className="relative mx-auto w-full max-w-[300px]"
                style={{ transform: "rotate(-2.4deg)" }}
            >
                <div
                    className="bg-background relative aspect-[2/3] overflow-hidden rounded-md"
                    style={{
                        border: "2px dashed hsl(43 59% 81% / 0.4)",
                        boxShadow: "0 26px 55px -20px hsl(20 3% 3% / 0.95)",
                    }}
                >
                    {book.coverUrl ? (
                        <img
                            src={book.coverUrl}
                            alt={`Couverture de ${book.title}`}
                            className="h-full w-full object-cover"
                            style={{ filter: "saturate(0.62) brightness(0.82) contrast(0.98)" }}
                        />
                    ) : (
                        <AbsentCover title={book.title} source={label} />
                    )}

                    <div
                        className="pointer-events-none absolute inset-0"
                        style={{
                            background:
                                "linear-gradient(160deg, hsl(20 3% 8% / 0.18), transparent 45%)",
                        }}
                    />
                    <span
                        className="pointer-events-none absolute left-0 top-0 h-full w-[5px]"
                        style={{ background: "hsl(20 3% 6% / 0.4)" }}
                    />

                    <AccessionStamp short={short} code={code} />
                </div>

                <p
                    className="mt-4 text-center font-mono text-[10.5px] tracking-wide"
                    style={{ color: "hsl(20 12% 56%)" }}
                >
                    {book.coverUrl ? "couverture fournie par " : "aucune couverture · "}
                    <span style={{ color: "hsl(43 30% 64%)" }}>{label}</span>
                </p>
            </div>
        </div>
    );
}
