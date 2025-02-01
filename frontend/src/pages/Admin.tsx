import styled from "styled-components";
import AppStats from "../components/AppStats";
import AdminPanel from "../components/AdminPanel";
import { IdCard, User, Tag } from "lucide-react";
import { useQuery } from "@apollo/client";
import { CategoryType, UserType } from "../../types";
import { queryUsers } from "../api/users";
import { queryCategories } from "../api/categories";

const SectionAdmin = styled.section`
    display: flex;
    flex-direction: column;
    gap: 75px;
`;

const StatsContainer = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 20px;
`;

export default function Admin() {
    const { data: usersData } = useQuery<{ users: UserType[] }>(queryUsers, {
        fetchPolicy: "cache-and-network",
    });
    const users = usersData?.users ?? [];

    const { data: categoriesData } = useQuery<{ categories: CategoryType[] }>(
        queryCategories
    );
    const categories = categoriesData?.categories ?? [];

    const stats = [
        { numberOf: "Nombre de visiteurs", number: 300, Icon: IdCard },
        { numberOf: "Nombre d'utilisateurs", number: users.length, Icon: User },
        { numberOf: "Nombre d'annonces", number: categories.length, Icon: Tag },
    ];

    return (
        <SectionAdmin>
            <StatsContainer>
                {stats.map(({ number, numberOf, Icon }) => (
                    <AppStats
                        key={numberOf}
                        number={number}
                        numberOf={numberOf}
                        Icon={Icon}
                    />
                ))}
            </StatsContainer>
            <AdminPanel />
        </SectionAdmin>
    );
}
