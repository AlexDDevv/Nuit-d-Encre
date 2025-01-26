import {
    ContentToManage,
    Content,
    Infos,
    Title,
    Owner,
    ActionsIcons,
} from "../styled/PanelAdmin.styles";
import { Eye, SquarePen, Trash2 } from "lucide-react";
import { AdTypeCard } from "../../../types";
import { useMutation, useQuery } from "@apollo/client";
import { useNavigate, useParams } from "react-router-dom";
import { queryAds } from "../../api/ads";
import { deleteAd } from "../../api/deleteAd";

interface ManageAdsProps {
    onPreviewAdChange: (id: number | null) => void;
}

export default function ManageAds({ onPreviewAdChange }: ManageAdsProps) {
    const param = useParams<{ id: string }>();
    const id = Number(param.id);
    console.log("🚀 ~ AdminPanel ~ id:", id);
    const navigate = useNavigate();

    const { data: dataAds } = useQuery<{ ads: AdTypeCard[] }>(queryAds, {
        fetchPolicy: "cache-and-network",
    });
    const ads = dataAds?.ads;

    const onUpdate = (id: number | null) => {
        if (!id) {
            console.error("Invalid ad ID");
            return;
        }
        navigate(`/ads/${id}/edit`);
    };

    const [doDelete] = useMutation(deleteAd, {
        refetchQueries: [queryAds],
    });

    const onDelete = async (id: number | null) => {
        try {
            await doDelete({
                variables: { id },
            });

            navigate("/admin", { replace: true });
        } catch (err) {
            console.error("Erreur lors de la suppression :", err);
        }
    };

    return (
        <ContentToManage>
            {ads?.map((ad) => (
                <Content key={ad.id}>
                    <Infos>
                        <Title>{ad.title}</Title>
                        <Owner>{ad.owner}</Owner>
                    </Infos>
                    <ActionsIcons>
                        <Eye onClick={() => onPreviewAdChange(ad.id)} />
                        <SquarePen onClick={() => onUpdate(ad.id)} />
                        <Trash2 onClick={() => onDelete(ad.id)} />
                    </ActionsIcons>
                </Content>
            ))}
        </ContentToManage>
    );
}
