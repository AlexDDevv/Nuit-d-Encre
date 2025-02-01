import { useEffect, useState } from "react";
import { useMutation, useQuery } from "@apollo/client";
import { Button } from "../StyledButton";
import { Form, FormTitle } from "../styled/PanelAdmin.styles";
import { InputContainer, Label, Input } from "../styled/Form.styles";
import { TagType } from "../../../types";
import { queryTag } from "../../api/tag";
import { updateTag } from "../../api/updateTag";
import { queryTags } from "../../api/tags";
import { createTag } from "../../api/createTag";

export default function TagForm(props: {
    onTagCreated: (newId: number) => void;
    onTagUpdated: (updatedId: number) => void;
    editingTagId?: number;
}) {
    const [name, setName] = useState<string>("");
    const editingTagId = props.editingTagId;

    const { data: tagData } = useQuery<{ tag: TagType }>(queryTag, {
        variables: { tagId: editingTagId ?? null },
        skip: !editingTagId,
    });
    const tag = tagData?.tag;

    const [doUpdateTag] = useMutation<{
        updateTag: { id: number; name: string };
    }>(updateTag, { refetchQueries: [queryTags] });

    const [doCreateTag] = useMutation<{
        createTag: { id: number; name: string };
    }>(createTag, { refetchQueries: [queryTags] });

    useEffect(() => {
        if (editingTagId !== undefined && tag) {
            setName(tag.name);
        }
    }, [tag, editingTagId]);

    const doSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (editingTagId !== undefined) {
            const tag = await doUpdateTag({
                variables: {
                    id: editingTagId,
                    data: { name },
                },
            });
            setName("");
            const updatedTagId = tag.data?.updateTag.id;
            if (updatedTagId !== undefined) {
                props.onTagUpdated(updatedTagId);
            }
        } else {
            const tag = await doCreateTag({
                variables: {
                    data: { name },
                },
            });
            setName("");
            const newTagId = tag.data?.createTag.id;
            if (newTagId) {
                props.onTagCreated(newTagId);
            }
        }
    };

    return (
        <Form onSubmit={doSubmit}>
            <FormTitle>
                {editingTagId !== undefined
                    ? "Modifier un tag"
                    : "Créer un nouveau tag"}
            </FormTitle>
            <InputContainer>
                <Label>Nom du tag</Label>
                <Input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Entrer un nom pour le tag"
                />
            </InputContainer>
            <Button width="150px" height="35px">
                {editingTagId !== undefined
                    ? "Modifier le tag"
                    : "Créer le tag"}
            </Button>
        </Form>
    );
}
