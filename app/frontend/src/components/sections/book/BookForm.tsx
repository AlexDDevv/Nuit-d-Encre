import { useForm } from "react-hook-form";
import { useToast } from "@/hooks/toast/useToast";
import { useNavigate, useParams } from "react-router-dom";
import { TypeSelectOptions, CreateBookInput } from "@/types/types";
import { useEffect } from "react";
import {
    LuBookOpen,
    LuBuilding2,
    LuCalendar,
    LuCheck,
    LuFeather,
    LuFileText,
    LuHash,
    LuLanguages,
    LuLayers,
    LuTag,
    LuType,
} from "react-icons/lu";
import AtelierFormShell from "@/components/sections/shared/AtelierFormShell";
import FieldGroupHeader from "@/components/sections/shared/FieldGroupHeader";
import FormNoticeBlock from "@/components/sections/shared/FormNoticeBlock";
import TextField from "@/components/sections/shared/fields/TextField";
import TextareaField from "@/components/sections/shared/fields/TextareaField";
import SelectField from "@/components/sections/shared/fields/SelectField";
import { NocturneLoader } from "@/components/UI/loader";
import { useBookData } from "@/hooks/book/useBookData";
import { useBookMutations } from "@/hooks/book/useBookMutations";
import { useCategoriesData } from "@/hooks/category/useCategoriesData";
import { assertEntityLoaded, runFicheMutation } from "@/utils/ficheForm";

const SUMMARY_MAX = 5000;

const FORMAT_OPTIONS: TypeSelectOptions[] = [
    { label: "Relié", value: "hardcover" },
    { label: "Broché", value: "paperback" },
    { label: "Couverture souple", value: "softcover" },
    { label: "Livre de poche", value: "pocket" },
];

const HEADINGS = {
    create: {
        eyebrow: "Nouvel ouvrage",
        title: "Consigner un ouvrage",
        subtitle:
            "Remplissez les informations du livre pour l'ajouter aux rayons de Nuit d'Encre.",
    },
    edit: {
        eyebrow: "Ouvrage existant",
        title: "Modifier l'ouvrage",
        subtitle:
            "Corrigez la fiche de l'ouvrage déjà consigné dans les registres.",
    },
};

export default function BookForm() {
    const { id: bookId } = useParams();
    const isEdit = Boolean(bookId);

    const { categories, isLoadingCategories, errorCategories } =
        useCategoriesData();

    assertEntityLoaded({
        enabled: true,
        entity: categories,
        error: errorCategories,
        isLoading: isLoadingCategories,
        notFoundNeedle: "Categories not found",
        notFoundMessage: "Categories not found",
        loadErrorMessage: "Failed to fetch categories",
    });

    const { createBook, updateBook, isUpdatingBook } = useBookMutations();
    const { book, isLoadingBook, bookError } = useBookData(bookId);

    const navigate = useNavigate();
    const { showToast } = useToast();

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        setError,
        clearErrors,
        control,
        watch,
        reset,
    } = useForm<CreateBookInput>({
        mode: "all",
        defaultValues: {
            title: "",
            summary: "",
            author: "",
            isbn10: "",
            isbn13: "",
            pageCount: 1,
            publishedYear: new Date().getFullYear(),
            language: "",
            publisher: "",
            format: "pocket",
            category: "",
        },
    });

    useEffect(() => {
        if (isEdit && book) {
            reset({
                title: book.title,
                summary: book.summary,
                author: `${book.author.firstname} ${book.author.lastname}`,
                isbn10: book.isbn10,
                isbn13: book.isbn13,
                pageCount: book.pageCount,
                publishedYear: book.publishedYear,
                language: book.language,
                publisher: book.publisher,
                format: book.format,
                category: book.category.id,
            });
        }
    }, [book, categories, isEdit, reset]);

    if (isEdit && isUpdatingBook) {
        return <NocturneLoader concept="plume" fullscreen label />;
    }

    assertEntityLoaded({
        enabled: isEdit,
        entity: book,
        error: bookError,
        isLoading: isLoadingBook,
        notFoundNeedle: "Failed to fetch book",
        notFoundMessage: "Book not found",
        loadErrorMessage: "Error loading book",
    });

    const onFormSubmit = (values: CreateBookInput) => {
        clearErrors();
        return runFicheMutation({
            perform: () =>
                isEdit && book
                    ? updateBook(book.id, {
                          ...values,
                          category: values.category,
                      })
                    : createBook({ ...values, category: values.category }),
            success: isEdit
                ? {
                      title: "Livre modifié",
                      description: "Votre livre a bien été mis à jour.",
                  }
                : {
                      title: "Livre créée",
                      description: "Votre livre a bien été enregistré.",
                  },
            errorOperation: isEdit ? "updateBook" : "createBook",
            setError,
            showToast,
            onSuccess: (result) =>
                navigate(`/books/${result.id}-${result.title}`),
        });
    };

    const ariaLabel = isSubmitting
        ? isEdit
            ? "Modification..."
            : "Création..."
        : isEdit
          ? "Modifier le livre"
          : "Enregistrer le livre";

    const categoryOptions: TypeSelectOptions[] =
        categories?.map((cat: { id: string; name: string }) => ({
            value: cat.id,
            label: cat.name,
        })) ?? [];

    const isbn13Value = (watch("isbn13") ?? "").trim();
    const heading = HEADINGS[isEdit ? "edit" : "create"];

    return (
        <AtelierFormShell
            icon={LuBookOpen}
            eyebrow={heading.eyebrow}
            title={heading.title}
            subtitle={heading.subtitle}
            formId="book-form"
            onSubmit={handleSubmit(onFormSubmit)}
            isSubmitting={isSubmitting}
            onCancel={() => navigate(-1)}
            submitLabel={
                isEdit ? "Enregistrer les modifications" : "Ajouter le livre"
            }
            submitIcon={
                isEdit ? <LuCheck size={16} /> : <LuBookOpen size={16} />
            }
            submitAriaLabel={ariaLabel}
        >
            <section className="flex flex-col gap-4">
                <FieldGroupHeader hint="Le titre tel qu'il figure en couverture, et la plume qui l'a écrit.">
                    Identité de l'ouvrage
                </FieldGroupHeader>
                <div className="grid items-start gap-4 sm:grid-cols-2">
                    <TextField
                        name="title"
                        label="Titre"
                        icon={LuType}
                        required
                        placeholder="Le titre de l'ouvrage"
                        register={register}
                        errors={errors}
                        rules={{
                            required: "Le titre est requis",
                            maxLength: {
                                value: 255,
                                message:
                                    "Le titre doit contenir 255 caractères maximum.",
                            },
                        }}
                    />
                    <TextField
                        name="author"
                        label="Auteur"
                        icon={LuFeather}
                        required
                        placeholder="Nom complet de l'auteur"
                        register={register}
                        errors={errors}
                        rules={{
                            required:
                                "Le nom et prénom de l'auteur sont requis",
                            maxLength: {
                                value: 255,
                                message:
                                    "Le nom et prénom de l'auteur doivent contenir 255 caractères maximum.",
                            },
                        }}
                    />
                </div>
                <TextareaField
                    name="summary"
                    label="Résumé"
                    required
                    placeholder="Quelques lignes pour donner envie d'ouvrir le livre…"
                    max={SUMMARY_MAX}
                    length={(watch("summary") ?? "").length}
                    register={register}
                    errors={errors}
                    rules={{
                        required: "Le résumé du livre est requis",
                        maxLength: {
                            value: SUMMARY_MAX,
                            message:
                                "Le résumé du livre doit contenir 5000 caractères maximum.",
                        },
                    }}
                />
            </section>

            <section className="flex flex-col gap-4">
                <FieldGroupHeader hint="Données factuelles consignées au registre - fiche de catalogue.">
                    Notice technique
                </FieldGroupHeader>
                <FormNoticeBlock
                    refValue={isbn13Value ? isbn13Value : "-- en attente --"}
                >
                    <TextField
                        name="isbn13"
                        label="ISBN-13"
                        icon={LuHash}
                        mono
                        required
                        inputMode="numeric"
                        placeholder="9782070368228"
                        register={register}
                        errors={errors}
                        rules={{
                            required: "Le ISBN-13 est requis",
                            pattern: {
                                value: /^.{13}$/,
                                message:
                                    "Le ISBN-13 doit contenir exactement 13 caractères.",
                            },
                        }}
                    />
                    <TextField
                        name="isbn10"
                        label="ISBN-10"
                        icon={LuHash}
                        mono
                        inputMode="numeric"
                        placeholder="2070368220 (optionnel)"
                        register={register}
                        errors={errors}
                        rules={{
                            pattern: {
                                value: /^(.{10}|)$/,
                                message:
                                    "Le ISBN-10 doit contenir exactement 10 caractères.",
                            },
                        }}
                    />
                    <TextField
                        name="pageCount"
                        label="Nombre de pages"
                        icon={LuFileText}
                        mono
                        required
                        type="number"
                        step="1"
                        preventDecimal
                        placeholder="384"
                        register={register}
                        errors={errors}
                        rules={{
                            valueAsNumber: true,
                            required: "Le nombre de page est requis",
                            min: {
                                value: 1,
                                message:
                                    "Le nombre de pages doit être au moins de 1.",
                            },
                        }}
                    />
                    <TextField
                        name="publishedYear"
                        label="Année de publication"
                        icon={LuCalendar}
                        mono
                        required
                        type="number"
                        step="1"
                        preventDecimal
                        placeholder="2021"
                        register={register}
                        errors={errors}
                        rules={{
                            valueAsNumber: true,
                            required: "L'année de publication est requise",
                            min: {
                                value: 1000,
                                message:
                                    "L'année de publication doit être une année valide.",
                            },
                        }}
                    />
                    <TextField
                        name="language"
                        label="Langue"
                        icon={LuLanguages}
                        mono
                        required
                        placeholder="fr"
                        register={register}
                        errors={errors}
                        rules={{
                            required: "La langue est requis",
                            maxLength: {
                                value: 5,
                                message:
                                    "La langue doit contenir 5 caractères maximum.",
                            },
                        }}
                    />
                    <TextField
                        name="publisher"
                        label="Éditeur"
                        icon={LuBuilding2}
                        mono
                        required
                        placeholder="Éditions du Crépuscule"
                        register={register}
                        errors={errors}
                        rules={{
                            required: "La maison d'édition est requise",
                            maxLength: {
                                value: 255,
                                message:
                                    "La maison d'édition doit contenir 255 caractères maximum.",
                            },
                        }}
                    />
                </FormNoticeBlock>
            </section>

            <section className="flex flex-col gap-4">
                <FieldGroupHeader hint="Où ranger l'ouvrage dans les rayons de Nuit d'Encre.">
                    Classement
                </FieldGroupHeader>
                <div className="grid gap-4 sm:grid-cols-2">
                    <SelectField
                        name="format"
                        label="Format"
                        icon={LuLayers}
                        required
                        control={control}
                        errors={errors}
                        options={FORMAT_OPTIONS}
                        message="Le format du livre est requis"
                        placeholder="Choisir un format"
                    />
                    <SelectField
                        name="category"
                        label="Catégorie"
                        icon={LuTag}
                        required
                        control={control}
                        errors={errors}
                        options={categoryOptions}
                        message="La catégorie est requise"
                        placeholder="Choisir une catégorie"
                        disabled={isLoadingCategories}
                    />
                </div>
            </section>
        </AtelierFormShell>
    );
}
