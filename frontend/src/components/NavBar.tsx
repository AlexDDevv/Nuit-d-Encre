import React from "react";
import { Link } from "react-router-dom";
import { CategoryType } from "../../types";
import { useQuery } from "@apollo/client";
import { queryCategories } from "../api/categories";
import { Dot } from "lucide-react";
import styled from "styled-components";

const Navbar = styled.nav`
    color: var(--card-foreground);
    font-size: 12px;
    font-weight: bold;
    display: flex;
    justify-content: space-between;
    gap: 15px;
    padding: 16px 0;
    white-space: nowrap;
    overflow-x: scroll;
`;

const StyledLink = styled(Link)`
    color: var(--card-foreground);
    font-size: 12px;
    font-weight: 600;
    text-decoration: none;
`;

const DotLink = styled.span`
    display: flex;
    align-items: center;
    justify-content: center;

    &:last-child {
        svg {
            display: none;
        }
    }

    svg {
        height: 16px;
        width: 16px;
    }
`;

export default function NavBar() {
    const { loading, error, data } = useQuery<{ categories: CategoryType[] }>(
        queryCategories
    );
    const categories = data?.categories;

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error : {error.message}</p>;

    return (
        <Navbar>
            {categories?.map((category: CategoryType) => (
                <React.Fragment key={category.name}>
                    <StyledLink to={`/categories/${category.id}`}>
                        {category.name}
                    </StyledLink>
                    <DotLink>
                        <Dot />
                    </DotLink>
                </React.Fragment>
            ))}
        </Navbar>
    );
}
