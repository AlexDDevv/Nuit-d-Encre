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
import { useToast } from "../UI/Toaster/ToasterHook";

interface ManageTagsProps {
    showTagForm: (tagId?: number) => void;
}

export default function ManageTags({ showTagForm }: ManageTagsProps) {
    const { addToast } = useToast();

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
            addToast("Tag supprimé avec succès !", "success");
        } catch (err) {
            console.error("Erreur lors de la suppression :", err);
            addToast("Le tag n'a pas pu être supprimé.", "error");
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
