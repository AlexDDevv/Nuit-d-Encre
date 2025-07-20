import { forwardRef } from "react";
import clsx from "clsx";
import { motion, MotionProps, type AnimationProps } from "motion/react";
import { useNavigate } from "react-router-dom";

const animationProps = {
    initial: { "--x": "100%", scale: 0.8 },
    animate: { "--x": "-100%", scale: 1 },
    whileTap: { scale: 0.95 },
    transition: {
        repeat: Infinity,
        repeatType: "loop",
        repeatDelay: 1,
        type: "spring",
        stiffness: 20,
        damping: 15,
        mass: 2,
        scale: {
            type: "spring",
            stiffness: 200,
            damping: 5,
            mass: 0.5,
        },
    },
} as AnimationProps;

interface ShinyButtonProps
    extends Omit<React.HTMLAttributes<HTMLElement>, keyof MotionProps>,
        MotionProps {
    children: React.ReactNode;
    className?: string;
}

const ShinyButton = forwardRef<HTMLButtonElement, ShinyButtonProps>(
    ({ children, className, ...props }, ref) => {
        const navigate = useNavigate();

        const redirectToSignUp = () => {
            navigate("/register");
        };

        return (
            <motion.button
                ref={ref}
                {...animationProps}
                {...props}
                className={clsx(
                    "relative rounded-lg px-6 py-2 font-medium backdrop-blur-xl transition-shadow duration-200 ease-in-out hover:shadow",
                    className,
                )}
                onClick={redirectToSignUp}
            >
                <span
                    className="text-foreground relative block size-full uppercase tracking-wide"
                    style={{
                        maskImage:
                            "linear-gradient(-75deg, var(--color-primary) calc(var(--x) + 20%), transparent calc(var(--x) + 30%), var(--color-primary) calc(var(--x) + 100%))",
                    }}
                >
                    {children}
                </span>
                <span
                    style={{
                        mask: "linear-gradient(rgb(0,0,0), rgb(0,0,0)) content-box, linear-gradient(rgb(0,0,0), rgb(0,0,0))",
                        maskComposite: "exclude",
                    }}
                    className="absolute inset-0 z-10 block rounded-[inherit] bg-[linear-gradient(-75deg,var(--color-primary)/10%_calc(var(--x)+20%),var(--color-primary)/50%_calc(var(--x)+25%),var(--color-primary)/10%_calc(var(--x)+100%))] p-px"
                ></span>
            </motion.button>
        );
    },
);

ShinyButton.displayName = "ShinyButton";

export default ShinyButton;
