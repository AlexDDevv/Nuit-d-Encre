import { useParams } from "react-router-dom";
import AdCard from "../components/AdCard";
import { CategoryType } from "../../types";
import { useQuery } from "@apollo/client";
import { queryCategory } from "../api/category";

export default function CategoryPage() {
    const param = useParams<{ id: string }>();
    const id = Number(param.id);

    const { data } = useQuery<{ category: CategoryType }>(queryCategory, {
        variables: { categoryId: id },
    });
    const category = data?.category;
    console.log(category);

    return (
        <section className="mx-auto max-w-5xl">
            <h1 className="text-foreground font-title text-2xl font-bold">
                Annonces de la catégorie {category?.name}
            </h1>
            <div className="mt-12 flex flex-wrap gap-7">
                {category?.ads?.length ? (
                    category?.ads?.map((ad) => (
                        <AdCard
                            key={ad.id}
                            id={ad.id}
                            title={ad.title}
                            category={ad.category}
                            picture={ad.picture}
                            price={ad.price}
                        />
                    ))
                ) : (
                    <p className="text-popover-foreground">
                        Aucune annonce trouvée pour cette catégorie.
                    </p>
                )}
            </div>
        </section>
    );
}
