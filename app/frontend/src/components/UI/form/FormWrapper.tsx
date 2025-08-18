type FormWrapperProps = {
    onSubmit: React.FormEventHandler<HTMLFormElement>;
    children: React.ReactNode;
    className?: string;
};

export default function FormWrapper({
    onSubmit,
    children,
    className,
}: FormWrapperProps) {
    return (
        <form
            onSubmit={onSubmit}
            role="form"
            className={`border-border bg-card flex w-full flex-col gap-6 rounded-lg border p-8 ${className}`}
        >
            {children}
        </form>
    );
}
