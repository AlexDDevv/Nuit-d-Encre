import { LuGithub, LuTwitter, LuLinkedin } from "react-icons/lu";
import { SocialLink } from "@/types/types";

/**
 * "Nuit d'Encre" social links - single source shared by the sidebar footer
 * and the Contact page. Update here to propagate everywhere.
 */
export const SOCIAL_LINKS: SocialLink[] = [
    {
        icon: LuGithub,
        url: "https://github.com/AlexDDevv",
        label: "GitHub",
        handle: "AlexDDevv",
    },
    {
        icon: LuTwitter,
        url: "https://x.com/Sport_DevWeb",
        label: "Twitter",
        handle: "@Sport_DevWeb",
    },
    {
        icon: LuLinkedin,
        url: "https://www.linkedin.com/in/alexis-delporte/",
        label: "LinkedIn",
        handle: "alexis-delporte",
    },
];
