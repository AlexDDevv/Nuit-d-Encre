export default function ReviewSection({ title }: { title: string }) {
    return (
        <section className="bg-muted px-16 py-12">
            <div className="mb-24">
                <div className="bg-card mb-12 flex items-center gap-x-7 rounded-md py-5 pl-7">
                    <h5 className="font-titleFont text-card-foreground font-semibold tracking-wider uppercase">
                        Critiques, analyses et avis
                    </h5>
                    <span className="font-bodyFont text-card-foreground cursor-pointer font-medium italic">
                        Voir plus
                    </span>
                </div>
                <div>
                    <p className="font-bodyFont text-muted-foreground">
                        Rien n'a encore été écrit sur ce livre.
                    </p>
                </div>
            </div>
            <div className="mb-24">
                <div className="bg-card mb-12 flex items-center gap-x-7 rounded-md py-5 pl-7">
                    <h5 className="font-titleFont text-card-foreground font-semibold tracking-wider uppercase">
                        Du même auteur
                    </h5>
                    <span className="font-bodyFont text-card-foreground cursor-pointer font-medium italic">
                        Voir plus
                    </span>
                </div>
            </div>
            <div className="mb-24">
                <div className="bg-card mb-12 flex items-center gap-x-7 rounded-md py-5 pl-7">
                    <h5 className="font-titleFont text-card-foreground font-semibold tracking-wider uppercase">
                        Que lire après {title}
                    </h5>
                    <span className="font-bodyFont text-card-foreground cursor-pointer font-medium italic">
                        Voir plus
                    </span>
                </div>
            </div>
        </section>
    );
}
