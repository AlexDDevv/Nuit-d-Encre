import { Link } from "react-router-dom";
import { CategoryType } from "../../types";
import { useQuery } from "@apollo/client";
import { queryCategories } from "../api/categories";

export default function NavBar() {
    const { data } = useQuery<{ categories: CategoryType[] }>(queryCategories);
    const categories = data?.categories;

    return (
        <nav>
            <ul className="flex items-center justify-start gap-4">
                {categories?.map((category: CategoryType) => (
                    <li
                        key={category.name}
                        className="bg-muted hover:bg-muted-foreground flex items-center justify-center rounded-sm transition-colors duration-200 ease-in-out"
                    >
                        <Link
                            to={`/categories/${category.id}`}
                            className="text-muted-foreground hover:text-muted flex items-center justify-center px-3 py-2 font-semibold transition-colors duration-200 ease-in-out"
                        >
                            {category.name}
                        </Link>
                    </li>
                ))}
            </ul>
        </nav>
    );
}
