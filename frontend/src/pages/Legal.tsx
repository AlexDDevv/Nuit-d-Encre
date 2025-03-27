import data from "../data/data.json";

export default function page() {
    return (
        <section className="max-w-7xl">
            <h1 className="font-titleFont text-foreground border-border mb-7 max-w-2xl border-b pb-2 text-3xl font-semibold">
                Mentions légales
            </h1>
            <div className="pl-5">
                {data.mentionsLegales.map((mention, i) => (
                    <div key={i}>
                        <h2 className="font-titleFont text-foreground mb-5 text-2xl font-medium">
                            {mention.title}
                        </h2>
                        <div className="mb-8">
                            {mention.paragraph.map((text, index) => (
                                <p
                                    className={`font-bodyFont text-accent-foreground mb-5 max-w-2xl pl-5 last:mb-0 ${mention.title === "Identité de l'éditeur du site" || mention.title === "Hébergeur du site" ? "mb-0" : ""}`}
                                    key={index}
                                >
                                    {mention.span[index] && (
                                        <span className="font-bold">
                                            {mention.span[index]}
                                        </span>
                                    )}
                                    {text}
                                    {index === 0 && mention.link && (
                                        <a href="#" className="font-bold">
                                            {mention.link}
                                        </a>
                                    )}
                                </p>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}
