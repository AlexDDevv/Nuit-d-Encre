import AuthorInfos from "@/components/sections/author/AuthorInfos";
import BooksBibliography from "@/components/sections/book/BooksBibliography";
import { Button } from "@/components/UI/Button";
import Links from "@/components/UI/Links";
import AuthorDetailsSkeleton from "@/components/UI/skeleton/AuthorDetailsSkeleton";
import { useAuthContext } from "@/hooks/auth/useAuthContext";
import { useAuthorData } from "@/hooks/author/useAuthorData";
import { useAuthorMutations } from "@/hooks/author/useAuthorMutations";
import { useToast } from "@/hooks/toast/useToast";
import { User } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";

export default function AuthorDetails() {
    const navigate = useNavigate();
    const { deleteAuthor, isDeletingAuthor } = useAuthorMutations();
    const { showToast } = useToast();
    const { slug } = useParams<{ slug: string }>();
    const { user } = useAuthContext();

    if (!slug) {
        throw new Response("Author not found", { status: 404 });
    }

    const [idStr] = slug.split("-");
    const id = idStr;

    const { author, isLoadingAuthor, authorError } = useAuthorData(id);

    if (isLoadingAuthor) {
        return <AuthorDetailsSkeleton />;
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
    const isAdmin = user && user.role === "admin";
    const canEdit = !!user && (isOwner || isAdmin);
    const canDelete = !!user && isAdmin;

    const handleDeleteAuthor = async () => {
        try {
            await deleteAuthor(author.id);

            showToast({
                type: "success",
                title: "L'auteur a bien été supprimé !",
                description:
                    "Vous allez être redirigé vers la page d'accueil pour poursuivre votre navigation.",
            });
            navigate("/authors");
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
                    {author.biography ? (
                        <p className="text-secondary-foreground">
                            {author.biography.substring(0, 1000)}
                            ...
                            {author.wikipediaUrl && (
                                <Links
                                    href={author.wikipediaUrl}
                                    label="Lire la suite sur Wikipedia"
                                    category="author"
                                    ariaLabel={`Consulter la page Wikipedia de ${author.firstname} ${author.lastname} (s'ouvre dans un nouvel onglet)`}
                                    className="text-foreground ml-1 font-semibold"
                                />
                            )}
                        </p>
                    ) : (
                        <p className="text-secondary-foreground">
                            Aucune biographie n'a été enregistrée pour cet
                            auteur.
                        </p>
                    )}
                </div>
                <div className="flex w-1/2 flex-col gap-5">
                    <h2 className="text-foreground text-3xl font-semibold">
                        Informations complémentaires :
                    </h2>
                    <AuthorInfos author={author} />
                </div>
            </div>
            <div className="flex gap-5">
                {canEdit && (
                    <Button
                        ariaLabel={`Modifier les informations de l'auteur ${author.firstname} ${author.lastname}`}
                        to={`/authors/update/${author.id}`}
                        variant="primary"
                        children="Modifier l'auteur"
                    />
                )}
                {canDelete && (
                    <Button
                        ariaLabel={`Supprimer l'auteur ${author.firstname} ${author.lastname} en tant qu'administrateur`}
                        variant="destructive"
                        onClick={handleDeleteAuthor}
                        loading={isDeletingAuthor}
                        disabled={isDeletingAuthor}
                    >
                        Supprimer
                    </Button>
                )}
            </div>
            <BooksBibliography author={author} fromAuthorPage={true} />
        </div>
    );
}
