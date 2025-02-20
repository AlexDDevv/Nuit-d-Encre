import clsx from "clsx";
import React from "react";

interface CarrouselArrowProps {
    onClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
    direction: "left" | "right";
    label: string;
    children: React.ReactNode;
}

export default function CarrouselArrow({
    onClick,
    direction,
    label,
    children,
}: CarrouselArrowProps) {
    return (
        <button
            onClick={onClick}
            aria-label={label}
            className={clsx(
                "absolute top-1/2 z-[200] h-12 w-12 -translate-y-1/2 cursor-pointer transition-all duration-200 ease-in-out",
                direction === "left" ? "left-20" : "right-20",
            )}
            type="button"
        >
            <span className="text-accent-foreground hover:text-primary flex h-full w-full items-center justify-center hover:scale-105">
                {children}
            </span>
        </button>
    );
}
