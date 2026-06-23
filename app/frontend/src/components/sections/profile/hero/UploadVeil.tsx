// - Voile « envoi en cours » doré -
export default function UploadVeil({
    rounded = "rounded-full",
}: {
    rounded?: string;
}) {
    return (
        <div
            className={`bg-background/72 text-primary absolute inset-0 z-20 grid place-items-center ${rounded}`}
            aria-live="polite"
        >
            <span className="flex flex-col items-center gap-1.5">
                <svg
                    width={26}
                    height={26}
                    viewBox="0 0 24 24"
                    className="spin-gold"
                    aria-hidden="true"
                >
                    <circle
                        cx="12"
                        cy="12"
                        r="9"
                        fill="none"
                        stroke="currentColor"
                        strokeOpacity="0.25"
                        strokeWidth="3"
                    />
                    <path
                        d="M12 3a9 9 0 0 1 9 9"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="3"
                        strokeLinecap="round"
                    />
                </svg>
                <span className="font-body text-xs font-bold tracking-[0.2em] uppercase">
                    Envoi…
                </span>
            </span>
        </div>
    );
}
