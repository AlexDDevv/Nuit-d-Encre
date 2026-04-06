import { useParams, Navigate, useNavigate } from "react-router-dom";
import { useQuery } from "@apollo/client";
import { Helmet } from "react-helmet-async";
import { PREVIEW_BOOK } from "@/graphql/book/book-search";
import { BookSearchResult } from "@/types/types";
import { useImportBook } from "@/hooks/book/useImportBook";
import { useAuthContext } from "@/hooks/auth/useAuthContext";
import { useToast } from "@/hooks/toast/useToast";
import { slugify } from "@/lib/utils";
import Button from "@/components/UI/Button/Button";
import BookPreviewSkeleton from "@/components/UI/skeleton/BookPreviewSkeleton";

export default function BookPreview() {
    const { isbn13 } = useParams<{ isbn13: string }>();
    const navigate = useNavigate();
    const { user } = useAuthContext();
    const { showToast } = useToast();
    const { importBook, isImporting } = useImportBook();

    const { data, loading } = useQuery<{ previewBook: BookSearchResult | null }>(
        PREVIEW_BOOK,
        { variables: { isbn13 }, skip: !isbn13 }
    );

    if (loading) return <BookPreviewSkeleton />;

    const book = data?.previewBook;
    if (!book) return <Navigate to="/books" replace />;

    // Livre déjà en DB → redirection directe vers sa page
    if (book.isInDatabase && book.id) {
        return <Navigate to={`/books/${book.id}-${slugify(book.title)}`} replace />;
    }

    const handleImport = async () => {
        if (!isbn13) return;
        try {
            const result = await importBook({ variables: { isbn13 } });
            const imported = result.data?.importFromOpenLibrary;
            if (!imported) return;

            showToast({
                type: "success",
                title: "Livre ajouté",
                description: `"${imported.title}" est maintenant dans la bibliothèque.`,
            });

            navigate(`/books/${imported.id}-${slugify(imported.title)}`);
        } catch (err: any) {
            const message = err?.graphQLErrors?.[0]?.message ?? "Erreur lors de l'import.";

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
                <title>{book.title} — Aperçu sur Nuit d'Encre</title>
                <meta name="robots" content="noindex, nofollow" />
            </Helmet>
            <div className="mx-auto flex w-full max-w-2xl flex-col gap-8 px-4 py-10">
                <div className="flex gap-8">
                    <div className="h-56 w-40 shrink-0 overflow-hidden rounded-lg">
                        <img
                            src={book.coverUrl ?? "/images/bookCover.svg"}
                            alt={`Couverture de ${book.title}`}
                            className="h-full w-full object-cover"
                            onError={(e) => {
                                (e.target as HTMLImageElement).src = "/images/bookCover.svg";
                            }}
                        />
                    </div>
                    <div className="flex flex-col gap-2">
                        <h1 className="text-foreground text-2xl font-bold">{book.title}</h1>
                        {book.author && (
                            <p className="text-card-foreground text-lg">{book.author}</p>
                        )}
                        {book.year && (
                            <p className="text-muted-foreground text-sm">Publié en {book.year}</p>
                        )}
                        {book.publisher && (
                            <p className="text-muted-foreground text-sm">{book.publisher}</p>
                        )}
                        {book.language && (
                            <p className="text-muted-foreground text-sm">Langue : {book.language}</p>
                        )}
                        {book.isbn13 && (
                            <p className="text-muted-foreground text-sm">ISBN : {book.isbn13}</p>
                        )}
                    </div>
                </div>

                {user ? (
                    <Button
                        onClick={handleImport}
                        disabled={isImporting}
                        fullWidth
                        ariaLabel="Ajouter ce livre à la bibliothèque Nuit d'Encre"
                    >
                        {isImporting ? "Import en cours..." : "Ajouter à la bibliothèque Nuit d'Encre"}
                    </Button>
                ) : (
                    <Button
                        disabled
                        fullWidth
                        ariaLabel="Connexion requise pour importer un livre"
                        title="Connectez-vous pour importer ce livre"
                    >
                        Connexion requise pour importer
                    </Button>
                )}
            </div>
        </>
    );
}
