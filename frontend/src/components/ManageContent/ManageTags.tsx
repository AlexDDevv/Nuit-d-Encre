import { SquarePen, Trash2 } from "lucide-react";
import { useMutation, useQuery } from "@apollo/client";
import { deleteTag } from "../../api/deleteTag";
import { queryTags } from "../../api/tags";
import { TagType } from "../../../types";
import { useToast } from "../UI/Toaster/ToasterHook";
import ActionButton from "../UI/ActionButton";

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
        <div className="flex flex-col gap-5">
            {tags?.map((tag) => (
                <div
                    key={tag.id}
                    className="bg-card border-border flex w-2xl items-center justify-between gap-5 rounded-lg border p-4"
                >
                    <div>
                        <h5 className="text-card-foreground mb-1.5 font-medium">
                            {tag.name}
                        </h5>
                    </div>
                    <div className="flex items-center justify-center gap-4">
                        <SquarePen
                            onClick={() => showTagForm(tag.id)}
                            className="text-card-foreground hover:text-primary h-5 w-5 cursor-pointer transition-all duration-200 ease-in-out hover:scale-110"
                        />
                        <Trash2
                            onClick={() => onDelete(tag.id)}
                            className="text-card-foreground hover:text-primary h-5 w-5 cursor-pointer transition-all duration-200 ease-in-out hover:scale-110"
                        />
                    </div>
                </div>
            ))}
            <ActionButton
                bgColor="bg-primary"
                color="text-primary-foreground"
                width="w-44"
                content="Créer un tag"
                onClick={() => showTagForm()}
            />
        </div>
    );
}
