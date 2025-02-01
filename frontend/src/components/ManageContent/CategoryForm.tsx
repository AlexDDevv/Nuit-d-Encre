import { useEffect, useState } from "react";
import { createCategory } from "../../api/createCategory";
import { useMutation, useQuery } from "@apollo/client";
import { queryCategories } from "../../api/categories";
import { Button } from "../StyledButton";
import styled from "styled-components";
import { InputContainer, Label, Input } from "../styled/Form.styles";
import { TabName } from "../styled/PanelAdmin.styles";
import { updateCategory } from "../../api/updateCategory";
import { queryCategory } from "../../api/category";
import { CategoryType } from "../../../types";

const Form = styled.form`
    background-color: var(--card);
    border-radius: 8px;
    display: flex;
    flex-direction: column;
    gap: 20px;
    padding: 20px;
    width: 300px;
`;

const FormTitle = styled(TabName).attrs({ as: "h6" })``;

export default function CategoryForm(props: {
    onCategoryCreated: (newId: number) => void;
    onCategoryUpdated: (updatedId: number) => void;
    editingId?: number;
}) {
    const [name, setName] = useState<string>("");
    const editingId = props.editingId;
    console.log("🚀 ~ editingId:", editingId);

    const { data: categoryData } = useQuery<{ category: CategoryType }>(
        queryCategory,
        { variables: { categoryId: editingId ?? null }, skip: !editingId }
    );
    const category = categoryData?.category;

    const [doUpdateCategory] = useMutation<{
        updateCategory: { id: number; name: string };
    }>(updateCategory, { refetchQueries: [queryCategories] });

    const [doCreateCategory] = useMutation<{
        createCategory: { id: number; name: string };
    }>(createCategory, { refetchQueries: [queryCategories] });

    useEffect(() => {
        if (category) {
            setName(category.name);
        }
    }, [category]);

    const doSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (editingId !== undefined) {
            const category = await doUpdateCategory({
                variables: {
                    id: editingId,
                    data: {
                        name,
                    },
                },
            });
            setName("");
            const updatedCategoryId = category.data?.updateCategory.id;
            if (updatedCategoryId !== undefined) {
                props.onCategoryUpdated(updatedCategoryId);
            }
            return;
        } else {
            const category = await doCreateCategory({
                variables: {
                    data: {
                        name,
                    },
                },
            });
            setName("");
            const newCategoryId = category.data?.createCategory.id;
            if (newCategoryId) {
                props.onCategoryCreated(newCategoryId);
            }
        }
    };

    return (
        <Form onSubmit={doSubmit}>
            <FormTitle>
                {editingId !== undefined
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
                {editingId !== undefined
                    ? "Modifier la catégorie"
                    : "Créer la catégorie"}
            </Button>
        </Form>
    );
}
