interface SidebarOverlayProps {
    visible: boolean;
    onClose: () => void;
}

export default function SidebarOverlay({
    visible,
    onClose,
}: SidebarOverlayProps) {
    if (!visible) return null;

    return (
        <div
            className="fixed inset-0 z-40 bg-black/50 transition-opacity duration-200"
            onClick={onClose}
            aria-hidden="true"
        />
    );
}
