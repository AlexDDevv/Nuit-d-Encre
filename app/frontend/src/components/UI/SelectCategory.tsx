import { useState } from "react";
import { Check, ListFilter } from "lucide-react";
import { motion, Variants, MotionProps, AnimatePresence } from "motion/react";

export default function SelectCategory() {
    const [showCategory, setShowCategory] = useState(false);
    const [selectedCategory, setSelectedCategory] =
        useState<string>("Toutes catégories");

    const handleCategories = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        setShowCategory(!showCategory);
    };

    const selectCategory = (category: string) => {
        setSelectedCategory(category);
        setShowCategory(!showCategory);
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

    const categories = ["Toutes catégories", "Romans", "Mangas", "BD"];

    return (
        <div className="mx-auto flex w-[300px] flex-col gap-[10px]">
            <button
                className="bg-input border-border focus-visible:ring-ring flex w-full items-center justify-between rounded-lg px-4 py-2.5 focus-visible:ring-1 focus-visible:outline-none cursor-pointer"
                onClick={handleCategories}
            >
                <p className="font-bodyFont text-accent-foreground text-sm">
                    {selectedCategory}
                </p>
                <ListFilter className="text-accent-foreground h-4 w-4" />
            </button>
            <AnimatePresence>
                {showCategory && (
                    <motion.div
                        className="bg-input w-full rounded-lg p-2.5"
                        initial="closed"
                        animate={showCategory ? "open" : "closed"}
                        exit="closed"
                        variants={menuVariants}
                    >
                        {categories.map((category, i) => (
                            <motion.div
                                key={i}
                                className={`mb-2.5 flex cursor-pointer items-center justify-between rounded px-2.5 py-2 transition-colors last:mb-0 ${selectedCategory === category ? "bg-accent" : "hover:bg-accent"}`}
                                onClick={() => selectCategory(category)}
                                {...itemVariants}
                            >
                                <p className="font-bodyFont text-accent-foreground text-sm">
                                    {category}
                                </p>
                                {selectedCategory === category && (
                                    <Check className="text-accent-foreground h-2.5 w-2.5" />
                                )}
                            </motion.div>
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
