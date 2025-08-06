import { useForm } from "react-hook-form";
import { useToast } from "@/hooks/useToast";
import { useNavigate, useParams } from "react-router-dom";
import { TypeSelectOptions, CreateBookInput } from "@/types/types";
import { useBook } from "@/hooks/useBook";
import { useEffect } from "react";
import FormWrapper from "@/components/UI/form/FormWrapper";
import InputTitle from "@/components/sections/book/inputs/InputTitle";
import InputSummary from "@/components/sections/book/inputs/InputSummary";
import InputCategory from "@/components/sections/book/inputs/InputCategory";
import InputAuthor from "@/components/sections/book/inputs/InputAuthor";
import InputIsbn from "@/components/sections/book/inputs/InputIsbn";
import InputPage from "@/components/sections/book/inputs/InputPage";
import InputPublishedYear from "@/components/sections/book/inputs/InputPublishedYear";
import InputLanguage from "@/components/sections/book/inputs/InputLanguage";
import InputPublisher from "@/components/sections/book/inputs/InputPublisher";
import InputFormat from "@/components/sections/book/inputs/InputFormat";
import { Button } from "@/components/UI/Button";

export default function BookForm() {
    const { id: bookId } = useParams();
    const {
        addBook,
        updateBook,
        book,
        categories,
        isUpdating,
        bookLoading,
        bookError,
        loadingCategories,
    } = useBook(bookId);
    const navigate = useNavigate();
    const { showToast } = useToast();

    const form = useForm<CreateBookInput>({
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

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        setError,
        clearErrors,
        control,
        reset,
    } = form;

    useEffect(() => {
        if (book) {
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
                category: book.category.id.toString(),
            });
        }
    }, [book, categories, reset]);

    if (bookId && isUpdating) {
        return (
            <div className="flex items-center justify-center">
                <div>Chargement du livre...</div>
            </div>
        );
    }

    if (bookId) {
        if (!book && bookError) {
            const isNotFoundError = bookError.graphQLErrors.some((error) =>
                error.message.includes("Failed to fetch book"),
            );

            if (isNotFoundError) {
                throw new Response("Book not found", { status: 404 });
            }

            // Pour les autres erreurs GraphQL
            throw new Response("Error loading book", { status: 500 });
        }

        if (!bookLoading && !book) {
            throw new Response("Book not found", { status: 404 });
        }
    }

    const onFormSubmit = async (form: CreateBookInput) => {
        clearErrors();
        try {
            let result;

            if (book) {
                result = await updateBook(book.id, {
                    ...form,
                    category: form.category,
                });

                showToast({
                    type: "success",
                    title: "Livre modifié",
                    description: "Votre livre a bien été mis à jour.",
                });
            } else {
                result = await addBook({
                    ...form,
                    category: form.category,
                });

                showToast({
                    type: "success",
                    title: "Livre créée",
                    description: "Votre livre a bien été enregistré.",
                });
            }

            if (result && result.id) {
                navigate(`/books/${result.title}`);
            }
        } catch (err) {
            const msg =
                err instanceof Error
                    ? err.message
                    : "Erreur lors de la soumission du livre.";

            setError("root", { message: msg });

            showToast({
                type: "error",
                title: "Erreur",
                description: msg,
            });
        }
    };

    const isEdit = Boolean(bookId);
    const label = isSubmitting
        ? isEdit
            ? "Modification..."
            : "Création..."
        : isEdit
            ? "Modifier le livre"
            : "Créer le livre";

    const categoryOptions: TypeSelectOptions[] =
        categories?.map((cat: { id: string; name: string }) => ({
            value: cat.id,
            label: cat.name,
        })) ?? [];

    return (
        <FormWrapper onSubmit={handleSubmit(onFormSubmit)}>
            <div>
                <h1 className="text-2xl font-bold text-card-foreground">
                    {bookId ? "Modifier le livre" : "Créer un livre"}
                </h1>
                <p className="font-medium text-card-foreground">
                    {bookId ? "Modifier les informations du livre." : "Remplissez les informations du livre pour l'ajouter à la bibliothèque de Nuit d'Encre."}
                </p>
            </div>
            <div className="flex items-center gap-5">
                <InputTitle register={register} errors={errors} />
                <InputAuthor register={register} errors={errors} />
            </div>
            <InputSummary register={register} errors={errors} />
            <div className="flex items-center gap-5">
                <InputCategory control={control} categoryOptions={categoryOptions} loadingCategories={loadingCategories} errors={errors} />
                <InputFormat control={control} errors={errors} />
            </div>
            <div className="flex items-center gap-5">
                <InputIsbn isbn13 register={register} errors={errors} />
                <InputIsbn isbn13={false} register={register} errors={errors} />
            </div>
            <div className="flex items-center gap-5">
                <InputPage register={register} errors={errors} />
                <InputLanguage register={register} errors={errors} />
            </div>
            <div className="flex items-center gap-5">
                <InputPublishedYear register={register} errors={errors} />
                <InputPublisher register={register} errors={errors} />
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
