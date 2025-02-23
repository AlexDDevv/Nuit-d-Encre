import { useEffect, useState } from "react";
import { createCategory } from "../../api/createCategory";
import { useMutation, useQuery } from "@apollo/client";
import { queryCategories } from "../../api/categories";
import { updateCategory } from "../../api/updateCategory";
import { queryCategory } from "../../api/category";
import { CategoryType } from "../../../types";
import { useToast } from "../UI/Toaster/ToasterHook";
import clsx from "clsx";
import ActionButton from "../UI/ActionButton";

export default function CategoryForm(props: {
    onCategoryCreated: (newId: number) => void;
    onCategoryUpdated: (updatedId: number) => void;
    editingCategoryId?: number;
}) {
    const [name, setName] = useState<string>("");
    const [error, setError] = useState<boolean>(false);
    const editingCategoryId = props.editingCategoryId;
    const { addToast } = useToast();

    const { data: categoryData } = useQuery<{ category: CategoryType }>(
        queryCategory,
        {
            variables: { categoryId: editingCategoryId ?? null },
            skip: !editingCategoryId,
        },
    );
    const category = categoryData?.category;
    console.log("🚀 ~ category:", category);

    const [doUpdateCategory] = useMutation<{
        updateCategory: { id: number; name: string };
    }>(updateCategory, { refetchQueries: [queryCategories] });

    const [doCreateCategory] = useMutation<{
        createCategory: { id: number; name: string };
    }>(createCategory, { refetchQueries: [queryCategories] });

    const { data: categoriesData } = useQuery<{ categories: CategoryType[] }>(
        queryCategories,
    );
    const categories = categoriesData?.categories;

    useEffect(() => {
        if (editingCategoryId !== undefined && category?.name) {
            setName(category.name);
        } else {
            setName("");
        }
    }, [category, editingCategoryId]);

    const checkExistingCategory = (name: string) => {
        return categories?.find(
            (category: CategoryType) =>
                category.name.toLowerCase() === name.toLowerCase(),
        );
    };

    const doSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const trimmedName = name.trim();

        if (trimmedName === "") {
            setError(true);
            addToast("Le champ ne peut pas être vide", "error");
            return;
        }

        if (trimmedName.length < 2) {
            setError(true);
            addToast(
                "Le nom de la catégorie doit contenir au moins 2 caractères",
                "error",
            );
            return;
        }

        try {
            if (editingCategoryId !== undefined) {
                const existingCategory = checkExistingCategory(trimmedName);

                if (existingCategory) {
                    setError(true);
                    addToast("Veuillez saisir un nom différent", "error");
                    return;
                }

                const category = await doUpdateCategory({
                    variables: {
                        id: editingCategoryId,
                        data: { name },
                    },
                });

                setName("");
                setError(false);
                addToast("Catégorie modifiée avec succès !", "success");

                const updatedCategoryId = category.data?.updateCategory.id;

                if (updatedCategoryId !== undefined) {
                    props.onCategoryUpdated(updatedCategoryId);
                }
            } else {
                const existingCategory = checkExistingCategory(trimmedName);

                if (existingCategory) {
                    setError(true);
                    addToast("La catégorie existe déjà", "error");
                    return;
                }

                const category = await doCreateCategory({
                    variables: {
                        data: { name },
                    },
                });

                setName("");
                setError(false);
                addToast("Catégorie créée avec succès !", "success");

                const newCategoryId = category.data?.createCategory.id;

                if (newCategoryId) {
                    props.onCategoryCreated(newCategoryId);
                }
            }
        } catch (error) {
            setError(true);
            console.error("Une erreur est survenue :", error);
            addToast("Une erreur est survenue.", "error");
        }
    };

    return (
        <form
            onSubmit={doSubmit}
            className="bg-card border-border flex w-80 flex-col gap-5 rounded-lg border p-5"
        >
            <h6 className="text-card-foreground font-title text-lg font-bold">
                {editingCategoryId !== undefined
                    ? "Modifier une catégorie"
                    : "Créer une nouvelle catégorie"}
            </h6>
            <div className="flex flex-col gap-1">
                <label className="text-card-foreground text-sm">
                    Nom de la catégorie
                </label>
                <input
                    type="text"
                    value={name}
                    onChange={(e) => {
                        setName(e.target.value);
                        setError(false);
                    }}
                    placeholder="Entrer un nom pour la catégorie"
                    className={clsx(
                        "bg-input text-accent-foreground focus:outline-ring rounded-lg p-3 text-xs placeholder:italic placeholder:opacity-85 focus:outline-2",
                        error &&
                            "border-destructive outline-destructive border",
                    )}
                />
            </div>
            <ActionButton
                type="submit"
                bgColor="bg-primary"
                color="text-primary-foreground"
                content={
                    editingCategoryId !== undefined
                        ? "Modifier la catégorie"
                        : "Créer la catégorie"
                }
            />
        </form>
    );
}
