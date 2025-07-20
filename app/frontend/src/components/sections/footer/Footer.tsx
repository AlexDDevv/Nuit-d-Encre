import { Link } from "react-router-dom";
import { Copyright, Github, Twitter, Linkedin } from "lucide-react";
import Logo from "@/components/UI/Logo";
import { LinksType } from "@/types/types";
import NavAndAuthButtons from "@/components/sections/auth/NavAndAuthButtons";

const FOOTER_LINKS: readonly LinksType[] = [
    {
        href: "/contact",
        label: "Contact",
        category: "Contact",
        ariaLabel: "Nous contacter",
    },
    {
        href: "/about",
        label: "À propos",
        category: "À propos",
        ariaLabel: "À propos de Nuit d'Encre",
    },
    {
        href: "/support",
        label: "Support",
        category: "Support",
        ariaLabel: "Contacter le support si vous avez besoin d'aide",
    },
    {
        href: "/terms-of-use",
        label: "Mentions légales",
        category: "Mentions légales",
        ariaLabel: "Prenez connaissance des mentions légales de Nuit d'Encre",
    },
] as const;

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
                <Logo />
                <NavAndAuthButtons links={FOOTER_LINKS} />
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
