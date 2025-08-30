import { Button } from "@/components/UI/Button";
import Loader from "@/components/UI/Loader";
import SelectBookState from "@/components/UI/SelectBookState";
import BookInfos from "@/components/sections/book/BookInfos";
import { useAuthContext } from "@/hooks/useAuthContext";
import { useBook } from "@/hooks/useBook";
import { useParams } from "react-router-dom";

export default function BookDetails() {
    const { slug } = useParams<{ slug: string }>();
    const { user } = useAuthContext();

    if (!slug) {
        throw new Response("Book not found", { status: 404 });
    }

    const [idStr] = slug.split("-");
    const id = idStr;

    const { book, bookLoading, bookError } = useBook(id);

    if (bookLoading) {
        return <Loader />;
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
                        <p className="text-foreground text-xl font-semibold italic">
                            {book.author.firstname} {book.author.lastname}
                        </p>
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
                    <SelectBookState />
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
            {isOwner && (
                <Button
                    ariaLabel={`Modifier le livre ${book.title} de ${book.author.firstname} ${book.author.lastname}`}
                    to={`/books/update/${book.id}`}
                    variant="primary"
                    children="Modifier le livre"
                />
            )}
        </div>
    );
}
