import clsx from "clsx";

interface ActionButtonProps {
  content: string;
  bgColor: string;
  color: string;
  bgColorHover: string;
  colorHover: string;
}

export default function ActionButton({
  content,
  bgColor,
  color,
  bgColorHover,
  colorHover,
}: ActionButtonProps) {
  return (
    <button
      className={clsx(
        bgColor,
        color,
        bgColorHover,
        colorHover,
        "font-bodyFont flex h-10 items-center justify-center rounded-lg border-0 px-4 py-0 font-semibold transition-colors duration-200 ease-in-out",
      )}
    >
      {content}
    </button>
  );
}
