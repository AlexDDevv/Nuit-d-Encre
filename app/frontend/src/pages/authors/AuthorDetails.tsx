import AuthorInfos from "@/components/sections/author/AuthorInfos";
import BookCard from "@/components/sections/book/BookCard";
import { Button } from "@/components/UI/Button";
import Links from "@/components/UI/Links";
import Loader from "@/components/UI/Loader";
import { useAuthContext } from "@/hooks/useAuthContext";
import { useAuthor } from "@/hooks/useAuthor";
import { BookCardProps } from "@/types/types";
import { User } from "lucide-react";
import { useParams } from "react-router-dom";

export default function AuthorDetails() {
    const { slug } = useParams<{ slug: string }>();
    const { user } = useAuthContext();

    if (!slug) {
        throw new Response("Author not found", { status: 404 });
    }

    const [idStr] = slug.split("-");
    const id = idStr;

    const { author, authorLoading, authorError } = useAuthor(id);

    if (authorLoading) {
        return <Loader />;
    }

    if (authorError) {
        const isNotFoundError = authorError.graphQLErrors.some((error) =>
            error.message.includes("Failed to fetch author"),
        );

        if (isNotFoundError) {
            throw new Response("Author not found", { status: 404 });
        }

        // Pour les autres erreurs GraphQL
        throw new Response("Error loading author", { status: 500 });
    }

    if (!author) {
        throw new Response("Author not found", { status: 404 });
    }

    const isOwner = user && author.user.id === user.id;

    return (
        <div className="flex flex-col gap-20">
            <div className="flex gap-10">
                <div className="border-border flex h-40 w-40 items-center justify-center rounded-lg border-2">
                    <User className="text-foreground h-32 w-32 stroke-1" />
                </div>
                <div className="flex flex-col gap-6">
                    <h1 className="text-foreground flex gap-2 text-4xl font-bold">
                        <span>{author.firstname}</span>
                        <span>{author.lastname}</span>
                    </h1>
                    <div className="max-w-xl">
                        {author.biography ? (
                            author.biography.length > 200 ? (
                                <p className="text-secondary-foreground">
                                    {author.biography.substring(0, 200)}
                                    ...
                                    <a
                                        href="#biography"
                                        className="text-foreground ml-1 font-semibold"
                                    >
                                        Lire la suite
                                    </a>
                                </p>
                            ) : (
                                <p className="text-secondary-foreground">
                                    {author.biography}
                                </p>
                            )
                        ) : (
                            <p className="text-secondary-foreground">
                                Aucune biographie n'a été enregistrée pour cet
                                auteur.
                            </p>
                        )}
                    </div>
                </div>
            </div>
            <div className="flex gap-20">
                <div id="biography" className="flex w-1/2 flex-col gap-5">
                    <h2 className="text-foreground text-3xl font-semibold">
                        Biographie :
                    </h2>
                    <p className="text-secondary-foreground">
                        {author.biography.substring(0, 1000)}
                        ...
                        <Links
                            href={author.wikipediaUrl}
                            label="Lire la suite sur Wikipedia"
                            category="author"
                            ariaLabel="Consulter la page Wikipedia de ${author.firstname} ${author.lastname} (s'ouvre dans un nouvel onglet)"
                            className="text-foreground ml-1 font-semibold"
                        />
                    </p>
                </div>
                <div className="flex w-1/2 flex-col gap-5">
                    <h2 className="text-foreground text-3xl font-semibold">
                        Informations complémentaires :
                    </h2>
                    <AuthorInfos author={author} />
                </div>
            </div>
            {isOwner && (
                <Button
                    ariaLabel={`Modifier les informations de l'auteur ${author.firstname} ${author.lastname}`}
                    to={`/authors/update/${author.id}`}
                    variant="primary"
                    children="Modifier l'auteur"
                />
            )}
            <section className="bg-muted flex flex-col gap-10 rounded-lg p-6">
                <div className="bg-card flex items-center gap-6 rounded-md p-5">
                    <h3 className="text-muted-foreground font-semibold uppercase tracking-wider">
                        Bibliographie
                    </h3>
                    <span className="text-card-foreground cursor-pointer font-bold italic">
                        Voir plus
                    </span>
                </div>
                <div className="flex flex-wrap items-center gap-10">
                    {author.books.map((book: BookCardProps) => (
                        <BookCard
                            key={book.id}
                            id={book.id}
                            title={book.title}
                            author={author}
                            className="w-60"
                            isInAuthorPage={true}
                        />
                    ))}
                </div>
            </section>
        </div>
    );
}
