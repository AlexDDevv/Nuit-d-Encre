import { useState } from "react";
import { TagType } from "../../types";
import { useMutation } from "@apollo/client";
import { createTag } from "../api/createTag";
import { queryTags } from "../api/tags";
import { Button } from "./StyledButton";
import { ModalForm, InputContainer, Label, Container } from "./CategoryModal";
import { Input } from "../pages/AdForm";

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
        <ModalForm>
            <InputContainer>
                <Label>Nom du tag :</Label>
                <Container>
                    <Input
                        type="text"
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
                        onClick={doSubmit}
                    >
                        Créer mon tag
                    </Button>
                </Container>
            </InputContainer>
        </ModalForm>
    );
}
