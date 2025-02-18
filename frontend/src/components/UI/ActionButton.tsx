import clsx from "clsx";
import { Link } from "react-router-dom";

interface ActionButtonProps {
    bgColor: string;
    color: string;
    width?: string;
    path?: string;
    content: string;
    onClick?: () => void;
}

export default function ActionButton({
    bgColor,
    color,
    width,
    path,
    content,
    onClick,
}: ActionButtonProps) {
    return (
        <button
            className={clsx(
                bgColor,
                color,
                width,
                "flex h-10 cursor-pointer items-center justify-center rounded-lg border-0 px-4 py-0 font-semibold transition-colors duration-200 ease-in-out",
            )}
            onClick={onClick}
        >
            {path ? <Link to={path}>{content}</Link> : content}
        </button>
    );
}
