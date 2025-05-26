import { useQuery } from "@apollo/client";
import { whoami } from "../api/whoami";
import avatar from "/images/avatar.jfif";
import { Helmet } from "react-helmet";

export default function Profil() {
    const { data: whoamiData } = useQuery(whoami);
    const me = whoamiData?.whoami;
    console.log("🚀 ~ Profil ~ me:", me);

    return (
        <>
            <Helmet>
                <title>Mon Profil - Nuit d'Encre</title>
                <meta
                    name="description"
                    content="Gérez vos informations personnelles, préférences de lecture et paramètres de compte sur Nuit d'Encre."
                />
                <meta name="robots" content="noindex, nofollow" />

                {/* Open Graph */}
                <meta property="og:title" content="Mon Profil - Nuit d'Encre" />
                <meta
                    property="og:description"
                    content="Gérez vos informations personnelles, préférences de lecture et paramètres de compte sur Nuit d'Encre."
                />
                <meta property="og:type" content="profile" />

                {/* Twitter Card */}
                <meta name="twitter:card" content="summary" />
                <meta
                    name="twitter:title"
                    content="Mon Profil - Nuit d'Encre"
                />
                <meta
                    name="twitter:description"
                    content="Gérez vos informations personnelles, préférences de lecture et paramètres de compte sur Nuit d'Encre."
                />
            </Helmet>
            <div className="relative flex h-36 w-36 items-center justify-center overflow-hidden rounded-full">
                <div className="absolute inset-0 z-10 rounded-full border-4 border-white mix-blend-soft-light"></div>
                <div className="absolute inset-0 z-10 rounded-full border-4 border-white mix-blend-overlay"></div>
                <img
                    src={avatar}
                    alt="Photo de profil"
                    className="h-full w-full"
                />
            </div>
        </>
    );
}
