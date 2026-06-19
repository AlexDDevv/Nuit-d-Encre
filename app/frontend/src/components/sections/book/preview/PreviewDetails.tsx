import { BookSearchResult } from "@/types/types";
import Button from "@/components/UI/Button/Button";
import { Glyph } from "./Glyph";
import { langLabel } from "./previewLabels";

const GOLD = "hsl(43 59% 81%)";

type PreviewDetailsProps = {
    book: BookSearchResult;
    isAuthenticated: boolean;
    isImporting: boolean;
    onImport: () => void;
    loginHref: string;
};

export function PreviewDetails({
    book,
    isAuthenticated,
    isImporting,
    onImport,
    loginHref,
}: PreviewDetailsProps) {
    const author = book.author?.trim() || "Auteur inconnu";
    const knownAuthor = Boolean(book.authorId);
    const lang = langLabel(book.language);

    const meta = [
        book.year && <span key="year">{book.year}</span>,
        lang && (
            <span key="lang" className="inline-flex items-center gap-1">
                <Glyph name="globe" size={12} style={{ color: "hsl(43 59% 81% / 0.5)" }} /> {lang}
            </span>
        ),
        book.pageCount && <span key="pages">{book.pageCount} pages</span>,
    ].filter(Boolean);

    return (
        <div className="min-w-0">
            <p className="mb-3 font-quote text-sm italic" style={{ color: "hsl(43 30% 64%)" }}>
                {knownAuthor
                    ? "D'un auteur que vous connaissez déjà"
                    : "Une découverte hors de vos murs"}
            </p>
            <h1
                className={`text-foreground font-quote leading-[1.04] text-balance ${book.title.length > 44 ? "text-4xl" : "text-5xl"}`}
                style={{ letterSpacing: "-0.005em" }}
            >
                {book.title}
            </h1>

            <div className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-2">
                <span className="text-foreground/90 font-body text-sm">
                    par <span className="font-bold">{author}</span>
                </span>
                {knownAuthor ? (
                    <span
                        className="inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-2.5 py-1 font-body text-xs font-bold"
                        style={{
                            background: "hsl(43 30% 25% / 0.5)",
                            color: GOLD,
                            border: "1px solid hsl(43 59% 81% / 0.3)",
                        }}
                    >
                        <Glyph name="user" size={12} /> Déjà dans la maison
                        {!!book.authorBookCount && (
                            <span className="font-normal opacity-75">
                                · {book.authorBookCount} ouvrage
                                {book.authorBookCount > 1 ? "s" : ""}
                            </span>
                        )}
                    </span>
                ) : (
                    <span
                        className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 font-body text-xs"
                        style={{
                            background: "hsl(20 12% 23% / 0.6)",
                            color: "hsl(20 12% 70%)",
                            border: "1px dashed hsl(0 0% 40% / 0.5)",
                        }}
                    >
                        <Glyph name="userPlus" size={12} /> Nouvel auteur pour la maison
                    </span>
                )}
            </div>

            {book.description && (
                <div className="relative mt-6 max-w-[52ch]">
                    <Glyph
                        name="quote"
                        size={22}
                        className="absolute -left-1 -top-1 opacity-40"
                        style={{ color: GOLD }}
                    />
                    <p className="text-foreground/85 font-quote pl-7 text-base italic leading-[1.6]">
                        {book.description}
                    </p>
                </div>
            )}

            {meta.length > 0 && (
                <div
                    className="mt-6 flex flex-wrap items-center gap-x-3 gap-y-1.5 font-body text-sm"
                    style={{ color: "hsl(20 12% 70%)" }}
                >
                    {meta.flatMap((node, i) =>
                        i === 0
                            ? [node]
                            : [
                                <span key={`sep-${i}`} style={{ color: "hsl(43 59% 81% / 0.4)" }}>
                                    ◆
                                </span>,
                                node,
                            ],
                    )}
                </div>
            )}

            <div className="mt-8">
                {isAuthenticated ? (
                    <Button
                        variant="primary"
                        size="lg"
                        onClick={onImport}
                        loading={isImporting}
                        ariaLabel={`Faire entrer ${book.title} dans Nuit d'Encre`}
                        leftIcon={<Glyph name="import" size={18} />}
                        className="rounded-xl shadow-[0_14px_34px_-14px_hsl(43_59%_60%/0.6)]"
                    >
                        {isImporting ? "Entrée en cours…" : "Faire entrer dans vos rayons"}
                    </Button>
                ) : (
                    <div className="flex flex-col gap-3">
                        <Button
                            variant="primary"
                            size="lg"
                            to={loginHref}
                            ariaLabel="Se connecter pour importer ce livre"
                            leftIcon={<Glyph name="user" size={18} />}
                            className="w-fit rounded-xl"
                        >
                            Connectez-vous pour l'ajouter
                        </Button>
                        <p className="font-body text-xs" style={{ color: "hsl(43 30% 64%)" }}>
                            Il faut un compte pour faire entrer un ouvrage dans Nuit d'Encre.
                        </p>
                    </div>
                )}
            </div>

            <p
                className="mt-4 font-body text-xs leading-relaxed"
                style={{ color: "hsl(20 12% 60%)" }}
            >
                Une fois entré, l'ouvrage rejoint le catalogue : certaines informations (résumé,
                catégorie, pages, couverture) pourront être complétées ensuite.
            </p>
        </div>
    );
}
