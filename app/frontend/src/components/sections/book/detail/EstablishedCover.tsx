import { Book } from "@/types/types";
import FallbackCover from "../FallbackCover";

/** Tampon « De la collection · Nuit d'Encre · Nº … », repris de la page d'import. */
function CollectionStamp({ code }: { code: string }) {
    return (
        <div className="pointer-events-none absolute -right-3 top-5 z-20 rotate-[8deg] select-none">
            <div className="border-primary/55 flex flex-col items-center gap-1 rounded-sm border-2 border-double bg-[hsl(20_3%_10%/0.55)] px-3 py-2 shadow-[0_2px_10px_-4px_hsl(20_3%_4%/0.8)]">
                <span className="text-primary/60 font-mono text-[7.5px] uppercase tracking-[0.2em]">
                    De&nbsp;la&nbsp;collection
                </span>
                <span className="text-primary/90 font-mono text-[11px] font-medium uppercase tracking-[0.12em]">
                    Nuit&nbsp;d'Encre
                </span>
                <span className="bg-primary/35 h-px w-full" />
                <span className="text-primary/50 font-mono text-[7.5px] tracking-widest">
                    Nº&nbsp;{code}
                </span>
            </div>
        </div>
    );
}

function formatAddedOn(createdAt?: string): string | null {
    if (!createdAt) return null;
    const date = new Date(createdAt);
    if (Number.isNaN(date.getTime())) return null;
    return new Intl.DateTimeFormat("fr-FR", {
        month: "long",
        year: "numeric",
    }).format(date);
}

/**
 * Couverture « établie » de la page de détail : même DA que la couverture de la
 * page d'import, mais en version « chez nous » — droite (non inclinée), bordure
 * pleine dorée, tampon « Nuit d'Encre », et légende « dans la collection ».
 */
export default function EstablishedCover({ book }: { book: Book }) {
    const code = (book.isbn13 ?? "").replace(/[^0-9]/g, "").slice(-6) || "——————";
    const author = `${book.author.firstname} ${book.author.lastname}`;
    const addedOn = formatAddedOn(book.createdAt);

    return (
        <div className="relative mx-auto w-full max-w-75">
            {/* l'ouvrage — bordure pleine dorée */}
            <div className="border-primary/85 relative aspect-2/3 rounded-md border-2 shadow-[0_30px_60px_-22px_hsl(20_3%_3%/0.95),0_0_0_6px_hsl(43_59%_81%/0.06)] overflow-hidden">
                <div className="bg-background absolute inset-0 overflow-hidden rounded-md">
                    {book.coverUrl ? (
                        <img
                            src={book.coverUrl}
                            alt={`Couverture de ${book.title}`}
                            className="h-full w-full object-cover"
                        />
                    ) : (
                        <FallbackCover title={book.title} author={author} />
                    )}
                    {/* tranche / reliure */}
                    <span className="pointer-events-none absolute left-0 top-0 h-full w-1.25 bg-[hsl(20_3%_6%/0.4)]" />
                </div>

                <CollectionStamp code={code} />
            </div>

            {/* indication : dans la collection */}
            <p className="mt-4 text-center font-mono text-[10.5px] tracking-wide text-[hsl(20_12%_56%)]">
                dans la collection
                {addedOn && (
                    <>
                        {" · "}
                        <span className="text-[hsl(43_30%_64%)]">
                            depuis {addedOn}
                        </span>
                    </>
                )}
            </p>
        </div>
    );
}
