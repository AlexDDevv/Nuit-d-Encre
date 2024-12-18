import { useState } from "react";
import { TagType } from "../../types";
import { useMutation } from "@apollo/client";
import { createTag } from "../api/createTag";
import { queryTags } from "../api/tags";
import styled from "styled-components";
import { Button } from "./StyledButton";

const TagForm = styled.div`
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

const TagContainer = styled.div`
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

export function TagModal(props: { onTagCreated: (newId: number) => void }) {
    const [name, setName] = useState("");

    const [doCreateTag] = useMutation<{ createTag: TagType }>(createTag, {
        refetchQueries: [queryTags],
    });
    async function doSubmit() {
        try {
            const { data } = await doCreateTag({
                variables: {
                    data: {
                        name,
                    },
                },
            });
            setName("");
            if (data) {
                props.onTagCreated(data.createTag.id);
            }
        } catch (err) {
            console.error(err);
        }
    }

    return (
        <TagForm>
            <InputContainer>
                <Label>Nom du tag :</Label>
                <TagContainer>
                    <Input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                    <Button type="button" onClick={doSubmit}>
                        Créer mon tag
                    </Button>
                </TagContainer>
            </InputContainer>
        </TagForm>
    );
}
