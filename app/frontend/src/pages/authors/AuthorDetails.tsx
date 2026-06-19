import { useNavigate, useParams } from "react-router-dom";
import {
    FaArrowLeftLong,
    FaBook,
    FaCalendar,
    FaFeatherPointed,
    FaGlobe,
    FaLink,
    FaQuoteLeft,
} from "react-icons/fa6";
import Button from "@/components/UI/Button/Button";
import Banner from "@/components/UI/Banner/Banner";
import XpPill from "@/components/UI/Banner/XpPill";
import BookCard from "@/components/sections/book/BookCard/BookCard";
import EstablishedCover from "@/components/sections/book/detail/EstablishedCover";
import SectionLead from "@/components/sections/book/detail/SectionLead";
import AuthorNotice from "@/components/sections/author/detail/AuthorNotice";
import ExternalLinkChip from "@/components/sections/author/detail/ExternalLinkChip";
import AuthorDetailsSkeleton from "@/components/UI/skeleton/AuthorDetailsSkeleton";
import Diamond from "@/components/UI/Diamond";
import CollectionSeam from "@/components/sections/shared/CollectionSeam";
import SectionHairline from "@/components/sections/shared/SectionHairline";
import EmptyStateCard from "@/components/UI/EmptyStateCard";
import FicheManagementBar from "@/components/sections/shared/FicheManagementBar";
import { useAuthContext } from "@/hooks/auth/useAuthContext";
import { useAuthorData } from "@/hooks/author/useAuthorData";
import { useAuthorMutations } from "@/hooks/author/useAuthorMutations";
import { useToast } from "@/hooks/toast/useToast";
import { hasIncompleteInfo } from "@/lib/utils";
import { getCountryLabel } from "@/lib/filterMaps";

export default function AuthorDetails() {
    const navigate = useNavigate();
    const { deleteAuthor, isDeletingAuthor } = useAuthorMutations();
    const { showToast } = useToast();
    const { slug } = useParams<{ slug: string }>();
    const { user } = useAuthContext();

    if (!slug) {
        throw new Response("Author not found", { status: 404 });
    }

    const idStr = slug.slice(0, 36);
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
        throw new Response("Error loading author", { status: 500 });
    }

    if (!author) {
        throw new Response("Author not found", { status: 404 });
    }

    const isOwner = user && author.user.id === user.id;
    const isAdmin = user && user.role === "admin";
    const canEdit = !!user && (isOwner || isAdmin);
    const canDelete = !!user && isAdmin;
    const showCompletionBanner = !!isOwner && hasIncompleteInfo(author);

    const name = `${author.firstname} ${author.lastname}`;
    const country = getCountryLabel(author.nationality);
    const works = author.books ?? [];
    const worksCount = works.length;
    const bio = author.biography;
    const isExcerpt = !!bio && bio.length > 200;
    const hasExternal = !!(author.wikipediaUrl || author.officialWebsite);

    const externalChips = (
        <>
            {author.wikipediaUrl && (
                <ExternalLinkChip
                    href={author.wikipediaUrl}
                    label="Wikipédia"
                    icon={
                        <FaGlobe
                            size={14}
                            className="text-primary/80"
                            aria-hidden="true"
                        />
                    }
                />
            )}
            {author.officialWebsite && (
                <ExternalLinkChip
                    href={author.officialWebsite}
                    label="Site officiel"
                    icon={
                        <FaLink
                            size={13}
                            className="text-primary/80"
                            aria-hidden="true"
                        />
                    }
                />
            )}
        </>
    );

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
        <div className="mx-auto flex w-full max-w-5xl flex-col gap-16">
            {showCompletionBanner && (
                <Banner
                    variant="completion"
                    title="Les informations de cet auteur sont incomplètes."
                    action={{
                        label: "Compléter",
                        to: `/authors/update/${author.id}`,
                        ariaLabel: `Modifier les informations de l'auteur ${name} pour compléter son profil`,
                        xp: 50,
                    }}
                >
                    Complète-les pour gagner <XpPill amount={50} /> et enrichir
                    la fiche de cet auteur.
                </Banner>
            )}

            {/* retour */}
            <Button
                variant="underlineText"
                size="sm"
                to="/authors"
                ariaLabel="Retourner aux auteurs"
                leftIcon={<FaArrowLeftLong size={14} />}
                className="w-fit"
            >
                Auteurs
            </Button>

            {/* couture « une plume de la maison » */}
            <CollectionSeam
                icon={<FaFeatherPointed size={12} aria-hidden="true" />}
                label="Une plume de la maison"
            />

            {/* HÉRO */}
            <div className="grid gap-10 sm:gap-12 md:grid-cols-[300px_1fr] md:items-start">
                <div className="md:pt-2">
                    <EstablishedCover
                        variant="author"
                        author={{
                            id: author.id,
                            firstname: author.firstname,
                            lastname: author.lastname,
                            createdAt: author.createdAt,
                        }}
                    />
                </div>

                <div className="flex min-w-0 flex-col gap-6">
                    <div className="flex flex-col gap-3">
                        <p className="font-quote text-base italic text-[hsl(43_30%_64%)]">
                            Un auteur de notre bibliothèque
                        </p>
                        <h1 className="text-foreground font-quote text-4xl leading-[1.04] text-balance">
                            {name}
                        </h1>
                        {/* méta en ligne */}
                        <div className="text-muted-foreground flex flex-wrap items-center gap-x-3 gap-y-1.5 font-body text-sm">
                            {country && (
                                <>
                                    <span className="inline-flex items-center gap-1.5">
                                        <FaGlobe
                                            size={13}
                                            className="text-primary/55"
                                            aria-hidden="true"
                                        />
                                        {country}
                                    </span>
                                    <Diamond />
                                </>
                            )}
                            {author.birthDate && (
                                <>
                                    <span className="inline-flex items-center gap-1.5 whitespace-nowrap">
                                        <FaCalendar
                                            size={12}
                                            className="text-primary/55"
                                            aria-hidden="true"
                                        />
                                        Né(e) le {author.birthDate}
                                    </span>
                                    <Diamond />
                                </>
                            )}
                            <span className="inline-flex items-center gap-1.5">
                                <FaBook
                                    size={13}
                                    className="text-primary/55"
                                    aria-hidden="true"
                                />
                                {worksCount === 0
                                    ? "aucun ouvrage"
                                    : `${worksCount} ouvrage${worksCount > 1 ? "s" : ""} au catalogue`}
                            </span>
                        </div>
                    </div>

                    {/* biographie tronquée + lire la suite */}
                    <div className="relative max-w-[54ch]">
                        <FaQuoteLeft
                            size={18}
                            className="text-primary absolute -left-1 -top-1 opacity-40"
                            aria-hidden="true"
                        />
                        {bio ? (
                            <p className="text-foreground/85 font-quote pl-7 text-base italic leading-[1.6]">
                                {isExcerpt
                                    ? `${bio.substring(0, 200)}… `
                                    : `${bio} `}
                                {isExcerpt && (
                                    <a
                                        href="#biography"
                                        className="text-primary hover:text-foreground focus-visible:ring-ring rounded font-body text-sm font-bold not-italic underline decoration-dotted underline-offset-2 transition-colors focus-visible:outline-none focus-visible:ring-2"
                                    >
                                        Lire la suite
                                    </a>
                                )}
                            </p>
                        ) : (
                            <p className="font-quote pl-7 text-base italic leading-[1.6] text-[hsl(20_12%_60%)]">
                                La maison n'a pas encore recueilli de biographie
                                pour {name}. Son œuvre, elle, parle déjà pour
                                elle/lui.
                            </p>
                        )}
                    </div>

                    {/* statistique : nombre d'ouvrages */}
                    <div className="flex flex-wrap items-center gap-3">
                        <span className="border-border inline-flex items-center gap-2 rounded-full border-2 bg-[hsl(20_3%_14%/0.6)] px-3.5 py-2 font-body text-xs">
                            <FaBook
                                size={13}
                                className="text-primary/70"
                                aria-hidden="true"
                            />
                            <span className="text-foreground font-bold">
                                {worksCount}
                            </span>
                            <span className="text-muted-foreground">
                                ouvrage{worksCount > 1 ? "s" : ""}
                            </span>
                        </span>
                    </div>

                    {/* liens externes */}
                    {hasExternal && (
                        <div className="flex flex-col gap-2">
                            <p className="font-mono text-xxs uppercase tracking-[0.18em] text-[hsl(43_30%_60%)]">
                                Pour aller plus loin
                            </p>
                            <div className="flex flex-wrap items-center gap-2.5">
                                {externalChips}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* BIOGRAPHIE COMPLÈTE + NOTICE */}
            <div
                id="biography"
                className="grid scroll-mt-20 gap-8 md:grid-cols-[1fr_0.78fr]"
            >
                <section className="flex flex-col gap-4">
                    <SectionHairline label="La biographie" textClass="text-sm" />
                    {bio ? (
                        <div className="flex flex-col gap-4">
                            {bio.split("\n\n").map((para, i) => (
                                <p
                                    key={i}
                                    className="text-foreground/88 font-quote text-lg leading-[1.72]"
                                >
                                    {para}
                                </p>
                            ))}
                            {hasExternal && (
                                <div className="mt-2 flex flex-wrap items-center gap-2.5">
                                    {externalChips}
                                </div>
                            )}
                        </div>
                    ) : (
                        <EmptyStateCard
                            align="start"
                            iconSize="sm"
                            icon={
                                <FaFeatherPointed
                                    size={18}
                                    className="text-primary/70"
                                    aria-hidden="true"
                                />
                            }
                            title="Aucune biographie pour l'instant."
                            description={
                                <>
                                    La maison rassemble peu à peu ce que l'on
                                    sait de ses auteurs.
                                    {canEdit
                                        ? " Vous pouvez enrichir cette fiche dès maintenant."
                                        : ""}
                                </>
                            }
                        />
                    )}
                </section>

                <AuthorNotice author={author} />
            </div>

            {/* BIBLIOGRAPHIE */}
            <section>
                <SectionLead
                    kicker="Toute son œuvre, chez nous"
                    title={`Les ouvrages de ${name}`}
                    right={
                        worksCount > 0 ? (
                            <span className="text-muted-foreground hidden font-mono text-xs tracking-wide whitespace-nowrap sm:inline">
                                {worksCount} titre{worksCount > 1 ? "s" : ""}
                            </span>
                        ) : undefined
                    }
                />
                {worksCount > 0 ? (
                    <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
                        {works.map((work) => (
                            <BookCard
                                key={work.id}
                                book={{ ...work, author }}
                                className="w-full"
                                isInAuthorPage
                            />
                        ))}
                    </div>
                ) : (
                    <EmptyStateCard
                        align="center"
                        iconSize="md"
                        icon={
                            <FaBook
                                size={20}
                                className="text-primary/70"
                                aria-hidden="true"
                            />
                        }
                        title="Aucun ouvrage au catalogue."
                        description="Cet auteur n'a pas encore d'ouvrage dans la maison."
                    />
                )}
            </section>

            {/* GESTION DE LA FICHE (propriétaire / admin) */}
            <FicheManagementBar
                className="gap-2.5"
                canEdit={!!canEdit}
                canDelete={!!canDelete}
                editTo={`/authors/update/${author.id}`}
                editLabel="Modifier l'auteur"
                editAriaLabel={`Modifier les informations de l'auteur ${name}`}
                onDelete={handleDeleteAuthor}
                isDeleting={isDeletingAuthor}
                deleteAriaLabel={`Supprimer l'auteur ${name} en tant qu'administrateur`}
            />
        </div>
    );
}
