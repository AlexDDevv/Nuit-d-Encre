"use client";
import data from "../../data/data.json";
import { Link } from "react-router-dom";
import { Tag, ArrowRightLeft, Settings } from "lucide-react";

interface Redirection {
    title: string;
    text: string;
    link: string;
}

const iconsMappingHeader: Record<string, JSX.Element> = {
    "Mes annonces": <Tag className="text-card-foreground h-5 w-5" />,
    "Mes transactions": (
        <ArrowRightLeft className="text-card-foreground h-5 w-5" />
    ),
    Paramètres: <Settings className="text-card-foreground h-5 w-5" />,
};

const iconsMappingFooter: Record<string, JSX.Element> = {
    "Mes annonces": (
        <Tag className="text-card-foreground h-12 w-12 opacity-50 transition-all duration-200 ease-in-out group-hover:-rotate-45 group-hover:opacity-100" />
    ),
    "Mes transactions": (
        <ArrowRightLeft className="text-card-foreground h-12 w-12 opacity-50 transition-all duration-200 ease-in-out group-hover:-rotate-45 group-hover:opacity-100" />
    ),
    Paramètres: (
        <Settings className="text-card-foreground h-12 w-12 opacity-50 transition-all duration-200 ease-in-out group-hover:-rotate-45 group-hover:opacity-100" />
    ),
};

export default function ProfilCards() {
    return (
        <div className="flex justify-between gap-5">
            {data.redirectionsInProfil.map(
                ({ title, text, link }: Redirection) => (
                    <Link
                        key={title}
                        to={link}
                        className="bg-card border-border group hover:border-card-foreground flex h-52 w-96 flex-col justify-between rounded-xl border px-8 py-5 transition-colors duration-200 ease-in-out"
                    >
                        <div className="flex flex-col gap-2">
                            <div className="flex items-center gap-3">
                                {iconsMappingHeader[title]}
                                <h3 className="font-title text-card-foreground text-xl font-bold">
                                    {title}
                                </h3>
                            </div>
                            <p className="text-card-foreground max-w-60 opacity-50 transition-opacity duration-200 ease-in-out group-hover:opacity-100">
                                {text}
                            </p>
                        </div>
                        <div className="flex justify-end">
                            {iconsMappingFooter[title]}
                        </div>
                    </Link>
                ),
            )}
        </div>
    );
}
