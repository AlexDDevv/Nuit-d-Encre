import Loader from "@/components/UI/Loader";
import SelectBookState from "@/components/UI/SelectBookState";
import BookInfos from "@/components/sections/book/BookInfos";
import { useBook } from "@/hooks/useBook";
import { useParams } from "react-router-dom";

export default function BookDetails() {
    const { slug } = useParams<{ slug: string }>();

    if (!slug) {
        throw new Response("Book not found", { status: 404 });
    }

    const [idStr] = slug.split("-");
    const id = idStr;

    const { book, bookLoading, bookError } = useBook(id)

    if (bookLoading) {
        return (
            <Loader />
        );
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

    return (
        <div className="flex flex-col gap-20">
            <div className="flex gap-10">
                <div className="max-w-3xs max-h-96">
                    <img src="/images/bookCover.svg" alt="Couverture d'un livre" className="w-full h-full" />
                </div>
                <div className="flex flex-col gap-6">
                    <div>
                        <h1 className="font-bold text-foreground text-4xl">{book.title}</h1>
                        <p className="font-semibold text-foreground text-xl italic">{book.author.firstname} {book.author.lastname}</p>
                    </div>
                    <div className="max-w-xl">
                        {book.summary.length > 200 ? (
                            <p className="text-secondary-foreground">
                                {book.summary.substring(
                                    0,
                                    200,
                                )}
                                ...
                                <a
                                    href="#summary"
                                    className="ml-1 text-foreground font-semibold"
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
                        <p className="font-semibold text-foreground">{book.category.name}</p>
                    </div>
                    <SelectBookState />
                </div>
            </div>
            <div className="flex gap-20">
                <div id="summary" className="w-1/2 flex flex-col gap-5">
                    <h2 className="text-foreground font-semibold text-3xl">Résumé :</h2>
                    <p className="text-secondary-foreground">{book.summary}</p>
                </div>
                <div className="w-1/2 flex flex-col gap-5">
                    <h2 className="text-foreground font-semibold text-3xl">Informations complémentaires :</h2>
                    <BookInfos book={book} />
                </div>
            </div>
        </div>
    )
}
