import { useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { FaArrowLeftLong, FaBook, FaFeatherPointed, FaQuoteLeft } from "react-icons/fa6";
import Button from "@/components/UI/Button/Button";
import Banner from "@/components/UI/Banner/Banner";
import SelectBookStatus from "@/components/sections/book/SelectBookStatus";
import BookReviews from "@/components/sections/book/BookReviews";
import BookCard from "@/components/sections/book/BookCard/BookCard";
import EstablishedCover from "@/components/sections/book/detail/EstablishedCover";
import BookNotice from "@/components/sections/book/detail/BookNotice";
import BookStatChips from "@/components/sections/book/detail/BookStatChips";
import SectionLead from "@/components/sections/book/detail/SectionLead";
import BookDetailsSkeleton from "@/components/UI/skeleton/BookDetailsSkeleton";
import { useAuthContext } from "@/hooks/auth/useAuthContext";
import { useBookData } from "@/hooks/book/useBookData";
import { useUserBookMutations } from "@/hooks/userBook/useUserBookMutations";
import { useBookMutations } from "@/hooks/book/useBookMutations";
import { useToast } from "@/hooks/toast/useToast";
import { hasIncompleteBookInfo, slugify } from "@/lib/utils";
import { formatLabelMap } from "@/lib/filterMaps";
import { parseGraphQLError } from "@/utils/graphql-error";
import { UserBookStatus } from "@/types/types";

const Diamond = () => (
    <span className="text-primary/40" aria-hidden="true">
        ◆
    </span>
);

export default function BookDetails() {
    const { createUserBook, isCreatingUserBook } = useUserBookMutations();
    const [status, setStatus] = useState<UserBookStatus | undefined>(undefined);
    const navigate = useNavigate();
    const { deleteBook, isDeletingBook } = useBookMutations();
    const { showToast } = useToast();
    const { slug } = useParams<{ slug: string }>();
    const { user } = useAuthContext();

    if (!slug) {
        throw new Response("Book not found", { status: 404 });
    }

    const [idStr] = slug.split("-");
    const id = idStr;

    const { book, isLoadingBook, bookError } = useBookData(id);

    if (isLoadingBook) {
        return <BookDetailsSkeleton />;
    }

    if (bookError) {
        const isNotFoundError = bookError.graphQLErrors.some((error) =>
            error.message.includes("Failed to fetch book"),
        );

        if (isNotFoundError) {
            throw new Response("Book not found", { status: 404 });
        }

        throw new Response("Error loading book", { status: 500 });
    }

    if (!book) {
        throw new Response("Book not found", { status: 404 });
    }

    const isOwner = user && book.user.id === user.id;
    const isAdmin = user && user.role === "admin";
    const canEdit = !!user && (isOwner || isAdmin);
    const canDelete = !!user && isAdmin;

    const author = `${book.author.firstname} ${book.author.lastname}`;
    const authorPath = `/authors/${book.author.id}-${slugify(author)}`;
    const formatLabel = book.format ? formatLabelMap[book.format] : null;
    const isExcerpt = book.summary.length > 200;
    const sameAuthorBooks = (book.author.books ?? []).filter(
        (b) => b.id !== book.id,
    );

    const handleStatusChange = async (newStatus: UserBookStatus) => {
        try {
            await createUserBook({ bookId: id, status: newStatus });
            setStatus(newStatus);
            showToast({
                type: "success",
                title: "Succès",
                description:
                    "Le livre a bien été ajouté à votre bibliothèque !",
            });
        } catch (error) {
            const { title, description } = parseGraphQLError(
                error,
                "createUserBook",
            );
            showToast({ type: "error", title, description });
        }
    };

    const handleDeleteBook = async () => {
        try {
            await deleteBook(book.id);
            showToast({
                type: "success",
                title: "Le livre a bien été supprimé !",
                description:
                    "Vous allez être redirigé vers la page d'accueil pour poursuivre votre navigation.",
            });
            navigate("/books");
        } catch (error) {
            const { title, description } = parseGraphQLError(error, "deleteBook");
            showToast({ type: "error", title, description });
        }
    };

    const showCompletionBanner = !!isOwner && hasIncompleteBookInfo(book);

    return (
        <div className="mx-auto flex w-full max-w-5xl flex-col gap-16">
            {showCompletionBanner && (
                <Banner
                    variant="completion"
                    title="Ce livre a été importé automatiquement et certaines informations sont manquantes."
                    action={{
                        label: "Compléter",
                        to: `/books/update/${book.id}`,
                        ariaLabel: `Modifier le livre ${book.title} pour compléter ses informations`,
                    }}
                >
                    <span className="font-semibold">
                        Complète-les pour gagner 50 XP !
                    </span>
                </Banner>
            )}
            {/* retour */}
            <Button
                variant="underlineText"
                size="sm"
                to="/books"
                ariaLabel="Retourner au catalogue"
                leftIcon={<FaArrowLeftLong size={14} />}
                className="w-fit"
            >
                Catalogue
            </Button>

            {/* couture « chez nous » */}
            <div className="-mt-10 flex items-center gap-3">
                <span className="inline-flex items-center gap-2 whitespace-nowrap font-mono text-[10.5px] uppercase tracking-[0.24em] text-[hsl(43_30%_62%)]">
                    <FaBook size={12} aria-hidden="true" /> Dans la collection — chez
                    nous
                </span>
                <span className="h-px flex-1 bg-[linear-gradient(to_right,hsl(43_59%_81%/0.55),hsl(43_59%_81%/0.1))]" />
                <span className="text-primary/90 border-primary/30 inline-flex items-center gap-1.5 whitespace-nowrap rounded-full border bg-[hsl(20_3%_12%/0.6)] px-3 py-1 font-mono text-[10.5px] tracking-wide">
                    <FaFeatherPointed size={11} aria-hidden="true" /> Nuit d'Encre
                </span>
            </div>

            {/* HÉRO */}
            <div className="grid gap-10 sm:gap-12 md:grid-cols-[300px_1fr] md:items-start">
                <div className="md:pt-2">
                    <EstablishedCover book={book} />
                </div>

                <div className="flex min-w-0 flex-col gap-6">
                    <div className="flex flex-col gap-3">
                        <p className="font-quote text-sm italic text-[hsl(43_30%_64%)]">
                            Un ouvrage de notre bibliothèque
                        </p>
                        <h1 className="text-foreground font-quote text-4xl leading-[1.04] text-balance">
                            {book.title}
                        </h1>
                        <p className="text-foreground/90 font-body text-sm">
                            par{" "}
                            <Link
                                to={authorPath}
                                aria-label={`Voir la fiche de ${author}`}
                                className="text-foreground hover:text-primary decoration-primary/40 hover:decoration-primary focus-visible:ring-ring rounded font-quote text-[17px] italic underline decoration-dotted underline-offset-4 transition-colors focus-visible:outline-none focus-visible:ring-2"
                            >
                                {author}
                            </Link>
                        </p>
                    </div>

                    {/* résumé tronqué + lire la suite */}
                    <div className="relative max-w-[54ch]">
                        <FaQuoteLeft
                            size={18}
                            className="text-primary absolute -left-1 -top-1 opacity-40"
                            aria-hidden="true"
                        />
                        <p className="text-foreground/85 font-quote pl-7 italic">
                            {isExcerpt
                                ? `${book.summary.substring(0, 200)}… `
                                : `${book.summary} `}
                            {isExcerpt && (
                                <a
                                    href="#summary"
                                    className="text-primary hover:text-foreground focus-visible:ring-ring rounded font-body text-sm font-bold not-italic underline decoration-dotted underline-offset-2 transition-colors focus-visible:outline-none focus-visible:ring-2"
                                >
                                    Lire la suite
                                </a>
                            )}
                        </p>
                    </div>

                    {/* méta en ligne */}
                    <div className="text-muted-foreground flex flex-wrap items-center gap-x-3 gap-y-1.5 font-body text-sm">
                        <span className="font-quote italic text-[hsl(43_30%_64%)]">
                            {book.category.name}
                        </span>
                        <Diamond />
                        <span>{book.publishedYear}</span>
                        {book.pageCount > 0 && (
                            <>
                                <Diamond />
                                <span>{book.pageCount} pages</span>
                            </>
                        )}
                        {formatLabel && (
                            <>
                                <Diamond />
                                <span>{formatLabel}</span>
                            </>
                        )}
                    </div>

                    <BookStatChips book={book} />

                    {/* statut de lecture — select existant, sans label */}
                    <div className="mt-2">
                        <SelectBookStatus
                            value={status}
                            onChange={handleStatusChange}
                            disabled={isCreatingUserBook}
                        />
                    </div>
                </div>
            </div>

            {/* RÉSUMÉ COMPLET + NOTICE */}
            <div
                id="summary"
                className="grid scroll-mt-20 gap-8 md:grid-cols-[1fr_0.78fr]"
            >
                <section className="flex flex-col gap-4">
                    <div className="flex items-center gap-2.5">
                        <span className="font-quote text-sm italic text-[hsl(43_30%_62%)]">
                            Le résumé
                        </span>
                        <span className="bg-primary/20 h-px flex-1" />
                    </div>
                    <p className="text-foreground/88 font-quote text-[17.5px] leading-[1.72]">
                        {book.summary}
                    </p>
                </section>

                <BookNotice book={book} />
            </div>

            {/* CRITIQUES (+ recommandation) */}
            <BookReviews book={book} />

            {/* DÉCOUVERTE — du même auteur (carrousel de cartes overlay) */}
            {sameAuthorBooks.length > 0 && (
                <section>
                    <SectionLead
                        kicker="De la même plume"
                        title={`Du même auteur — ${author}`}
                    />
                    <div className="flex gap-5">
                        {sameAuthorBooks.map((b) => (
                            <div key={b.id} className="w-44 shrink-0">
                                <BookCard
                                    book={{ ...b, author: book.author }}
                                    className="w-full"
                                    isInAuthorPage
                                />
                            </div>
                        ))}
                    </div>
                </section>
            )}
            {/* DÉCOUVERTE — « Dans la même catégorie » : à traiter ultérieurement. */}

            {/* GESTION DE LA FICHE (propriétaire / admin) */}
            {(canEdit || canDelete) && (
                <section className="flex items-center justify-between border-t border-[hsl(0_0%_100%/0.06)] pt-6">
                    <span className="text-muted-foreground font-mono text-[10px] uppercase tracking-[0.2em]">
                        Gestion de la fiche · propriétaire ou administrateur
                    </span>
                    <div className="flex flex-wrap gap-3">
                        {canEdit && (
                            <Button
                                ariaLabel={`Modifier le livre ${book.title} de ${author}`}
                                to={`/books/update/${book.id}`}
                                variant="outline"
                                size="sm"
                            >
                                Modifier le livre
                            </Button>
                        )}
                        {canDelete && (
                            <Button
                                ariaLabel={`Supprimer le livre ${book.title} de ${author} en tant qu'administrateur`}
                                variant="destructive"
                                size="sm"
                                onClick={handleDeleteBook}
                                loading={isDeletingBook}
                                disabled={isDeletingBook}
                            >
                                Supprimer
                            </Button>
                        )}
                    </div>
                </section>
            )}
        </div>
    );
}
