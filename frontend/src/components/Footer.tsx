import { Link } from "react-router-dom";
import data from "../data/data.json";
import { Copyright, Github, Twitter, Linkedin } from "lucide-react";
import ActionButton from "./UI/ActionButton";
import { useQuery } from "@apollo/client";
import { whoami } from "../api/whoami";
import Logo from "./UI/Logo";

const socialLinks = [
    { Icon: Github, url: "https://github.com/AlexDDevv", alt: "GitHub" },
    { Icon: Twitter, url: "https://x.com/Sport_DevWeb", alt: "Twitter" },
    {
        Icon: Linkedin,
        url: "https://www.linkedin.com/in/alexis-delporte/",
        alt: "LinkedIn",
    },
];

export default function Footer() {
    const { data: whoamiData } = useQuery(whoami);
    const me = whoamiData?.whoami;

    return (
        <footer className="bg-card border-border flex flex-col gap-10 rounded-xl border p-6">
            <div className="flex items-center justify-between gap-5">
                <Logo />
                <nav>
                    <ul className="flex items-center justify-center gap-10">
                        {data.footerLi.map((li) => (
                            <li key={li.content}>
                                <Link
                                    to={li.link}
                                    className="text-card-foreground footerLinkAfter relative font-semibold"
                                >
                                    {li.content}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </nav>
                {me ? (
                    me.role === "admin" ? (
                        <ActionButton
                            bgColor="bg-secondary"
                            color="text-secondary-foreground"
                            path="/admin"
                            content="Admin"
                        />
                    ) : (
                        <ActionButton
                            bgColor="bg-secondary"
                            color="text-secondary-foreground"
                            path="/profil"
                            content="Profil"
                        />
                    )
                ) : me === null ? (
                    <ActionButton
                        bgColor="bg-secondary"
                        color="text-secondary-foreground"
                        path="/signin"
                        content="Se connecter"
                    />
                ) : null}
            </div>
            <div className="flex items-center justify-between gap-12">
                <div className="flex items-center justify-center gap-3">
                    <Copyright className="text-card-foreground h-4 w-4" />
                    <p className="text-card-foreground">
                        2025 - Alexis Delporte
                    </p>
                </div>
                <div className="flex items-center justify-center gap-5">
                    {socialLinks.map(({ Icon, url, alt }) => (
                        <Link
                            key={`Lien vers mon profil ${alt}`}
                            to={url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="border-card-foreground flex cursor-pointer items-center justify-center rounded-sm border p-2 opacity-50 transition-opacity duration-200 ease-in-out hover:opacity-100"
                            aria-label={alt}
                        >
                            <Icon className="text-card-foreground h-4 w-4" />
                        </Link>
                    ))}
                </div>
            </div>
        </footer>
    );
}
