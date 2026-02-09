import { useForm } from "react-hook-form";
import { useToast } from "@/hooks/toast/useToast";
import { useNavigate, useParams } from "react-router-dom";
import { CreateAuthorInput } from "@/types/types";
import { useEffect } from "react";
import FormWrapper from "@/components/UI/form/FormWrapper";
import InputName from "@/components/sections/author/inputs/InputName";
import InputNationality from "@/components/sections/author/inputs/InputNationality";
import InputBirthDate from "@/components/sections/author/inputs/InputBirthDate";
import InputBiography from "@/components/sections/author/inputs/InputBiography";
import InputUrl from "@/components/sections/author/inputs/InputUrl";
import { Button } from "@/components/UI/Button";
import Loader from "@/components/UI/Loader";
import { useAuthorMutations } from "@/hooks/author/useAuthorMutations";
import { useAuthorData } from "@/hooks/author/useAuthorData";

export default function AuthorForm() {
    const { id: authorId } = useParams();
    const isEdit = Boolean(authorId);

    const { createAuthor, updateAuthor, isUpdatingAuthor } =
        useAuthorMutations();

    const { author, isLoadingAuthor, authorError } = useAuthorData(authorId);

    const navigate = useNavigate();
    const { showToast } = useToast();

    const form = useForm<CreateAuthorInput>({
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

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        setError,
        clearErrors,
        reset,
    } = form;

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

    if (isEdit) {
        if (!author && authorError) {
            const isNotFoundError = authorError.graphQLErrors.some((error) =>
                error.message.includes("Failed to fetch author"),
            );

            if (isNotFoundError) {
                throw new Response("Author not found", { status: 404 });
            }

            // Pour les autres erreurs GraphQL
            throw new Response("Error loading author", { status: 500 });
        }

        if (!isLoadingAuthor && !author) {
            throw new Response("Author not found", { status: 404 });
        }
    }

    const onFormSubmit = async (form: CreateAuthorInput) => {
        clearErrors();
        try {
            let result;

            if (isEdit && author) {
                result = await updateAuthor(author.id, {
                    ...form,
                });

                showToast({
                    type: "success",
                    title: "Auteur modifié !",
                    description: "L'auteur a bien été mis à jour",
                });
            } else {
                result = await createAuthor({
                    ...form,
                });

                showToast({
                    type: "success",
                    title: "Auteur enregistré !",
                    description: "L'auteur a bien été enregistré",
                });
            }

            if (result && result.id) {
                navigate(
                    `/authors/${result.id}-${result.firstname}-${result.lastname}`,
                );
            }
        } catch (err) {
            const msg =
                err instanceof Error
                    ? err.message
                    : "Erreur lors de la soumission de l'auteur.";

            setError("root", { message: msg });

            showToast({
                type: "error",
                title: "Erreur",
                description: msg,
            });
        }
    };

    const label = isSubmitting
        ? isEdit
            ? "Modification..."
            : "Création..."
        : isEdit
          ? "Modifier l'auteur"
          : "Enregistrer l'auteur";

    return (
        <FormWrapper onSubmit={handleSubmit(onFormSubmit)}>
            <div>
                <h1 className="text-card-foreground text-2xl font-bold">
                    {authorId ? "Modifier l'auteur'" : "Enregistrer un auteur"}
                </h1>
                <p className="text-card-foreground font-medium">
                    {authorId
                        ? "Modifiez les informations de l'auteur."
                        : "Remplissez les informations de l'auteur pour l'ajouter à la collection d'auteurs de Nuit d'Encre."}
                </p>
            </div>
            <div className="flex items-center gap-5">
                <InputName
                    name="lastname"
                    label="Nom"
                    placeholder="Saisissez le nom de l'auteur"
                    register={register}
                    errors={errors}
                />
                <InputName
                    name="firstname"
                    label="Prénom"
                    placeholder="Saisissez le prénom de l'auteur"
                    register={register}
                    errors={errors}
                />
            </div>
            <div className="flex items-center gap-5">
                <InputBirthDate register={register} errors={errors} />
                <InputNationality register={register} errors={errors} />
            </div>
            <InputBiography register={register} errors={errors} />
            <div className="flex items-center gap-5">
                <InputUrl
                    name="wikipediaUrl"
                    label="Wikipedia"
                    placeholder="Saisissez le lien du Wikipedia de l'auteur"
                    register={register}
                    errors={errors}
                />
                <InputUrl
                    name="officialWebsite"
                    label="Site officiel"
                    placeholder="Saisissez le lien du site officiel de l'auteur"
                    register={register}
                    errors={errors}
                />
            </div>
            <Button
                type="submit"
                disabled={isSubmitting}
                fullWidth
                ariaLabel={label}
            >
                {label}
            </Button>
        </FormWrapper>
    );
}
