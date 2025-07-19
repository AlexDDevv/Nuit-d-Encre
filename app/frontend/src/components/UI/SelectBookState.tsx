import React, { useState } from "react";
import {
    BookmarkPlus,
    ChevronsUpDown,
    BookOpenCheck,
    Pause,
    BookCheck,
    Trash2,
} from "lucide-react";
import { motion, Variants, MotionProps, AnimatePresence } from "motion/react";

export default function SelectBookState() {
    const [openBtn, setOpenBtn] = useState(false);
    const [selectedState, setSelectedState] = useState<string>("À lire");

    const showBookState = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        setOpenBtn(!openBtn);
    };

    const selectedStateBook = (state: string) => {
        setSelectedState(state);
        setOpenBtn(!openBtn);
    };

    const menuVariants: Variants = {
        closed: {
            scale: 0,
            transition: {
                delay: 0.15,
            },
        },
        open: {
            scale: 1,
            transition: {
                type: "spring",
                duration: 0.4,
                delayChildren: 0.2,
                staggerChildren: 0.05,
            },
        },
    };

    const itemVariants: MotionProps = {
        variants: {
            closed: { x: -16, opacity: 0 },
            open: { x: 0, opacity: 1 },
        },
        transition: { opacity: { duration: 0.2 } },
    };

    const bookState = [
        {
            icon: <BookmarkPlus className="h-5 w-5" />,
            content: "À lire",
        },
        {
            icon: <BookOpenCheck className="h-5 w-5" />,
            content: "En cours",
        },
        {
            icon: <Pause className="h-5 w-5" />,
            content: "En pause",
        },
        {
            icon: <BookCheck className="h-5 w-5" />,
            content: "Lu",
        },
        {
            icon: <Trash2 className="h-5 w-5" />,
            content: "Supprimer",
        },
    ];

    const getIconForSelectedState = (state: string) => {
        const foundState = bookState.find((item) => item.content === state);
        return foundState ? (
            foundState.icon
        ) : (
            <BookmarkPlus className="h-5 w-5" />
        );
    };

    return (
        <div className="relative flex w-52 flex-col">
            <button
                type="button"
                className="bg-primary hover:bg-primary/90 flex w-full cursor-pointer items-center justify-between rounded-md px-4 py-2 transition-colors"
                onClick={showBookState}
            >
                <div className="flex items-center gap-x-4">
                    {getIconForSelectedState(selectedState)}
                    <p className="font-bodyFont text-primary-foreground font-semibold">
                        {selectedState}
                    </p>
                </div>
                <ChevronsUpDown className="text-primary-foreground h-4 w-4" />
            </button>
            <AnimatePresence>
                {openBtn && (
                    <motion.div
                        className="bg-card absolute top-full mt-2 flex w-full flex-col gap-y-2 rounded-md p-4"
                        initial="closed"
                        animate={openBtn ? "open" : "closed"}
                        exit="closed"
                        variants={menuVariants}
                    >
                        {bookState.map((state) => (
                            <motion.div
                                className={`text-card hover:bg-card-foreground hover:text-card flex cursor-pointer items-center gap-x-4 rounded-md py-2 transition-all duration-200 ease-in-out hover:pl-4 ${
                                    selectedState === state.content
                                        ? "bg-card-foreground pl-4"
                                        : "text-card-foreground hover:bg-card-foreground"
                                }`}
                                onClick={() => selectedStateBook(state.content)}
                                {...itemVariants}
                            >
                                <div>{state.icon}</div>
                                <p className="font-bodyFont font-semibold">
                                    {state.content}
                                </p>
                            </motion.div>
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
