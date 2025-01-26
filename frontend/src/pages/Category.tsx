import { useParams } from "react-router-dom";
import AdCard from "../components/AdCard";
import { CategoryType } from "../../types";
import { useQuery } from "@apollo/client";
import { queryCategory } from "../api/category";
import styled from "styled-components";

const SectionCategoryPage = styled.section`
    max-width: 1024px;
    margin: 0 auto;

    h1 {
        color: var(--foreground);
        font-size: 1.75rem;
    }
`;

const AdsContainer = styled.div`
    display: flex;
    flex-wrap: wrap;
    gap: 30px;
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
                            category={ad.category}
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
