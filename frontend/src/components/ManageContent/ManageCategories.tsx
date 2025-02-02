import { Eye, SquarePen, Trash2 } from "lucide-react";
import { AdTypeCard, CategoryType } from "../../../types";
import { useMutation, useQuery } from "@apollo/client";
import { queryAds } from "../../api/ads";
import {
    ActionsIcons,
    Content,
    ContentToManage,
    Infos,
    Title,
} from "../styled/PanelAdmin.styles";
import { queryCategories } from "../../api/categories";
import { Button } from "../StyledButton";
import { deleteCategory } from "../../api/deleteCategory";
import { useToast } from "../Toaster/ToasterHook";

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
        queryCategories
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
        <ContentToManage>
            {categories?.map((category) => (
                <Content key={category.id}>
                    <Infos>
                        <Title>{category.name}</Title>
                    </Infos>
                    <ActionsIcons>
                        <Eye
                            onClick={() =>
                                onPreviewAdChange(
                                    category.ads
                                        ? category.ads.map((ad) => ad.id)
                                        : null
                                )
                            }
                        />
                        <SquarePen
                            onClick={() => showCategoryForm(category.id)}
                        />
                        <Trash2 onClick={() => onDelete(category.id)} />
                    </ActionsIcons>
                </Content>
            ))}
            <Button width="150px" onClick={() => showCategoryForm()}>
                Créer une catégorie
            </Button>
        </ContentToManage>
    );
}
