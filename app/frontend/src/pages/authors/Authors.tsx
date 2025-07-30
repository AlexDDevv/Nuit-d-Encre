import { Helmet } from "react-helmet";

export default function Authors() {
    return (
        <>
            {/* Update of the metadata */}
            <Helmet>
                <title>Auteurs enregistrés sur Nuit d'Encre</title>
                <meta
                    name="description"
                    content="Page des auteurs enregistrés sur le site Nuit d'Encre."
                />
                <meta name="robots" content="noindex, nofollow" />
                {/* Open Graph */}
                <meta
                    property="og:title"
                    content="Auteurs enregistrés sur Nuit d'Encre"
                />
                <meta
                    property="og:description"
                    content="Page des auteurs enregistrés sur le site Nuit d'Encre."
                />
                <meta property="og:type" content="website" />
                {/* Twitter Card */}
                <meta name="twitter:card" content="summary" />
                <meta
                    name="twitter:title"
                    content="Auteurs enregistrés sur Nuit d'Encre"
                />
                <meta
                    name="twitter:description"
                    content="Page des auteurs enregistrés sur le site Nuit d'Encre."
                />
            </Helmet>
            <div>La page des auteurs</div>;
        </>
    );
}
