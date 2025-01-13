import { Link, useNavigate, useParams } from "react-router-dom";
import { User, ChevronRight, Clock, LockKeyhole } from "lucide-react";
import { AdType } from "../../types";
import { useQuery, useMutation } from "@apollo/client";
import { queryAd } from "../api/ad";
import { deleteAd } from "../api/deleteAd";
import { queryAds } from "../api/ads";
import {
    ContainerSelectedAd,
    ImgAndSeller,
    AdInformations,
    ImageContainer,
    InformationsContainer,
    PriceContainer,
    SpanDelivery,
    WithoutCharge,
    Triple,
    AdDate,
    ActionsContainer,
    SellerContainer,
    Seller,
    AvatarContainer,
    Avatar,
    TimeResponse,
    UserActions,
    BtnsContainer,
    Button,
    Paiement,
    MoreInformations,
    UserBtnsContainer,
} from "../components/styled/Ad.styles";

export default function AdPage() {
    const param = useParams<{ id: string }>();
    const id = Number(param.id);
    const navigate = useNavigate();

    const {
        loading: adLoading,
        error: adError,
        data: adData,
    } = useQuery<{ ad: AdType }>(queryAd, {
        variables: { adId: id },
    });
    const ad = adData?.ad;

    const [doDelete] = useMutation(deleteAd, {
        refetchQueries: [queryAds],
    });

    const onDelete = async () => {
        try {
            await doDelete({
                variables: { id },
            });

            navigate("/", { replace: true });
        } catch (err) {
            console.error("Erreur lors de la suppression :", err);
        }
    };

    const onUpdate = () => {
        navigate(`/ads/${id}/edit`);
    };

    if (adLoading) return <p>Loading...</p>;
    if (adError) return <p>Error : {adError.message}</p>;

    const date = ad?.createdAt;
    const newDate = date ? new Date(date) : null;
    const frenchDate = newDate?.toLocaleDateString("fr");

    return (
        <>
            {ad && (
                <>
                    <ContainerSelectedAd>
                        <ImgAndSeller>
                            <AdInformations>
                                <ImageContainer>
                                    {ad.picture.length > 0 &&
                                        ad.picture.map((item, i) => (
                                            <img
                                                key={i}
                                                src={item}
                                                alt={`Ce qui est vendu par ${ad.owner}`}
                                            />
                                        ))}
                                </ImageContainer>
                                <InformationsContainer>
                                    <h1>{ad.title}</h1>
                                    <PriceContainer>
                                        <h2>{ad.price} €</h2>
                                        <SpanDelivery>
                                            Livraison : à partir de 4,99 €
                                        </SpanDelivery>
                                    </PriceContainer>
                                    <WithoutCharge>
                                        <p>Payez en</p>
                                        <Triple>
                                            <span>3x</span>
                                        </Triple>
                                        <span>à partir de 56,66 €/mois</span>
                                    </WithoutCharge>
                                    <AdDate>
                                        Annonce créée le {frenchDate}
                                    </AdDate>
                                </InformationsContainer>
                            </AdInformations>
                            <ActionsContainer>
                                <SellerContainer>
                                    <Seller>
                                        <AvatarContainer>
                                            <Avatar>
                                                <User />
                                            </Avatar>
                                            <Link to="#">{ad.owner}</Link>
                                        </AvatarContainer>
                                        <ChevronRight />
                                    </Seller>
                                    <TimeResponse>
                                        <Clock />
                                        <p>Répond en moyenne en 1j</p>
                                    </TimeResponse>
                                </SellerContainer>
                                <UserActions>
                                    <BtnsContainer>
                                        <Button
                                            bgColor="var(--primary)"
                                            color="var(--primary-foreground)"
                                        >
                                            Acheter
                                        </Button>
                                        <Button
                                            bgColor="var(--secondary)"
                                            color="var(--secondary-foreground)"
                                        >
                                            Message
                                        </Button>
                                    </BtnsContainer>
                                    <Paiement>
                                        <LockKeyhole />
                                        <p>Paiement sécurisé</p>
                                    </Paiement>
                                </UserActions>
                            </ActionsContainer>
                        </ImgAndSeller>
                        <MoreInformations>
                            <div>
                                <h3>Description de l'annonce :</h3>
                                <p>{ad.description}</p>
                            </div>
                            <div>
                                <h3>Localisation de l'annonce :</h3>
                                <p>{ad.location}</p>
                            </div>

                            <div>
                                <h3>Category de l'annonce :</h3>
                                <p>{ad.category?.name}</p>
                            </div>
                            {ad.tags && ad.tags.length > 0 && (
                                <div>
                                    <h3>Tag</h3>
                                    <p>{ad?.tags[0].name}</p>
                                </div>
                            )}
                            <UserBtnsContainer>
                                <Button
                                    bgColor="var(--destructive)"
                                    radius="6px"
                                    size="14px"
                                    weight="500"
                                    width="175px"
                                    padding="8px 20px"
                                    onClick={onDelete}
                                >
                                    Supprimer l'annonce
                                </Button>
                                <Button
                                    bgColor="var(--primary)"
                                    color="var(--primary-foreground)"
                                    radius="6px"
                                    size="14px"
                                    weight="500"
                                    width="175px"
                                    padding="8px 20px"
                                    onClick={onUpdate}
                                >
                                    Modifier l'annonce
                                </Button>
                            </UserBtnsContainer>
                        </MoreInformations>
                    </ContainerSelectedAd>
                </>
            )}
        </>
    );
}
