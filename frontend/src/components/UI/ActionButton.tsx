import clsx from "clsx";
import { Link } from "react-router-dom";

interface ActionButtonProps {
    type?: "button" | "submit";
    bgColor: string;
    color: string;
    width?: string;
    margin?: string;
    path?: string;
    content: string;
    onClick?: () => void;
}

export default function ActionButton({
    type = "button",
    bgColor,
    color,
    width,
    margin,
    path,
    content,
    onClick,
}: ActionButtonProps) {
    const buttonClass = clsx(
        bgColor,
        color,
        width,
        margin,
        "flex h-10 cursor-pointer items-center justify-center rounded-lg border-0 px-4 py-0 font-semibold transition-colors duration-200 ease-in-out",
    );

    return path ? (
        <Link to={path} className={buttonClass}>
            {content}
        </Link>
    ) : (
        <button type={type} className={buttonClass} onClick={onClick}>
            {content}
        </button>
    );
}
