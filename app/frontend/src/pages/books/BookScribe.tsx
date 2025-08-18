import BookForm from "@/components/sections/book/BookForm";
import { Helmet } from "react-helmet";

export default function BookScribe() {
    return (
        <>
            {/* Update of the metadata */}
            <Helmet>
                <title>Enregistrer un livre sur Nuit d'Encre</title>
                <meta
                    name="description"
                    content="Page pour enregistrer un livre sur le site Nuit d'Encre."
                />
                <meta name="robots" content="noindex, nofollow" />
                {/* Open Graph */}
                <meta
                    property="og:title"
                    content="Enregistrer un livre sur Nuit d'Encre"
                />
                <meta
                    property="og:description"
                    content="Page pour enregistrer un livre sur le site Nuit d'Encre."
                />
                <meta property="og:type" content="website" />
                {/* Twitter Card */}
                <meta name="twitter:card" content="summary" />
                <meta
                    name="twitter:title"
                    content="Enregistrer un livre sur Nuit d'Encre"
                />
                <meta
                    name="twitter:description"
                    content="Page pour enregistrer un livre sur le site Nuit d'Encre."
                />
            </Helmet>
            <div className="w-3xl mx-auto flex flex-col items-center">
                <BookForm />
            </div>
        </>
    );
}
