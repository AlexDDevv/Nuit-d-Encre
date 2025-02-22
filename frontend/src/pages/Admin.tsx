import AppStats from "../components/AppStats";
import AdminPanel from "../components/AdminPanel";
import { IdCard, User, Tag } from "lucide-react";
import { useQuery } from "@apollo/client";
import { CategoryType, UserType } from "../../types";
import { queryUsers } from "../api/users";
import { queryCategories } from "../api/categories";

export default function Admin() {
    const { data: usersData } = useQuery<{ users: UserType[] }>(queryUsers, {
        fetchPolicy: "cache-and-network",
    });
    const users = usersData?.users ?? [];

    const { data: categoriesData } = useQuery<{ categories: CategoryType[] }>(
        queryCategories,
    );
    const categories = categoriesData?.categories ?? [];

    const stats = [
        {
            numberOf: "Nombre de visiteurs",
            number: 300,
            Icon: IdCard,
        },
        {
            numberOf: "Nombre d'utilisateurs",
            number: users.length,
            Icon: User,
        },
        {
            numberOf: "Nombre d'annonces",
            number: categories.length,
            Icon: Tag,
        },
    ];

    return (
        <section className="flex flex-col gap-20">
            <div className="flex items-center justify-between gap-5">
                {stats.map(({ number, numberOf, Icon }) => (
                    <AppStats
                        key={numberOf}
                        number={number}
                        numberOf={numberOf}
                        Icon={Icon}
                    />
                ))}
            </div>
            <AdminPanel />
        </section>
    );
}
