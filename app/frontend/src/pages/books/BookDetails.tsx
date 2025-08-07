import SelectBookState from "@/components/UI/SelectBookState";
import { useBook } from "@/hooks/useBook";
import { Link, useParams } from "react-router-dom";

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
            <div className="flex items-center justify-center">
                <div>Chargement du livre...</div>
            </div>
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

    console.log("🚀 ~ BookDetails ~ book:", book)

    return (
        <div>
            <div>
                <div className="max-w-3xs max-h-96">
                    <img src="/images/bookCover.svg" alt="Couverture d'un livre" className="w-full h-full" />
                </div>
                <div>
                    <div>
                        <h1>{book.title}</h1>
                        <h2>{book.author.firstname} {book.author.lastname}</h2>
                    </div>
                    <div>
                        {book.summary.length > 200 ? (
                            <p>
                                {book.summary.substring(
                                    0,
                                    200,
                                )}
                                ...
                                <Link
                                    to="#summary"
                                    className="ml-1"
                                >
                                    Lire la suite
                                </Link>
                            </p>
                        ) : (
                            <p className="font-bodyFont text-foreground max-w-[650px] text-lg">
                                {book.summary}
                            </p>
                        )}
                    </div>
                    <SelectBookState />
                </div>
            </div>
            <div>

            </div>
        </div>
    )
}
