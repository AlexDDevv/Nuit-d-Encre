import { useState } from "react";
import { TagType } from "../../types";
import { useMutation } from "@apollo/client";
import { createTag } from "../api/createTag";
import { queryTags } from "../api/tags";
import clsx from "clsx";
import ActionButton from "./UI/ActionButton";
import { useToast } from "./UI/Toaster/ToasterHook";

export function TagModal(props: { onTagCreated: (newId: number) => void }) {
    const [name, setName] = useState("");
    const [error, setError] = useState<boolean>(false);
    const { addToast } = useToast();

    const [doCreateTag] = useMutation<{ createTag: TagType }>(createTag, {
        refetchQueries: [queryTags],
    });

    const addTag = async () => {
        try {
            if (name.trim() === "") {
                setError(true);
                addToast("Le champ ne peut pas être vide.", "error");
                return;
            } else {
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
            }
        } catch (error) {
            console.error("Une erreur est survenue :", error);
            addToast("Une erreur est survenue.", "error");
        }
    };

    return (
        <div className="bg-popover border-border mt-1.5 rounded-md border px-5 py-4">
            <div className="flex flex-col gap-1">
                <label htmlFor="addTag" className="text-foreground text-sm">
                    Créer un nouveau tag
                </label>
                <div className="flex items-center justify-center gap-2.5">
                    <input
                        type="text"
                        id="addTag"
                        placeholder="Créer un tag..."
                        value={name}
                        onChange={(e) => {
                            setName(e.target.value);
                            setError(false);
                        }}
                        className={clsx(
                            "bg-input text-accent-foreground focus:outline-ring w-2/3 rounded-lg p-3 text-xs placeholder:italic placeholder:opacity-85 focus:outline-2",
                            error && "border-destructive border",
                        )}
                    />
                    <ActionButton
                        bgColor="bg-primary"
                        color="text-primary-foreground"
                        width="w-1/3"
                        content="Créer le tag"
                        onClick={addTag}
                    />
                </div>
            </div>
        </div>
    );
}
