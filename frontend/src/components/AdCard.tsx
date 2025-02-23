import { Link } from "react-router-dom";
import { AdTypeCard } from "../../types";
import ActionButton from "./UI/ActionButton";

export default function AdCard(props: AdTypeCard) {
    return (
        <div
            key={props.id}
            className="bg-card border-border hover:border-primary flex h-auto w-80 flex-col justify-between gap-5 rounded-lg border p-5 transition-colors duration-200 ease-in-out"
        >
            <Link
                to={`/ads/${props.id}`}
                className="text-card-foreground block"
            >
                <img
                    src={props.picture[0]}
                    alt="Image de l'annonce"
                    className="mb-2.5 h-40 w-full rounded-md"
                />
                <div className="flex flex-col gap-4">
                    <div className="flex items-center justify-between gap-5">
                        <h2 className="text-card-foreground font-title font-semibold">
                            {props.title}
                        </h2>
                        <p className="text-card-foreground">{props.price}€</p>
                    </div>
                    <div className="flex items-center justify-between gap-5">
                        <span className="bg-muted text-muted-foreground rounded-sm px-2 py-1 text-sm font-semibold">
                            {props.category?.name}
                        </span>
                        <div className="flex items-center justify-center gap-1.5">
                            {props.tags?.map((tag) => (
                                <span
                                    key={tag.name}
                                    className="bg-accent text-accent-foreground rounded-sm px-2 py-1 text-sm font-semibold"
                                >
                                    {tag.name}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>
            </Link>
            <ActionButton
                bgColor="bg-primary"
                color="text-primary-foreground"
                path={`/ads/${props.id}`}
                content="Voir l'annonce"
            />
        </div>
    );
}
