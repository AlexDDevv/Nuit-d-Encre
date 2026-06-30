import { useState } from "react";
import { Pill, Ornament, MoonMedallion } from "../ProfileUI";

/**
 * Emblème du titre : SVG dédié servi depuis `public/titles/<iconKey>.svg`,
 * encadré dans le même médaillon doré que la marque. Retombe sur le
 * MoonMedallion générique si la clé est absente ou si le SVG manque.
 */
function TitleEmblem({ iconKey, size = 50 }: { iconKey?: string | null; size?: number }) {
    const [failed, setFailed] = useState(false);

    if (!iconKey || failed) return <MoonMedallion size={size} />;

    return (
        <span
            className="border-primary/55 relative grid shrink-0 place-items-center overflow-hidden rounded-full border-2 shadow-[0_0_18px_-3px_hsl(43_59%_70%/0.55)]"
            style={{ width: size, height: size }}
        >
            <img
                src={`/titles/${iconKey}.svg`}
                alt=""
                onError={() => setFailed(true)}
                className="h-full w-full object-cover"
            />
        </span>
    );
}

export default function TitlePlate({
    level,
    title,
    iconKey,
}: {
    level: number;
    title: string;
    iconKey?: string | null;
}) {
    return (
        <div className="flex flex-col items-center gap-3.5 text-center md:items-start md:text-left">
            <Pill tone="gold">Titre · Niveau {level}</Pill>
            <div className="flex items-center gap-3">
                <TitleEmblem iconKey={iconKey} />
                <span className="text-gradient-gold font-quote text-3xl leading-none font-semibold tracking-wide whitespace-nowrap">
                    {title}
                </span>
            </div>
            <Ornament width="w-12" />
        </div>
    );
}
