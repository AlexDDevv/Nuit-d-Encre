import { Eye, SquarePen, Trash2 } from "lucide-react";
import { AdTypeCard, CategoryType } from "../../../types";
import { useMutation, useQuery } from "@apollo/client";
import { queryAds } from "../../api/ads";
import { queryCategories } from "../../api/categories";
import { deleteCategory } from "../../api/deleteCategory";
import { useToast } from "../UI/Toaster/ToasterHook";
import ActionButton from "../UI/ActionButton";

interface ManageCategoriesProps {
    onPreviewAdChange: (ids: number[] | null) => void;
    showCategoryForm: (categoryId?: number) => void;
}

export default function ManageCategories({
    onPreviewAdChange,
    showCategoryForm,
}: ManageCategoriesProps) {
    const { addToast } = useToast();

    const { data: categoriesData } = useQuery<{ categories: CategoryType[] }>(
        queryCategories,
    );
    const categories = categoriesData?.categories;

    const { data: dataAds } = useQuery<{ ads: AdTypeCard[] }>(queryAds, {
        fetchPolicy: "cache-and-network",
    });
    const ads = dataAds?.ads;
    console.log("🚀 ~ ads:", ads);

    const [doDelete] = useMutation(deleteCategory, {
        refetchQueries: [queryCategories],
    });

    const onDelete = async (id: number) => {
        try {
            await doDelete({
                variables: { id },
            });
            addToast("Catégorie supprimée avec succès !", "success");
        } catch (err) {
            console.error("Erreur lors de la suppression :", err);
            addToast("La catégorie n'a pas pu être supprimée.", "error");
        }
    };

    return (
        <div className="flex flex-col gap-5">
            {categories?.map((category) => (
                <div
                    key={category.id}
                    className="bg-card border-border flex w-2xl items-center justify-between gap-5 rounded-lg border p-4"
                >
                    <div>
                        <h5 className="text-card-foreground font-title text-lg font-semibold">
                            {category.name}
                        </h5>
                    </div>
                    <div className="flex items-center justify-center gap-4">
                        <Eye
                            onClick={() =>
                                onPreviewAdChange(
                                    category.ads
                                        ? category.ads.map((ad) => ad.id)
                                        : null,
                                )
                            }
                            className="text-card-foreground hover:text-primary h-5 w-5 cursor-pointer transition-all duration-200 ease-in-out hover:scale-110"
                        />
                        <SquarePen
                            onClick={() => showCategoryForm(category.id)}
                            className="text-card-foreground hover:text-primary h-5 w-5 cursor-pointer transition-all duration-200 ease-in-out hover:scale-110"
                        />
                        <Trash2
                            onClick={() => onDelete(category.id)}
                            className="text-card-foreground hover:text-primary h-5 w-5 cursor-pointer transition-all duration-200 ease-in-out hover:scale-110"
                        />
                    </div>
                </div>
            ))}
            <ActionButton
                bgColor="bg-primary"
                color="text-primary-foreground"
                width="w-44"
                content="Créer une catégorie"
                onClick={() => showCategoryForm()}
            />
        </div>
    );
}
