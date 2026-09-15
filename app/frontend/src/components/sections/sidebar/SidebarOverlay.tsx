import { AnimatePresence, motion } from "motion/react";
import { SidebarOverlayProps } from "@/types/types";

export default function SidebarOverlay({
    visible,
    onClose,
}: SidebarOverlayProps) {
    return (
        <AnimatePresence>
            {visible && (
                <motion.div
                    key="sidebar-overlay"
                    className="fixed inset-0 z-40 bg-black/55 backdrop-blur-[2px]"
                    onClick={onClose}
                    aria-hidden="true"
                    initial={{ opacity: 0 }}
                    animate={{
                        opacity: 1,
                        transition: { duration: 0.35, ease: "easeOut" },
                    }}
                    exit={{
                        opacity: 0,
                        transition: { duration: 0.28, ease: "easeIn" },
                    }}
                />
            )}
        </AnimatePresence>
    );
}
