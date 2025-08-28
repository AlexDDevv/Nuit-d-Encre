import { Helmet } from "react-helmet";
import data from "@/data/legal.json";

export default function page() {
    return (
        <>
            <Helmet>
                <title>Mentions Légales | Nuit d'Encre</title>
                <meta
                    name="description"
                    content="Mentions légales et informations juridiques concernant Nuit d'Encre, application de bibliothèque en ligne."
                />
                <meta name="robots" content="index, follow" />
                <link rel="canonical" href="/legal" />
            </Helmet>
            <section className="max-w-7xl">
                <h1 className="font-titleFont text-foreground border-border mb-7 max-w-2xl border-b pb-2 text-3xl font-semibold">
                    Mentions légales
                </h1>
                <div className="pl-5">
                    {data.mentionsLegales.map((mention, i) => (
                        <article key={i}>
                            <h2 className="font-titleFont text-foreground mb-5 text-2xl font-medium">
                                {mention.title}
                            </h2>
                            <div className="mb-8">
                                {mention.paragraph.map((text, i) => (
                                    <p
                                        className={`font-bodyFont text-accent-foreground mb-5 max-w-2xl pl-5 last:mb-0 ${mention.title === "Identité de l'éditeur du site" || mention.title === "Hébergeur du site" ? "mb-0" : ""}`}
                                        key={i}
                                    >
                                        {text}
                                    </p>
                                ))}
                                <div className="flex flex-col gap-2 pl-10">
                                    {mention.span?.map((text, i) => (
                                        <span key={i} className="font-bodyFont text-accent-foreground">
                                            <strong>{text.strong}</strong>
                                            {text.content}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </article>
                    ))}
                </div>
            </section>
        </>
    );
}
