import { useParams } from "react-router-dom";
import AdCard from "../components/AdCard";
import { CategoryType } from "../../types";
import { useQuery } from "@apollo/client";
import { queryCategory } from "../api/category";
import styled from "styled-components";

const SectionCategoryPage = styled.section`
    padding-top: 50px;

    h1 {
        color: var(--foreground);
    }
`;

const AdsContainer = styled.div`
    max-width: 350px;
    margin-top: 50px;

    p {
        color: var(--foreground);
    }
`;

export default function CategoryPage() {
    const param = useParams<{ id: string }>();
    const id = Number(param.id);

    const { data } = useQuery<{ category: CategoryType }>(queryCategory, {
        variables: {
            id,
        },
    });
    const category = data?.category;
    console.log(category);

    return (
        <SectionCategoryPage>
            <h1>Annonces de la catégorie {category?.name}</h1>
            <AdsContainer className="ads-container">
                {category?.ads?.length ? (
                    category?.ads?.map((ad) => (
                        <AdCard
                            key={ad.id}
                            id={ad.id}
                            title={ad.title}
                            picture={ad.picture}
                            price={ad.price}
                            onAddToPanier={() => {}}
                        />
                    ))
                ) : (
                    <p>Aucune annonce trouvée pour cette catégorie.</p>
                )}
            </AdsContainer>
        </SectionCategoryPage>
    );
}
