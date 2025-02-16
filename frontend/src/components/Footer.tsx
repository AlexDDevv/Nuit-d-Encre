import { Link } from "react-router-dom";
import logo from "../assets/logo.svg";
import data from "../data/data.json";
import { Copyright, Github, Twitter, Linkedin } from "lucide-react";
import ActionButton from "./UI/ActionButton";

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
    return (
        <footer className="bg-card border-border flex flex-col gap-10 rounded-xl border p-6">
            <div className="flex items-center justify-between gap-5">
                <Link to="/">
                    <img src={logo} alt="The good corner" />
                </Link>
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
                <ActionButton
                    bgColor="bg-primary"
                    color="text-primary-foreground"
                    path="ads/newAd"
                    content="Publier une annonce"
                />
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
