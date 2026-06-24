import { ApolloError, useQuery } from "@apollo/client";
import { Helmet } from "react-helmet-async";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import { PREVIEW_BOOK } from "@/graphql/book/book-search";
import { BookSearchResult } from "@/types/types";
import { useImportBook } from "@/hooks/book/useImportBook";
import { useAuthContext } from "@/hooks/auth/useAuthContext";
import { useToast } from "@/hooks/toast/useToast";
import { slugify } from "@/lib/utils";
import Button from "@/components/UI/Button/Button";
import { Glyph } from "@/components/sections/book/preview/Glyph";
import { sourceInfo } from "@/components/sections/book/preview/previewLabels";
import { ArrivingCover } from "@/components/sections/book/preview/ArrivingCover";
import { PreviewDetails } from "@/components/sections/book/preview/PreviewDetails";
import { PreviewNotice } from "@/components/sections/book/preview/PreviewNotice";
import BookPreviewSkeleton from "@/components/UI/skeleton/BookPreviewSkeleton";

export default function BookPreview() {
    const { isbn13 } = useParams<{ isbn13: string }>();
    const navigate = useNavigate();
    const { user } = useAuthContext();
    const { showToast } = useToast();
    const { importBook, isImporting } = useImportBook();

    const { data, loading } = useQuery<{
        previewBook: BookSearchResult | null;
    }>(PREVIEW_BOOK, {
        variables: { isbn13 },
        skip: !isbn13,
    });

    if (loading) return <BookPreviewSkeleton />;

    const book = data?.previewBook;
    if (!book) return <Navigate to="/books" replace />;

    // Déjà en base → on file directement sur sa fiche.
    if (book.isInDatabase && book.id) {
        return (
            <Navigate to={`/books/${book.id}-${slugify(book.title)}`} replace />
        );
    }

    const { label: source } = sourceInfo(book.source);
    const loginHref = `/connexion?redirect=${encodeURIComponent(`/books/preview/${isbn13}`)}`;

    const handleImport = async () => {
        if (!isbn13) return;
        try {
            const result = await importBook({ variables: { isbn13 } });
            const imported = result.data?.importBook;
            if (!imported) return;
            showToast({
                type: "success",
                title: "Livre ajouté",
                description: `« ${imported.title} » a rejoint vos rayons.`,
            });
            navigate(`/books/${imported.id}-${slugify(imported.title)}`);
        } catch (err) {
            const message =
                (err instanceof ApolloError && err.graphQLErrors[0]?.message) ||
                "Erreur lors de l'import.";
            showToast({
                type: message.includes("déjà") ? "info" : "error",
                title: message.includes("déjà") ? "Déjà disponible" : "Erreur",
                description: message,
            });
        }
    };

    return (
        <>
            <Helmet>
                <title>{book.title} - Aperçu sur Nuit d'Encre</title>
                <meta name="robots" content="noindex, nofollow" />
            </Helmet>

            <div className="mx-auto w-full max-w-5xl px-5 pb-24 pt-7 sm:px-8">
                <Button
                    variant="underlineText"
                    size="sm"
                    to="/books"
                    ariaLabel="Retourner à la recherche"
                    leftIcon={<Glyph name="arrowL" />}
                >
                    Recherche
                </Button>

                <div className="mb-7 mt-8 flex items-center gap-3">
                    <span
                        className="text-xxs inline-flex items-center gap-2 whitespace-nowrap font-mono uppercase tracking-[0.24em]"
                        style={{ color: "hsl(43 30% 60%)" }}
                    >
                        <Glyph name="external" size={12} /> Venu d'ailleurs -
                        pas encore dans vos rayons
                    </span>
                    <span
                        className="h-px flex-1"
                        style={{
                            backgroundImage:
                                "repeating-linear-gradient(to right, hsl(43 59% 81% / 0.35) 0 6px, transparent 6px 12px)",
                        }}
                    />
                    <span
                        className="text-xxs inline-flex items-center gap-1.5 whitespace-nowrap rounded-full border px-3 py-1 font-mono tracking-wide"
                        style={{
                            borderColor: "hsl(43 59% 81% / 0.3)",
                            color: "hsl(43 59% 81% / 0.9)",
                            background: "hsl(20 3% 12% / 0.6)",
                        }}
                    >
                        <Glyph name="external" size={11} /> {source}
                    </span>
                </div>

                <div className="grid gap-10 sm:gap-12 md:grid-cols-[300px_1fr] md:items-start">
                    <div className="md:pt-2">
                        <ArrivingCover book={book} />
                    </div>
                    <PreviewDetails
                        book={book}
                        isAuthenticated={!!user}
                        isImporting={isImporting}
                        onImport={handleImport}
                        loginHref={loginHref}
                    />
                </div>

                <PreviewNotice book={book} />
            </div>
        </>
    );
}
