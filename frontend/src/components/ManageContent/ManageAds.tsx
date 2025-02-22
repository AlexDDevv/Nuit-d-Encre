import { Eye, SquarePen, Trash2 } from "lucide-react";
import { AdTypeCard } from "../../../types";
import { useMutation, useQuery } from "@apollo/client";
import { useNavigate, useParams } from "react-router-dom";
import { queryAds } from "../../api/ads";
import { deleteAd } from "../../api/deleteAd";
import { useToast } from "../UI/Toaster/ToasterHook";

interface ManageAdsProps {
    onPreviewAdChange: (id: number | null) => void;
}

export default function ManageAds({ onPreviewAdChange }: ManageAdsProps) {
    const param = useParams<{ id: string }>();
    const id = Number(param.id);
    console.log("🚀 ~ AdminPanel ~ id:", id);
    const navigate = useNavigate();
    const { addToast } = useToast();

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
            addToast("Annonce supprimée avec succès !", "success");
            navigate("/admin", { replace: true });
        } catch (err) {
            console.error("Erreur lors de la suppression :", err);
            addToast("L'annonce n'a pas pu être supprimée.", "error");
        }
    };

    return (
        <div className="flex flex-col gap-5">
            {ads?.map((ad) => (
                <div
                    key={ad.id}
                    className="bg-card border-border flex w-2xl items-center justify-between gap-5 rounded-lg border p-4"
                >
                    <div>
                        <h5 className="text-card-foreground mb-1.5 font-medium">
                            {ad.title}
                        </h5>
                        <h6 className="text-card-foreground mb-1.5">
                            {ad.owner}
                        </h6>
                    </div>
                    <div className="flex items-center justify-center gap-4">
                        <Eye
                            onClick={() => onPreviewAdChange(ad.id)}
                            className="text-card-foreground hover:text-primary h-5 w-5 cursor-pointer transition-all duration-200 ease-in-out hover:scale-110"
                        />
                        <SquarePen
                            onClick={() => onUpdate(ad.id)}
                            className="text-card-foreground hover:text-primary h-5 w-5 cursor-pointer transition-all duration-200 ease-in-out hover:scale-110"
                        />
                        <Trash2
                            onClick={() => onDelete(ad.id)}
                            className="text-card-foreground hover:text-primary h-5 w-5 cursor-pointer transition-all duration-200 ease-in-out hover:scale-110"
                        />
                    </div>
                </div>
            ))}
        </div>
    );
}
