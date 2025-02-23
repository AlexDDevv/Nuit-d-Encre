import { Link, useNavigate, useParams } from "react-router-dom";
import { User, ChevronRight, Clock, LockKeyhole } from "lucide-react";
import { AdType } from "../../types";
import { useQuery, useMutation } from "@apollo/client";
import { queryAd } from "../api/ad";
import { deleteAd } from "../api/deleteAd";
import { queryAds } from "../api/ads";
import { whoami } from "../api/whoami";
import { useToast } from "../components/UI/Toaster/ToasterHook";
import ActionButton from "../components/UI/ActionButton";

export default function AdPage() {
    const param = useParams<{ id: string }>();
    const id = Number(param.id);
    const navigate = useNavigate();
    const { addToast } = useToast();

    const { data: whoamiData } = useQuery(whoami);
    const me = whoamiData?.whoami;
    console.log("🚀 ~ AdPage ~ me:", me);

    const { data: adData } = useQuery<{ ad: AdType }>(queryAd, {
        variables: { adId: id },
    });
    const ad = adData?.ad;
    console.log("🚀 ~ AdPage ~ ad:", ad);

    const [doDelete] = useMutation(deleteAd, {
        refetchQueries: [queryAds],
    });

    const onDelete = async () => {
        try {
            await doDelete({
                variables: { id },
            });
            addToast("Annonce supprimée avec succès !", "success");
            navigate("/", { replace: true });
        } catch (err) {
            console.error("Erreur lors de la suppression :", err);
            addToast("L'annonce n'a pas pu être supprimée.", "error");
        }
    };

    const onUpdate = () => {
        navigate(`/ads/${id}/edit`);
    };

    const date = ad?.createdAt;
    const newDate = date ? new Date(date) : null;
    const frenchDate = newDate?.toLocaleDateString("fr");

    return (
        <>
            {ad && (
                <>
                    <div className="mx-auto max-w-5xl">
                        <div className="mb-12 flex justify-between gap-8">
                            <div className="flex flex-col gap-4">
                                <div className="flex h-[450px] w-[450px] overflow-hidden rounded-xl">
                                    {ad.picture.length > 0 &&
                                        ad.picture.map((item, i) => (
                                            <img
                                                key={i}
                                                src={item}
                                                alt={`Ce qui est vendu par ${ad.owner}`}
                                                className="h-full w-full object-cover"
                                            />
                                        ))}
                                </div>
                                <div className="flex flex-col gap-4">
                                    <h1 className="text-foreground font-title text-2xl font-bold">
                                        {ad.title}
                                    </h1>
                                    <div className="flex items-center gap-2.5">
                                        <h2 className="text-foreground font-title text-lg font-semibold">
                                            {ad.price} €
                                        </h2>
                                        <span className="bg-accent text-accent-foreground rounded-2xl px-2.5 py-0.5 text-xs font-semibold">
                                            Livraison : à partir de 4,99 €
                                        </span>
                                    </div>
                                    <div className="flex gap-1.5">
                                        <p className="text-foreground text-sm">
                                            Payez en
                                        </p>
                                        <div className="flex h-6 w-6 items-center justify-center rounded-full bg-[#84b92b]">
                                            <span className="text-xs font-bold text-white">
                                                3x
                                            </span>
                                        </div>
                                        <p className="text-foreground text-sm">
                                            à partir de 56,66 €/mois
                                        </p>
                                    </div>
                                    <p className="text-foreground text-xs">
                                        Annonce créée le {frenchDate}
                                    </p>
                                </div>
                            </div>
                            <div className="bg-card border-border h-full min-w-96 rounded-xl border px-4 py-5">
                                <div className="border-border border-b pb-5">
                                    <div className="mb-7 flex items-center justify-between gap-5">
                                        <div className="flex items-center justify-center gap-2.5">
                                            <div className="bg-primary border-border flex h-16 w-16 cursor-pointer items-center justify-center rounded-full border">
                                                <User className="text-primary-foreground h-5 w-5" />
                                            </div>
                                            <Link
                                                to="#"
                                                className="text-card-foreground"
                                            >
                                                {me?.role === "admin" ||
                                                me?.id === ad.createdBy.id
                                                    ? ad.owner
                                                    : "●●●●●@●●●●●.com"}
                                            </Link>
                                        </div>
                                        <ChevronRight className="text-card-foreground cursor-pointer" />
                                    </div>
                                    <div className="text-card-foreground flex items-center gap-1.5">
                                        <Clock className="h-4 w-4" />
                                        <p className="text-sm">
                                            Répond en moyenne en 1j
                                        </p>
                                    </div>
                                </div>
                                <div className="text-center">
                                    <div className="mb-5 flex flex-col items-center justify-center gap-2.5">
                                        <ActionButton
                                            bgColor="bg-primary"
                                            color="text-primary-foreground"
                                            width="w-full"
                                            content="Acheter"
                                        />
                                        <ActionButton
                                            bgColor="bg-secondary"
                                            color="text-secondary-foreground"
                                            width="w-full"
                                            content="Message"
                                        />
                                    </div>
                                    <div className="flex items-center justify-center gap-2.5">
                                        <LockKeyhole className="text-foreground h-5 w-5" />
                                        <p className="text-foreground">
                                            Paiement sécurisé
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="flex flex-col gap-5">
                            <div>
                                <h3 className="text-foreground font-title mb-1.5 text-lg font-medium">
                                    Description de l'annonce :
                                </h3>
                                <p className="text-foreground">
                                    {ad.description}
                                </p>
                            </div>
                            <div>
                                <h3 className="text-foreground font-title mb-1.5 text-lg font-medium">
                                    Localisation de l'annonce :
                                </h3>
                                <p className="text-foreground">{ad.location}</p>
                            </div>

                            <div>
                                <h3 className="text-foreground font-title mb-1.5 text-lg font-medium">
                                    Category de l'annonce :
                                </h3>
                                <p className="text-foreground">
                                    {ad.category?.name}
                                </p>
                            </div>
                            {ad.tags && ad.tags.length > 0 && (
                                <div>
                                    <h3 className="text-foreground font-title mb-1.5 text-lg font-medium">
                                        Tag
                                    </h3>
                                    <p className="text-foreground">
                                        {ad?.tags[0].name}
                                    </p>
                                </div>
                            )}
                            {(me?.role === "admin" ||
                                me?.id === ad.createdBy.id) && (
                                <div className="flex items-center gap-5">
                                    <ActionButton
                                        bgColor="bg-destructive"
                                        color="text-destructive-foreground"
                                        content="Supprimer l'annonce"
                                        onClick={onDelete}
                                    />
                                    <ActionButton
                                        bgColor="bg-primary"
                                        color="text-primary-foreground"
                                        content="Modifier l'annonce"
                                        onClick={onUpdate}
                                    />
                                </div>
                            )}
                        </div>
                    </div>
                </>
            )}
        </>
    );
}
