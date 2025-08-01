import { useForm } from "react-hook-form";
import { useToast } from "@/hooks/useToast";
import { useNavigate, useParams } from "react-router-dom";
import { CategoryOption, CreateBookInput } from "@/types/types";
import { useBook } from "@/hooks/useBook";
import { useEffect } from "react";
import FormWrapper from "@/components/UI/form/FormWrapper";
import InputTitle from "./InputTitle";
import InputDescription from "./InputDescription";
import TypeSelect from "@/components/UI/form/TypeSelect";
import { Button } from "@/components/UI/Button";
import { Label } from "@/components/UI/form/Label";

export default function BookForm() {
    const {
        addBook,
        updateBook,
        book,
        categories,
        isUpdating,
        bookLoading,
        bookError,
        loadingCategories,
    } = useBook();
    const navigate = useNavigate();
    const { id: bookId } = useParams();
    const { showToast } = useToast();

    const form = useForm<CreateBookInput>({
        defaultValues: {
            title: "",
            description: "",
            author: "",
            isbn10: "",
            isbn13: "",
            pageCount: 0,
            publishedYear: new Date().getFullYear(),
            language: "fr",
            publisher: "",
            format: "hardcover",
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
                description: book.description,
                author: book.author,
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
                <div>Chargement de l'enquête...</div>
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
                    category: Number(form.category),
                });

                showToast({
                    type: "success",
                    title: "Livre modifié",
                    description: "Votre livre a bien été mis à jour.",
                });
            } else {
                result = await addBook({
                    ...form,
                    category: Number(form.category),
                });

                showToast({
                    type: "success",
                    title: "Livre créée",
                    description: "Votre livre a bien été enregistré.",
                });
            }

            if (result && result.id) {
                navigate(`/books/${result.id}`);
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

    const categoryOptions: CategoryOption[] =
        categories?.map((cat: { id: string; name: string }) => ({
            value: cat.id,
            label: cat.name,
        })) ?? [];

    return (
        <FormWrapper onSubmit={handleSubmit(onFormSubmit)}>
            <h1 className="text-center text-2xl font-bold">
                {bookId ? "Modifier le livre" : "Créer un livre"}
            </h1>
            <InputTitle register={register} errors={errors} />
            <InputDescription register={register} errors={errors} />
            <div>
                <Label htmlFor="category" required>
                    Catégorie
                </Label>
                <TypeSelect
                    control={control}
                    name="category"
                    message="La catégorie est requise"
                    selectSomething="Sélectionner une catégorie"
                    options={categoryOptions}
                    disabled={loadingCategories}
                />
                {errors.category && (
                    <p className="text-destructive-medium-dark text-sm font-medium">
                        {errors.category.message}
                    </p>
                )}
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
