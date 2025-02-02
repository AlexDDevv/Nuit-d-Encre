import { Link, useNavigate } from "react-router-dom";
import { AdTypeCard } from "../../types";
import styled from "styled-components";
import { Button } from "./StyledButton";

const AdCardContainer = styled.div`
    background-color: var(--card);
    border: 1px solid var(--border);
    border-radius: 8px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    gap: 20px;
    width: 300px;
    height: auto;
    padding: 20px;
    transition: border-color 0.2s ease-in-out;

    &:hover {
        border-color: var(--primary);
    }
`;

const AdCardLink = styled(Link)`
    color: var(--card-foreground);
    text-decoration: none;
    display: block;
`;

const AdCardImg = styled.img`
    width: 100%;
    height: 150px;
    border-radius: 6px;
    margin-bottom: 10px;
`;

const AdCardTextContainer = styled.div`
    display: flex;
    flex-direction: column;
    gap: 15px;
`;

const AdCardTitle = styled.h2`
    font-size: 16px;
`;

const AdCardText = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 20px;
`;

const Price = styled.p``;

const CategoryAndTags = styled(AdCardText)``;

const Category = styled.span`
    background-color: var(--muted);
    border-radius: 5px;
    color: var(--muted-foreground);
    font-size: 14px;
    font-weight: 600;
    line-height: 18px;
    padding: 3px 8px;
`;

const AdTagsContainer = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 5px;
`;

const AdTag = styled(Category)`
    background-color: var(--accent);
    color: var(--accent-foreground);
`;

export default function AdCard(props: AdTypeCard) {
    const navigate = useNavigate();

    return (
        <AdCardContainer key={props.id}>
            <AdCardLink to={`/ads/${props.id}`}>
                <AdCardImg src={props.picture[0]} />
                <AdCardTextContainer>
                    <AdCardText>
                        <AdCardTitle>{props.title}</AdCardTitle>
                        <Price>{props.price}€</Price>
                    </AdCardText>
                    <CategoryAndTags>
                        <Category>{props.category?.name}</Category>
                        <AdTagsContainer>
                            {props.tags?.map((tag) => (
                                <AdTag key={tag.name}>{tag.name}</AdTag>
                            ))}
                        </AdTagsContainer>
                    </CategoryAndTags>
                </AdCardTextContainer>
            </AdCardLink>
            <Button
                width="100%"
                transition="background-color 0.2s ease-in-out,
                color 0.2s ease-in-out"
                backgroundHover="rgba(255, 204, 102, 0.9)"
                onClick={() => navigate(`/ads/${props.id}`)}
            >
                Voir l'annonce
            </Button>
        </AdCardContainer>
    );
}
