import { useState } from "react";
import { createCategory } from "../api/createCategory";
import { useMutation } from "@apollo/client";
import { queryCategories } from "../api/categories";
import { Button } from "./StyledButton";
import { Input } from "../components/styled/Form.styles";
import styled from "styled-components";

export const ModalForm = styled.div`
    background-color: var(--popover);
    border: 1px solid var(--border);
    border-radius: 6px;
    margin-top: 5px;
    padding: 15px 20px;
`;

export const InputContainer = styled.div`
    display: flex;
    flex-direction: column;
    gap: 5px;
`;

export const Label = styled.label`
    color: var(--popover-foreground);
    font-size: 14px;
`;

export const Container = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;

    input {
        width: 75%;
    }
`;

export default function CategoryModal(props: {
    onCategoryCreated: (newId: number) => void;
}) {
    const [name, setName] = useState("");

    const [doCreateCategory, { loading, error }] = useMutation<{
        createCategory: { id: number; name: string };
    }>(createCategory, { refetchQueries: [queryCategories] });

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
        <ModalForm>
            <InputContainer>
                <Label htmlFor="addCategory">
                    Ajouter une nouvelle catégorie
                </Label>
                <Container>
                    <Input
                        type="text"
                        id="addCtagory"
                        placeholder="Ajouter une catégorie..."
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                    <Button
                        minWidth="160px"
                        width="25%"
                        height="35px"
                        transition="background-color 0.2s ease-in-out"
                        backgroundHover="rgba(255, 204, 102, 0.9)"
                        type="button"
                        onClick={addCategory}
                    >
                        Ajouter la catégorie
                    </Button>
                </Container>
            </InputContainer>
        </ModalForm>
    );
}
