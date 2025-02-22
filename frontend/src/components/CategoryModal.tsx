import { useState } from "react";
import { createCategory } from "../api/createCategory";
import { useMutation } from "@apollo/client";
import { queryCategories } from "../api/categories";
import clsx from "clsx";
import ActionButton from "./UI/ActionButton";
import { useToast } from "./UI/Toaster/ToasterHook";

export default function CategoryModal(props: {
    onCategoryCreated: (newId: number) => void;
}) {
    const [name, setName] = useState("");
    const [error, setError] = useState<boolean>(false);
    const { addToast } = useToast();

    const [doCreateCategory] = useMutation<{
        createCategory: { id: number; name: string };
    }>(createCategory, { refetchQueries: [queryCategories] });

    const addCategory = async () => {
        try {
            if (name.trim() === "") {
                setError(true);
                addToast("Le champ ne peut pas être vide.", "error");
                return;
            } else {
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
            }
        } catch (error) {
            console.error("Une erreur est survenue :", error);
            addToast("Une erreur est survenue.", "error");
        }
    };

    return (
        <div className="bg-popover border-border mt-1.5 rounded-md border px-5 py-4">
            <div className="flex flex-col gap-1">
                <label
                    htmlFor="addCategory"
                    className="text-foreground text-sm"
                >
                    Créer une nouvelle catégorie
                </label>
                <div className="flex items-center justify-center gap-2.5">
                    <input
                        type="text"
                        id="addCtagory"
                        placeholder="Créer une catégorie..."
                        value={name}
                        onChange={(e) => {
                            setName(e.target.value);
                            setError(false);
                        }}
                        className={clsx(
                            "bg-input text-accent-foreground focus:outline-ring w-[60%] rounded-lg p-3 text-xs placeholder:italic placeholder:opacity-85 focus:outline-2",
                            error && "border-destructive border",
                        )}
                    />
                    <ActionButton
                        bgColor="bg-primary"
                        color="text-primary-foreground"
                        width="w-[40%]"
                        content="Créer la catégorie"
                        onClick={addCategory}
                    />
                </div>
            </div>
        </div>
    );
}
