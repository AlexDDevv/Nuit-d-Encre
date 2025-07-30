import { Helmet } from "react-helmet";

export default function AuthorScribe() {
    return (
        <>
            {/* Update of the metadata */}
            <Helmet>
                <title>Enregistrer un auteur sur Nuit d'Encre</title>
                <meta
                    name="description"
                    content="Page pour enregistrer un auteur sur le site Nuit d'Encre."
                />
                <meta name="robots" content="noindex, nofollow" />
                {/* Open Graph */}
                <meta
                    property="og:title"
                    content="Enregistrer un auteur sur Nuit d'Encre"
                />
                <meta
                    property="og:description"
                    content="Page pour enregistrer un auteur sur le site Nuit d'Encre."
                />
                <meta property="og:type" content="website" />
                {/* Twitter Card */}
                <meta name="twitter:card" content="summary" />
                <meta
                    name="twitter:title"
                    content="Enregistrer un auteur sur Nuit d'Encre"
                />
                <meta
                    name="twitter:description"
                    content="Page pour enregistrer un auteur sur le site Nuit d'Encre."
                />
            </Helmet>
            <div>Formulaire d'enregistrement</div>;
        </>
    );
}
