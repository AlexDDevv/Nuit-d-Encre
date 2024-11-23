import { useState } from "react";
import { createCategory } from "../api/createCategory";
import { useMutation } from "@apollo/client";
import { Button } from "./StyledButton";
import styled from "styled-components";

const CategoryForm = styled.div`
    background-color: white;
    border: 1px solid #4f6076;
    border-radius: 6px;
    margin-top: 5px;
    padding: 15px 20px;
`;

const InputContainer = styled.div`
    display: flex;
    flex-direction: column;
    gap: 5px;
`;

const Label = styled.label`
    font-size: 14px;
`;

const CategoryContainer = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;

    button {
        width: 40%;
        height: 37px;
    }
`;

const Input = styled.input`
    background-color: white;
    border: 2px solid #ffa41b;
    border-radius: 8px;
    padding: 10px;
    font-size: 12px;
    width: 60%;

    &::placeholder {
        opacity: 0.8;
        font-style: italic;
    }
`;

export default function CategoryModal(props: {
    onCategoryCreated: (newId: number) => void;
}) {
    const [name, setName] = useState("");

    const [doCreateCategory, { loading, error }] = useMutation<{
        createCategory: { id: number; name: string };
    }>(createCategory);

    const addCategory = async () => {
        const category = await doCreateCategory({
            variables: {
                data: {
                    name,
                },
            },
        });
        console.log(category);

        setName("");

        const newCategoryId = category.data?.createCategory.id;
        if (newCategoryId) {
            props.onCategoryCreated(newCategoryId);
        }
    };

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error : {error.message}</p>;

    return (
        <CategoryForm>
            <InputContainer>
                <Label htmlFor="addCategory">
                    Ajouter une nouvelle catégorie
                </Label>
                <CategoryContainer>
                    <Input
                        type="text"
                        id="addCtagory"
                        placeholder="Ajouter une catégorie..."
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                    <Button type="button" onClick={addCategory}>
                        Ajouter la catégorie
                    </Button>
                </CategoryContainer>
            </InputContainer>
        </CategoryForm>
    );
}
