type ErrorInputProps = {
    message: string;
};

export default function ErrorInput({ message }: ErrorInputProps) {
    return (
        <p className="text-destructive text-xs font-medium" role="alert">
            {message}
        </p>
    );
}
