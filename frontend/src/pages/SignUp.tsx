import { Link } from "react-router-dom";
import SignUpForm from "../components/form/SignUpForm";
import { Helmet } from "react-helmet";

export default function SignUp() {
    return (
        <>
            <Helmet>
                <title>Inscription - Nuit d'Encre</title>
                <meta
                    name="description"
                    content="Créez votre compte Nuit d'Encre et retrouvez vos lectures préférées dans un espace dédié."
                />
                <meta name="robots" content="noindex, nofollow" />

                {/* Open Graph */}
                <meta
                    property="og:title"
                    content="Inscription - Nuit d'Encre"
                />
                <meta
                    property="og:description"
                    content="Créez votre compte Nuit d'Encre et retrouvez vos lectures préférées dans un espace dédié."
                />
                <meta property="og:type" content="website" />

                {/* Twitter Card */}
                <meta name="twitter:card" content="summary" />
                <meta
                    name="twitter:title"
                    content="Inscription - Nuit d'Encre"
                />
                <meta
                    name="twitter:description"
                    content="Créez votre compte Nuit d'Encre et retrouvez vos lectures préférées dans un espace dédié."
                />
            </Helmet>
            <section className="mx-auto flex w-full max-w-lg flex-col gap-7">
                <div className="bg-card border-border w-full rounded-xl border px-6 py-5">
                    <h1 className="text-card-foreground font-title mb-7 text-center text-2xl font-bold">
                        Créer un compte
                    </h1>
                    <SignUpForm />
                </div>
                <p className="text-muted-foreground text-center">
                    Vous avez déjà un compte?{" "}
                    <Link
                        to={"/signin"}
                        className="text-primary cursor-pointer font-semibold transition-opacity duration-200 ease-in-out hover:opacity-90"
                    >
                        Connectez vous!
                    </Link>
                </p>
            </section>
        </>
    );
}
