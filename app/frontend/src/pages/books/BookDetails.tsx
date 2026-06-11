import Button from "@/components/UI/Button/Button";
import Banner from "@/components/UI/Banner/Banner";
import SelectBookStatus from "@/components/sections/book/SelectBookStatus";
import BookInfos from "@/components/sections/book/BookInfos";
import { useAuthContext } from "@/hooks/auth/useAuthContext";
import { Link, useParams } from "react-router-dom";
import BookDetailsSkeleton from "@/components/UI/skeleton/BookDetailsSkeleton";
import { useBookData } from "@/hooks/book/useBookData";
import { useBooksByCategory } from "@/hooks/book/category/useBooksByCategory";
import BooksBibliography from "@/components/sections/book/BooksBibliography";
import { slugify, hasIncompleteBookInfo } from "@/lib/utils";
import { useState } from "react";
import { UserBookStatus } from "@/types/types";
import { useUserBookMutations } from "@/hooks/userBook/useUserBookMutations";
import { useToast } from "@/hooks/toast/useToast";
import { useNavigate } from "react-router-dom";
import { useBookMutations } from "@/hooks/book/useBookMutations";
import { parseGraphQLError } from "@/utils/graphql-error";
import BooksByCategory from "@/components/sections/book/BooksByCategory";
import BookCover from "@/components/sections/book/BookCover";
import BookStats from "@/components/sections/book/BookStats";
import BookReviews from "@/components/sections/book/BookReviews";

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
    const { books: categoryBooks } = useBooksByCategory(
        book?.category.id,
        6,
    );

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

        // Pour les autres erreurs GraphQL
        throw new Response("Error loading book", { status: 500 });
    }

    if (!book) {
        throw new Response("Book not found", { status: 404 });
    }

    const isOwner = user && book.user.id === user.id;
    const isAdmin = user && user.role === "admin";
    const canEdit = !!user && (isOwner || isAdmin);
    const canDelete = !!user && isAdmin;

    const handleStatusChange = async (newStatus: UserBookStatus) => {
        try {
            await createUserBook({
                bookId: id,
                status: newStatus,
            });

            setStatus(newStatus);
            showToast({
                type: "success",
                title: "Succès",
                description:
                    "Le livre a bien été ajouté à votre bibliothèque !",
            });
        } catch (error) {
            const { title, description } = parseGraphQLError(error, "createUserBook");
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
        <div className="flex flex-col gap-20">
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
                    <span className="font-semibold">Complète-les pour gagner 50 XP !</span>
                </Banner>
            )}
            <div className="flex gap-10">
                <BookCover
                    coverUrl={book.coverUrl}
                    title={book.title}
                    author={`${book.author.firstname} ${book.author.lastname}`}
                    className="aspect-2/3 w-64 shrink-0 rounded-lg"
                />
                <div className="flex flex-col gap-5">
                    <div>
                        <h1 className="text-foreground text-4xl font-bold">
                            {book.title}
                        </h1>
                        <Link
                            to={`/authors/${book.author.id}-${slugify(`${book.author.firstname} ${book.author.lastname}`)}`}
                            className="text-foreground inline-block text-xl font-semibold italic hover:underline"
                            aria-label={`Accéder à la page de ${book.author.firstname} ${book.author.lastname}`}
                        >
                            {book.author.firstname} {book.author.lastname}
                        </Link>
                    </div>
                    <div className="flex flex-col gap-2">
                        <div className="max-w-xl">
                            {book.summary.length > 200 ? (
                                <p className="text-secondary-foreground">
                                    {book.summary.substring(0, 200)}
                                    ...
                                    <a
                                        href="#summary"
                                        className="text-foreground ml-1 font-semibold"
                                    >
                                        Lire la suite
                                    </a>
                                </p>
                            ) : (
                                <p className="text-secondary-foreground">
                                    {book.summary}
                                </p>
                            )}
                        </div>
                        <p className="text-foreground font-semibold">
                            {book.category.name}
                        </p>
                    </div>
                    <BookStats book={book} />
                    <SelectBookStatus
                        value={status}
                        onChange={handleStatusChange}
                        disabled={isCreatingUserBook}
                    />
                </div>
            </div>
            <div className="flex gap-20">
                <div id="summary" className="flex w-1/2 flex-col gap-5">
                    <h2 className="text-foreground text-3xl font-semibold">
                        Résumé :
                    </h2>
                    <p className="text-secondary-foreground">{book.summary}</p>
                </div>
                <div className="flex w-1/2 flex-col gap-5">
                    <h2 className="text-foreground text-3xl font-semibold">
                        Informations complémentaires :
                    </h2>
                    <BookInfos book={book} />
                </div>
            </div>
            <div className="flex gap-5">
                {canEdit && (
                    <Button
                        ariaLabel={`Modifier le livre ${book.title} de ${book.author.firstname} ${book.author.lastname}`}
                        to={`/books/update/${book.id}`}
                        variant="primary"
                    >
                        Modifier le livre
                    </Button>
                )}
                {canDelete && (
                    <Button
                        ariaLabel={`Supprimer le livre ${book.title} de ${book.author.firstname} ${book.author.lastname} en tant qu'administrateur`}
                        variant="destructive"
                        onClick={handleDeleteBook}
                        loading={isDeletingBook}
                        disabled={isDeletingBook}
                    >
                        Supprimer
                    </Button>
                )}
            </div>
            <div className="flex flex-col gap-20 bg-muted rounded-lg p-6 border-border border-2">
                <BooksBibliography
                    author={book.author}
                    excludedBookId={book.id}
                    fromAuthorPage={false}
                />
                <BooksByCategory
                    category={book.category}
                    books={categoryBooks}
                    excludedBookId={book.id}
                    excludedBookTitle={book.title}
                />
                <BookReviews book={book} />
            </div>
        </div>
    );
}
