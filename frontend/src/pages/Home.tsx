import AdCard from "../components/AdCard";
import { AdTypeCard } from "../../types";
import { useQuery } from "@apollo/client";
import { queryAds } from "../api/ads";

export default function HomePage() {
    const { data: dataAds } = useQuery<{ ads: AdTypeCard[] }>(queryAds, {
        fetchPolicy: "cache-and-network",
    });
    const ads = dataAds?.ads;

    return (
        <div className="mx-auto max-w-5xl">
            <h1 className="text-foreground font-title text-2xl font-bold">
                Annonces récentes
            </h1>
            <section className="mt-12">
                <div className="mt-5 flex flex-wrap gap-8">
                    {ads?.map((ad) => (
                        <AdCard
                            key={ad.id}
                            id={ad.id}
                            picture={ad.picture}
                            title={ad.title}
                            price={ad.price}
                            category={ad.category}
                            tags={ad.tags}
                        />
                    ))}
                </div>
            </section>
        </div>
    );
}
