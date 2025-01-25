import { useState } from "react";
import AdCard from "../components/AdCard";
import { AdTypeCard } from "../../types";
import { useQuery } from "@apollo/client";
import { queryAds } from "../api/ads";
import styled from "styled-components";

const Container = styled.div`
    max-width: 1024px;
    margin: 0 auto;
`

const RecentAdds = styled.h1`
    color: var(--foreground);
    font-size: 1.75rem;
`;

const ShoppingCart = styled.h3`
    color: var(--foreground);
`;

const SectionAds = styled.section`
    margin-top: 50px;
`;

const AdsContainer = styled.div`
    display: flex;
    flex-wrap: wrap;
    gap: 30px;
    margin-top: 20px;
`;

export default function HomePage() {
    const [totalPrice, setTotalPrice] = useState(0);
    const { data: dataAds } = useQuery<{ ads: AdTypeCard[] }>(queryAds, {
        fetchPolicy: "cache-and-network",
    });
    const ads = dataAds?.ads;

    return (
        <Container>
            <RecentAdds>Annonces récentes</RecentAdds>
            <SectionAds>
                <ShoppingCart>Montant du panier : {totalPrice}</ShoppingCart>
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
        </Container>
    );
}
