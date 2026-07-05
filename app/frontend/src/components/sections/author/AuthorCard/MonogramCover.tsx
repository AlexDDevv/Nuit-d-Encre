type MonogramCoverProps = {
    first: string;
    last: string;
};

/**
 * « Couverture » d'une carte auteur : un médaillon-monogramme doré serti dans un
 * cadre en filet, sur un fond de parchemin grainé et vignetté — l'équivalent de
 * la couverture d'un livre. Les initiales sont dimensionnées en unités de
 * conteneur (cqmin) pour rester proportionnées quelle que soit la largeur de la
 * carte. Les dégradés et ombres, propres à ce visuel, restent en style inline.
 */
export default function MonogramCover({ first, last }: MonogramCoverProps) {
    const initials = `${first[0] ?? ""}${last[0] ?? ""}`.toUpperCase();

    return (
        <div
            className="absolute inset-0 overflow-hidden"
            style={{
                background:
                    "radial-gradient(128% 82% at 50% -6%, hsl(43 30% 23%) 0%, hsl(20 3% 15%) 46%, hsl(20 3% 10%) 100%)",
            }}
        >
            {/* grain de papier */}
            <div
                className="pointer-events-none absolute inset-0"
                style={{
                    opacity: 0.55,
                    backgroundImage:
                        "radial-gradient(hsl(43 59% 81% / 0.05) 1px, transparent 1px)",
                    backgroundSize: "13px 13px",
                }}
            />
            {/* vignette de chandelle */}
            <div
                className="pointer-events-none absolute inset-0"
                style={{
                    background:
                        "radial-gradient(72% 46% at 50% -2%, hsl(43 59% 81% / 0.12), transparent 68%)",
                }}
            />
            {/* cadre en filet doré */}
            <div
                className="pointer-events-none absolute inset-2.75 rounded-lg"
                style={{ border: "1px solid hsl(43 59% 81% / 0.16)" }}
            />

            {/* médaillon centré */}
            <div className="absolute inset-x-0 top-[14%] flex justify-center transition-transform duration-500 ease-out group-hover:scale-[1.045]">
                <div
                    className="font-quote relative grid aspect-square w-[58%] place-items-center rounded-full"
                    style={{
                        containerType: "size",
                        background:
                            "radial-gradient(circle at 34% 26%, hsl(43 42% 35%), hsl(20 3% 12%) 74%)",
                        boxShadow:
                            "inset 0 0 0 1.5px hsl(43 59% 81% / 0.38), inset 0 0 0 7px hsl(20 3% 12% / 0.65), inset 0 0 0 8px hsl(43 59% 81% / 0.15), 0 12px 32px -12px hsl(20 3% 3% / 0.9)",
                    }}
                >
                    <span
                        className="text-primary leading-none"
                        style={{ fontSize: "44cqmin", letterSpacing: "0.01em" }}
                    >
                        {initials}
                    </span>
                    {/* losanges ornementaux */}
                    <span
                        className="text-primary/50 absolute top-[12%]"
                        style={{ fontSize: "9cqmin" }}
                        aria-hidden="true"
                    >
                        ◆
                    </span>
                    <span
                        className="text-primary/50 absolute bottom-[12%]"
                        style={{ fontSize: "9cqmin" }}
                        aria-hidden="true"
                    >
                        ◆
                    </span>
                </div>
            </div>

            {/* libellé de marque */}
            <div className="font-quote text-primary/40 text-xxxs absolute inset-x-0 top-[6%] text-center uppercase tracking-[0.3em]">
                Nuit d'Encre
            </div>
        </div>
    );
}
