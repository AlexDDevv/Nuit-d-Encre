import { Link } from "react-router-dom";
import { CategoryType } from "../../types";
import { useQuery } from "@apollo/client";
import { queryCategories } from "../api/categories";
import styled from "styled-components";

const Navbar = styled.nav``;

const CategoryList = styled.ul`
    display: flex;
    align-items: center;
    justify-content: flex-start;
    gap: 16px;
`;

const CategoryLi = styled.li`
    background-color: var(--muted);
    border-radius: 4px;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: background-color 0.2s ease-in-out;

    &:hover {
        background-color: var(--muted-foreground);
    }
`;

const StyledLink = styled(Link)`
    color: var(--muted-foreground);
    font-size: 16px;
    font-weight: 600;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 8px 12px;
    text-decoration: none;
    transition: color 0.2s ease-in-out;

    &:hover {
        color: var(--muted);
    }
`;

export default function NavBar() {
    const { data } = useQuery<{ categories: CategoryType[] }>(queryCategories);
    const categories = data?.categories;

    return (
        <Navbar>
            <CategoryList>
                {categories?.map((category: CategoryType) => (
                    <CategoryLi key={category.name}>
                        <StyledLink to={`/categories/${category.id}`}>
                            {category.name}
                        </StyledLink>
                    </CategoryLi>
                ))}
            </CategoryList>
        </Navbar>
    );
}
