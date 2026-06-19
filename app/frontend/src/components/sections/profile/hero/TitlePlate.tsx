import { Pill, Ornament, MoonMedallion } from "../ProfileUI";

export default function TitlePlate({
    level,
    title,
}: {
    level: number;
    title: string;
}) {
    return (
        <div className="flex flex-col items-center gap-2 text-center md:items-start md:text-left">
            <Pill tone="gold">Titre · Niveau {level}</Pill>
            <div className="flex items-center gap-3">
                <MoonMedallion />
                <span className="text-gradient-gold font-quote text-[27px] leading-none font-semibold tracking-wide whitespace-nowrap md:text-[31px]">
                    {title}
                </span>
            </div>
            <Ornament width="w-12" />
        </div>
    );
}
