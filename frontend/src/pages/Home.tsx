import { useState } from "react";
import AdCard from "../components/AdCard";
import { AdTypeCard } from "../../types";
import { useQuery } from "@apollo/client";
import { queryAds } from "../api/ads";
import styled from "styled-components";

const SectionAds = styled.section`
    margin-top: 50px;
`;

const AdsContainer = styled.div`
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 20px;
    margin-top: 20px;
`;

export default function HomePage() {
    const [totalPrice, setTotalPrice] = useState(0);
    const { data: dataAds } = useQuery<{ ads: AdTypeCard[] }>(queryAds, {
        fetchPolicy: "cache-and-network",
    });
    const ads = dataAds?.ads;

    return (
        <>
            <h2>Annonces récentes</h2>
            <SectionAds>
                <h3>Montant du panier : {totalPrice}</h3>
                <AdsContainer>
                    {ads?.map((ad) => (
                        <AdCard
                            key={ad.id}
                            id={ad.id}
                            picture={ad.picture}
                            title={ad.title}
                            price={ad.price}
                            onAddToPanier={() =>
                                setTotalPrice(totalPrice + ad.price)
                            }
                            tags={ad.tags}
                        />
                    ))}
                </AdsContainer>
            </SectionAds>
        </>
    );
}
