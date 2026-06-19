import { useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { FaArrowLeftLong, FaBook, FaQuoteLeft } from "react-icons/fa6";
import Button from "@/components/UI/Button/Button";
import Banner from "@/components/UI/Banner/Banner";
import XpPill from "@/components/UI/Banner/XpPill";
import SelectBookStatus from "@/components/sections/book/SelectBookStatus";
import BookReviews from "@/components/sections/book/BookReviews";
import BookCard from "@/components/sections/book/BookCard/BookCard";
import EstablishedCover from "@/components/sections/book/detail/EstablishedCover";
import BookNotice from "@/components/sections/book/detail/BookNotice";
import BookStatChips from "@/components/sections/book/detail/BookStatChips";
import SectionLead from "@/components/sections/book/detail/SectionLead";
import BookDetailsSkeleton from "@/components/UI/skeleton/BookDetailsSkeleton";
import Diamond from "@/components/UI/Diamond";
import CollectionSeam from "@/components/sections/shared/CollectionSeam";
import SectionHairline from "@/components/sections/shared/SectionHairline";
import FicheManagementBar from "@/components/sections/shared/FicheManagementBar";
import { useAuthContext } from "@/hooks/auth/useAuthContext";
import { useBookData } from "@/hooks/book/useBookData";
import { useUserBookMutations } from "@/hooks/userBook/useUserBookMutations";
import { useBookMutations } from "@/hooks/book/useBookMutations";
import { useToast } from "@/hooks/toast/useToast";
import { hasIncompleteBookInfo, slugify } from "@/lib/utils";
import { formatLabelMap } from "@/lib/filterMaps";
import { parseGraphQLError } from "@/utils/graphql-error";
import { UserBookStatus } from "@/types/types";

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

    const idStr = slug.slice(0, 36);
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
                        xp: 50,
                    }}
                >
                    Complète-les pour gagner <XpPill amount={50} /> et faire
                    entrer cet ouvrage dans la collection.
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
            <CollectionSeam
                icon={<FaBook size={12} aria-hidden="true" />}
                label="Dans la collection — chez nous"
            />

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
                                className="text-foreground hover:text-primary decoration-primary/40 hover:decoration-primary focus-visible:ring-ring rounded-sm font-quote text-lg italic underline decoration-dotted underline-offset-4 transition-colors focus-visible:outline-none focus-visible:ring-2"
                            >
                                {author}
                            </Link>
                        </p>
                    </div>

                    {/* résumé tronqué + lire la suite */}
                    <div className="relative max-w-125">
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
                                    className="text-primary hover:text-foreground focus-visible:ring-ring rounded-sm font-body text-sm font-bold not-italic underline decoration-dotted underline-offset-2 transition-colors focus-visible:outline-none focus-visible:ring-2"
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
                    <SectionHairline label="Le résumé" />
                    <p className="text-foreground/88 font-quote text-lg leading-[1.72]">
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
            <FicheManagementBar
                canEdit={!!canEdit}
                canDelete={!!canDelete}
                editTo={`/books/update/${book.id}`}
                editLabel="Modifier le livre"
                editAriaLabel={`Modifier le livre ${book.title} de ${author}`}
                onDelete={handleDeleteBook}
                isDeleting={isDeletingBook}
                deleteAriaLabel={`Supprimer le livre ${book.title} de ${author} en tant qu'administrateur`}
            />
        </div>
    );
}
