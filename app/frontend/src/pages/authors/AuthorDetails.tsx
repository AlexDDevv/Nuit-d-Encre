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
import BookCard from "@/components/sections/book/BookCard/BookCard";
import EstablishedCover from "@/components/sections/book/detail/EstablishedCover";
import SectionLead from "@/components/sections/book/detail/SectionLead";
import AuthorNotice from "@/components/sections/author/detail/AuthorNotice";
import ExternalLinkChip from "@/components/sections/author/detail/ExternalLinkChip";
import AuthorDetailsSkeleton from "@/components/UI/skeleton/AuthorDetailsSkeleton";
import { useAuthContext } from "@/hooks/auth/useAuthContext";
import { useAuthorData } from "@/hooks/author/useAuthorData";
import { useAuthorMutations } from "@/hooks/author/useAuthorMutations";
import { useToast } from "@/hooks/toast/useToast";
import { hasIncompleteInfo } from "@/lib/utils";
import { getCountryLabel } from "@/lib/filterMaps";

const Diamond = () => (
    <span className="text-primary/40" aria-hidden="true">
        ◆
    </span>
);

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
                to="/authors"
                ariaLabel="Retourner aux auteurs"
                leftIcon={<FaArrowLeftLong size={14} />}
                className="w-fit"
            >
                Auteurs
            </Button>

            {/* couture « une plume de la maison » */}
            <div className="-mt-10 flex items-center gap-3">
                <span className="inline-flex items-center gap-2 whitespace-nowrap font-mono text-[10.5px] uppercase tracking-[0.24em] text-[hsl(43_30%_62%)]">
                    <FaFeatherPointed size={12} aria-hidden="true" /> Une plume de
                    la maison
                </span>
                <span className="h-px flex-1 bg-[linear-gradient(to_right,hsl(43_59%_81%/0.55),hsl(43_59%_81%/0.1))]" />
                <span className="text-primary/90 border-primary/30 inline-flex items-center gap-1.5 whitespace-nowrap rounded-full border bg-[hsl(20_3%_12%/0.6)] px-3 py-1 font-mono text-[10.5px] tracking-wide">
                    <FaFeatherPointed size={11} aria-hidden="true" /> Nuit d'Encre
                </span>
            </div>

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
                        <p className="font-quote text-[15px] italic text-[hsl(43_30%_64%)]">
                            Un auteur de notre bibliothèque
                        </p>
                        <h1 className="text-foreground font-quote text-4xl leading-[1.04] text-balance">
                            {name}
                        </h1>
                        {/* méta en ligne */}
                        <div className="text-muted-foreground flex flex-wrap items-center gap-x-3 gap-y-1.5 font-body text-[13px]">
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
                            <p className="text-foreground/85 font-quote pl-7 text-[16.5px] italic leading-[1.6]">
                                {isExcerpt
                                    ? `${bio.substring(0, 200)}… `
                                    : `${bio} `}
                                {isExcerpt && (
                                    <a
                                        href="#biography"
                                        className="text-primary hover:text-foreground focus-visible:ring-ring rounded font-body text-[13px] font-bold not-italic underline decoration-dotted underline-offset-2 transition-colors focus-visible:outline-none focus-visible:ring-2"
                                    >
                                        Lire la suite
                                    </a>
                                )}
                            </p>
                        ) : (
                            <p className="font-quote pl-7 text-[16.5px] italic leading-[1.6] text-[hsl(20_12%_60%)]">
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
                            <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-[hsl(43_30%_60%)]">
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
                    <div className="flex items-center gap-2.5">
                        <span className="font-quote text-[13px] italic text-[hsl(43_30%_62%)]">
                            La biographie
                        </span>
                        <span className="bg-primary/20 h-px flex-1" />
                    </div>
                    {bio ? (
                        <div className="flex flex-col gap-4">
                            {bio.split("\n\n").map((para, i) => (
                                <p
                                    key={i}
                                    className="text-foreground/88 font-quote text-[17.5px] leading-[1.72]"
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
                        <div className="border-border flex flex-col items-start gap-3 rounded-xl border-2 border-dashed bg-[hsl(20_3%_14%/0.4)] px-6 py-12">
                            <span className="ring-primary/25 grid h-11 w-11 place-items-center rounded-full bg-[hsl(43_30%_25%/0.3)] ring-1">
                                <FaFeatherPointed
                                    size={18}
                                    className="text-primary/70"
                                    aria-hidden="true"
                                />
                            </span>
                            <p className="text-foreground/85 font-quote text-[18px] italic leading-snug">
                                Aucune biographie pour l'instant.
                            </p>
                            <p className="text-muted-foreground max-w-[46ch] font-body text-[13.5px]">
                                La maison rassemble peu à peu ce que l'on sait de
                                ses auteurs.
                                {canEdit
                                    ? " Vous pouvez enrichir cette fiche dès maintenant."
                                    : ""}
                            </p>
                        </div>
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
                            <span className="text-muted-foreground hidden font-mono text-[11px] tracking-wide whitespace-nowrap sm:inline">
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
                    <div className="border-border flex flex-col items-center gap-3 rounded-xl border-2 border-dashed bg-[hsl(20_3%_14%/0.4)] px-6 py-16 text-center">
                        <span className="ring-primary/25 grid h-12 w-12 place-items-center rounded-full bg-[hsl(43_30%_25%/0.3)] ring-1">
                            <FaBook
                                size={20}
                                className="text-primary/70"
                                aria-hidden="true"
                            />
                        </span>
                        <p className="text-foreground/85 font-quote text-[18px] italic">
                            Aucun ouvrage au catalogue.
                        </p>
                        <p className="text-muted-foreground max-w-[44ch] font-body text-[13px]">
                            Cet auteur n'a pas encore d'ouvrage dans la maison.
                        </p>
                    </div>
                )}
            </section>

            {/* GESTION DE LA FICHE (propriétaire / admin) */}
            {(canEdit || canDelete) && (
                <section className="flex items-center justify-between gap-2.5 border-t border-[hsl(0_0%_100%/0.06)] pt-6">
                    <span className="text-muted-foreground font-mono text-[10px] uppercase tracking-[0.2em]">
                        Gestion de la fiche · propriétaire ou administrateur
                    </span>
                    <div className="flex flex-wrap gap-3">
                        {canEdit && (
                            <Button
                                ariaLabel={`Modifier les informations de l'auteur ${name}`}
                                to={`/authors/update/${author.id}`}
                                variant="outline"
                                size="sm"
                            >
                                Modifier l'auteur
                            </Button>
                        )}
                        {canDelete && (
                            <Button
                                ariaLabel={`Supprimer l'auteur ${name} en tant qu'administrateur`}
                                variant="destructive"
                                size="sm"
                                onClick={handleDeleteAuthor}
                                loading={isDeletingAuthor}
                                disabled={isDeletingAuthor}
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
