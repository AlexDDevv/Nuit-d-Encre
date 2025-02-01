import { SquarePen, Trash2 } from "lucide-react";
import { useMutation, useQuery } from "@apollo/client";
import {
    ActionsIcons,
    Content,
    ContentToManage,
    Infos,
    Title,
} from "../styled/PanelAdmin.styles";
import { Button } from "../StyledButton";
import { deleteTag } from "../../api/deleteTag";
import { queryTags } from "../../api/tags";
import { TagType } from "../../../types";

interface ManageTagsProps {
    showTagForm: (tagId?: number) => void;
}

export default function ManageTags({ showTagForm }: ManageTagsProps) {
    const { data: tagsData } = useQuery<{ tags: TagType[] }>(queryTags);
    const tags = tagsData?.tags;
    console.log("🚀 ~ tags:", tags);

    const [doDelete] = useMutation(deleteTag, {
        refetchQueries: [queryTags],
    });

    const onDelete = async (id: number) => {
        try {
            await doDelete({
                variables: { id },
            });
        } catch (err) {
            console.error("Erreur lors de la suppression :", err);
        }
    };

    return (
        <ContentToManage>
            {tags?.map((tag) => (
                <Content key={tag.id}>
                    <Infos>
                        <Title>{tag.name}</Title>
                    </Infos>
                    <ActionsIcons>
                        <SquarePen onClick={() => showTagForm(tag.id)} />
                        <Trash2 onClick={() => onDelete(tag.id)} />
                    </ActionsIcons>
                </Content>
            ))}
            <Button width="150px" onClick={() => showTagForm()}>
                Créer un tag
            </Button>
        </ContentToManage>
    );
}
