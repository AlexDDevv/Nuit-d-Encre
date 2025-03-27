import banner from "../../public/images/banner.webp";
import ShinyButton from "../components/UI/ShinyButton";

export default function LandingPage() {
    return (
        <>
            <section className="mx-auto max-w-7xl text-center">
                <div className="mb-24 flex flex-col items-center justify-center gap-5">
                    <h1 className="font-title text-accent-foreground flex flex-col gap-5 text-7xl font-bold">
                        Reprends goût{" "}
                        <span className="bg-custom">à la lecture</span>
                    </h1>
                    <p className="font-body text-accent-foreground mx-auto max-w-3xl text-lg">
                        Replongez dans l'univers captivant des livres et
                        redécouvrez le plaisir de la lecture. Améliorez votre
                        concentration, stimulez votre imagination, améliorez
                        votre sommeil et réduisez votre stress quotidien en vous
                        immergeant dans des histoires passionnantes!
                    </p>
                    <ShinyButton children="S'inscrire" />
                </div>
                <div className="w-full">
                    <img
                        src={banner}
                        alt="Une femme lisant un livre confortablement installée dans un fauteuil"
                        className="rounded-xl"
                    />
                </div>
            </section>
            <section className="mx-auto max-w-7xl text-center">
                <article className="mb-8">
                    <h2 className="font-quoteFont text-foreground mx-auto mb-2 max-w-2xl text-3xl leading-10">
                        <q>
                            La lecture est un voyage de l'esprit, une agréable
                            absence de la vie et de soi-même.
                        </q>
                    </h2>
                    <span className="font-body text-secondary-foreground text-lg italic">
                        Antoine Albalat
                    </span>
                </article>
                <p className="font-body text-accent-foreground mx-auto max-w-3xl">
                    Ne pas voir le temps passer quand nous sommes plongés dans
                    un livre, celui qui nous instruit, nous fait rêver ou nous
                    fait voyager. De belles émotions peuvent être transmises par
                    la lecture, celle la même qui nourrit notre imaginaire, et
                    celui des enfants.
                </p>
            </section>
        </>
    );
}
