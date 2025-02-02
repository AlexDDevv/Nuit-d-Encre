import { useEffect, useState } from "react";
import { createCategory } from "../../api/createCategory";
import { useMutation, useQuery } from "@apollo/client";
import { queryCategories } from "../../api/categories";
import { Button } from "../StyledButton";
import { Form, FormTitle } from "../styled/PanelAdmin.styles";
import { InputContainer, Label, Input } from "../styled/Form.styles";
import { updateCategory } from "../../api/updateCategory";
import { queryCategory } from "../../api/category";
import { CategoryType } from "../../../types";
import { useToast } from "../Toaster/ToasterHook";

export default function CategoryForm(props: {
    onCategoryCreated: (newId: number) => void;
    onCategoryUpdated: (updatedId: number) => void;
    editingCategoryId?: number;
}) {
    const [name, setName] = useState<string>("");
    const editingCategoryId = props.editingCategoryId;
    const { addToast } = useToast();

    const { data: categoryData } = useQuery<{ category: CategoryType }>(
        queryCategory,
        {
            variables: { categoryId: editingCategoryId ?? null },
            skip: !editingCategoryId,
        }
    );
    const category = categoryData?.category;
    console.log("🚀 ~ category:", category);

    const [doUpdateCategory] = useMutation<{
        updateCategory: { id: number; name: string };
    }>(updateCategory, { refetchQueries: [queryCategories] });

    const [doCreateCategory] = useMutation<{
        createCategory: { id: number; name: string };
    }>(createCategory, { refetchQueries: [queryCategories] });

    console.log("editingCategoryId:", editingCategoryId);

    useEffect(() => {
        if (editingCategoryId !== undefined && category?.name) {
            setName(category.name);
        }
    }, [category, editingCategoryId]);

    const doSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            if (editingCategoryId !== undefined) {
                const category = await doUpdateCategory({
                    variables: {
                        id: editingCategoryId,
                        data: { name },
                    },
                });
                setName("");
                addToast("Catégorie modifiée avec succès !", "success");
                const updatedCategoryId = category.data?.updateCategory.id;
                if (updatedCategoryId !== undefined) {
                    props.onCategoryUpdated(updatedCategoryId);
                }
            } else {
                const category = await doCreateCategory({
                    variables: {
                        data: { name },
                    },
                });
                setName("");
                addToast("Catégorie créée avec succès !", "success");
                const newCategoryId = category.data?.createCategory.id;
                if (newCategoryId) {
                    props.onCategoryCreated(newCategoryId);
                }
            }
        } catch (error) {
            console.error("Une erreur est survenue :", error);
            addToast("Une erreur est survenue.", "error");
        }
    };

    return (
        <Form onSubmit={doSubmit}>
            <FormTitle>
                {editingCategoryId !== undefined
                    ? "Modifier une catégorie"
                    : "Créer une nouvelle catégorie"}
            </FormTitle>
            <InputContainer>
                <Label>Nom de la catégorie</Label>
                <Input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Entrer un nom pour la catégorie"
                />
            </InputContainer>
            <Button width="150px" height="35px">
                {editingCategoryId !== undefined
                    ? "Modifier la catégorie"
                    : "Créer la catégorie"}
            </Button>
        </Form>
    );
}
