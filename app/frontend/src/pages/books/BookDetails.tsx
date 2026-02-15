import { Button } from "@/components/UI/Button";
import SelectBookStatus from "@/components/sections/book/SelectBookStatus";
import BookInfos from "@/components/sections/book/BookInfos";
import { useAuthContext } from "@/hooks/auth/useAuthContext";
import { Link, useParams } from "react-router-dom";
import BookDetailsSkeleton from "@/components/UI/skeleton/BookDetailsSkeleton";
import { useBookData } from "@/hooks/book/useBookData";
import BooksBibliography from "@/components/sections/book/BooksBibliography";
import { slugify } from "@/lib/utils";
import { useState } from "react";
import { UserBookStatus } from "@/types/types";
import { useUserBookMutations } from "@/hooks/userBook/useUserBookMutations";
import { useToast } from "@/hooks/toast/useToast";
import { useNavigate } from "react-router-dom";
import { useBookMutations } from "@/hooks/book/useBookMutations";

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
            showToast({
                type: "error",
                title: "Erreur",
                description:
                    "L'ajout du livre dans la bibliothèque de l'utilisateur a échoué...",
            });
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
            if (error instanceof Error) {
                if (
                    error.message.includes(
                        "Access denied! You don't have permission for this action!",
                    )
                ) {
                    showToast({
                        type: "error",
                        title: "Échec de la suppression",
                        description: "Vous n'avez pas les droits nécessaires.",
                    });
                } else {
                    showToast({
                        type: "error",
                        title: "Erreur lors de la suppression",
                        description:
                            "Une erreur est survenue. Veuillez réessayer plus tard.",
                    });
                }
            } else {
                showToast({
                    type: "error",
                    title: "Erreur inattendue",
                    description: "Une erreur inconnue est survenue.",
                });
            }
        }
    };

    return (
        <div className="flex flex-col gap-20">
            <div className="flex gap-10">
                <div className="max-w-3xs max-h-96">
                    <img
                        src="/images/bookCover.svg"
                        alt="Couverture d'un livre"
                        className="h-full w-full"
                    />
                </div>
                <div className="flex flex-col gap-6">
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
                    <div>
                        <p className="text-foreground font-semibold">
                            {book.category.name}
                        </p>
                    </div>
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
            <BooksBibliography
                author={book.author}
                excludeBookId={id}
                fromAuthorPage={false}
            />
        </div>
    );
}
