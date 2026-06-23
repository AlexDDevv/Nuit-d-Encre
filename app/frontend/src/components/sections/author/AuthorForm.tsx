import { useForm } from "react-hook-form";
import { useToast } from "@/hooks/toast/useToast";
import { useNavigate, useParams } from "react-router-dom";
import { CreateAuthorInput } from "@/types/types";
import { useEffect } from "react";
import { LuCalendar, LuCheck, LuFeather, LuGlobe, LuLink, LuUser } from "react-icons/lu";
import AtelierFormShell from "@/components/sections/shared/AtelierFormShell";
import FieldGroupHeader from "@/components/sections/shared/FieldGroupHeader";
import TextField from "@/components/sections/shared/fields/TextField";
import TextareaField from "@/components/sections/shared/fields/TextareaField";
import Loader from "@/components/UI/Loader";
import { useAuthorMutations } from "@/hooks/author/useAuthorMutations";
import { useAuthorData } from "@/hooks/author/useAuthorData";
import { assertEntityLoaded, runFicheMutation } from "@/utils/ficheForm";

const BIO_MAX = 10000;

const HEADINGS = {
    create: {
        eyebrow: "Nouvel auteur",
        title: "Inscrire un auteur",
        subtitle:
            "Renseignez l'état civil de l'auteur pour l'inscrire aux registres de la bibliothèque.",
    },
    edit: {
        eyebrow: "Auteur existant",
        title: "Modifier l'auteur",
        subtitle:
            "Mettez à jour la notice de l'auteur déjà inscrit aux registres.",
    },
};

export default function AuthorForm() {
    const { id: authorId } = useParams();
    const isEdit = Boolean(authorId);

    const { createAuthor, updateAuthor, isUpdatingAuthor } =
        useAuthorMutations();
    const { author, isLoadingAuthor, authorError } = useAuthorData(authorId);

    const navigate = useNavigate();
    const { showToast } = useToast();

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        setError,
        clearErrors,
        watch,
        reset,
    } = useForm<CreateAuthorInput>({
        defaultValues: {
            firstname: "",
            lastname: "",
            birthDate: "",
            biography: "",
            nationality: "",
            wikipediaUrl: "",
            officialWebsite: "",
        },
    });

    useEffect(() => {
        if (isEdit && author) {
            reset({
                firstname: author.firstname,
                lastname: author.lastname,
                birthDate: author.birthDate,
                biography: author.biography,
                nationality: author.nationality,
                wikipediaUrl: author.wikipediaUrl,
                officialWebsite: author.officialWebsite,
            });
        }
    }, [author, isEdit, reset]);

    if (isEdit && isUpdatingAuthor) {
        return <Loader />;
    }

    assertEntityLoaded({
        enabled: isEdit,
        entity: author,
        error: authorError,
        isLoading: isLoadingAuthor,
        notFoundNeedle: "Failed to fetch author",
        notFoundMessage: "Author not found",
        loadErrorMessage: "Error loading author",
    });

    const onFormSubmit = (values: CreateAuthorInput) => {
        clearErrors();
        return runFicheMutation({
            perform: () =>
                isEdit && author
                    ? updateAuthor(author.id, { ...values })
                    : createAuthor({ ...values }),
            success: isEdit
                ? {
                    title: "Auteur modifié !",
                    description: "L'auteur a bien été mis à jour",
                }
                : {
                    title: "Auteur enregistré !",
                    description: "L'auteur a bien été enregistré",
                },
            errorOperation: isEdit ? "updateAuthor" : "createAuthor",
            setError,
            showToast,
            onSuccess: (result) =>
                navigate(
                    `/authors/${result.id}-${result.firstname}-${result.lastname}`,
                ),
        });
    };

    const ariaLabel = isSubmitting
        ? isEdit
            ? "Modification..."
            : "Création..."
        : isEdit
            ? "Modifier l'auteur"
            : "Enregistrer l'auteur";

    const heading = HEADINGS[isEdit ? "edit" : "create"];

    return (
        <AtelierFormShell
            icon={LuFeather}
            eyebrow={heading.eyebrow}
            title={heading.title}
            subtitle={heading.subtitle}
            formId="author-form"
            onSubmit={handleSubmit(onFormSubmit)}
            isSubmitting={isSubmitting}
            onCancel={() => navigate(-1)}
            submitLabel={
                isEdit ? "Enregistrer les modifications" : "Ajouter l'auteur"
            }
            submitIcon={isEdit ? <LuCheck size={16} /> : <LuFeather size={16} />}
            submitAriaLabel={ariaLabel}
        >
            <section className="flex flex-col gap-4">
                <FieldGroupHeader hint="Le nom porté en couverture - l'essentiel pour consigner l'auteur.">
                    État civil
                </FieldGroupHeader>
                <div className="grid gap-4 sm:grid-cols-2">
                    <TextField
                        name="lastname"
                        label="Nom"
                        icon={LuUser}
                        required
                        placeholder="Vauthier"
                        register={register}
                        errors={errors}
                        rules={{
                            required: "Nom est requis",
                            maxLength: {
                                value: 255,
                                message:
                                    "Nom doit contenir 255 caractères maximum.",
                            },
                        }}
                    />
                    <TextField
                        name="firstname"
                        label="Prénom"
                        icon={LuUser}
                        required
                        placeholder="Élise"
                        register={register}
                        errors={errors}
                        rules={{
                            required: "Prénom est requis",
                            maxLength: {
                                value: 255,
                                message:
                                    "Prénom doit contenir 255 caractères maximum.",
                            },
                        }}
                    />
                    <TextField
                        name="birthDate"
                        label="Date de naissance"
                        icon={LuCalendar}
                        inputMode="numeric"
                        placeholder="JJ/MM/AAAA"
                        register={register}
                        errors={errors}
                        rules={{
                            pattern: {
                                value: /^\d{2}\/\d{2}\/\d{4}$/,
                                message: "Format attendu : JJ/MM/AAAA",
                            },
                        }}
                    />
                    <TextField
                        name="nationality"
                        label="Nationalité"
                        icon={LuGlobe}
                        placeholder="française"
                        register={register}
                        errors={errors}
                        rules={{
                            maxLength: {
                                value: 100,
                                message:
                                    "La nationalité doit contenir au maximum 100 caractères.",
                            },
                        }}
                    />
                </div>
            </section>

            <section className="flex flex-col gap-4">
                <FieldGroupHeader hint="Quelques lignes sur la vie et l'œuvre - rendu à l'italique, comme une notice manuscrite.">
                    Biographie
                </FieldGroupHeader>
                <TextareaField
                    name="biography"
                    label="Biographie"
                    rows={7}
                    placeholder="Née à… Après des études de…, publie son premier roman en…"
                    max={BIO_MAX}
                    length={(watch("biography") ?? "").length}
                    register={register}
                    errors={errors}
                    rules={{
                        maxLength: {
                            value: BIO_MAX,
                            message:
                                "La biographie du livre doit contenir 10000 caractères maximum.",
                        },
                    }}
                />
            </section>

            <section className="flex flex-col gap-4">
                <FieldGroupHeader hint="Liens publics pour en savoir davantage - facultatifs.">
                    Références externes
                </FieldGroupHeader>
                <div className="grid gap-4 sm:grid-cols-2">
                    <TextField
                        name="wikipediaUrl"
                        label="Wikipédia"
                        icon={LuGlobe}
                        type="url"
                        inputMode="url"
                        placeholder="https://fr.wikipedia.org/wiki/…"
                        register={register}
                        errors={errors}
                        rules={{
                            pattern: {
                                value: /^(https?:\/\/)/,
                                message:
                                    "Veuillez entrer une URL valide (http ou https).",
                            },
                        }}
                    />
                    <TextField
                        name="officialWebsite"
                        label="Site officiel"
                        icon={LuLink}
                        type="url"
                        inputMode="url"
                        placeholder="https://exemple.fr"
                        register={register}
                        errors={errors}
                        rules={{
                            pattern: {
                                value: /^(https?:\/\/)/,
                                message:
                                    "Veuillez entrer une URL valide (http ou https).",
                            },
                        }}
                    />
                </div>
            </section>
        </AtelierFormShell>
    );
}
