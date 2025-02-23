export default function AppStats({
    number,
    numberOf,
    Icon,
}: {
    number: number;
    numberOf: string;
    Icon: React.ElementType;
}) {
    return (
        <div
            key={number}
            className="bg-card border-border group hover:border-card-foreground flex min-w-md items-center justify-between gap-5 rounded-lg border p-5 transition-colors duration-200 ease-in-out"
        >
            <div className="flex flex-col gap-2">
                <h2 className="text-card-foreground font-title text-lg font-medium">
                    {numberOf}
                </h2>
                <h3 className="text-card-foreground font-title text-xl font-bold">
                    {number}
                </h3>
            </div>
            <div className="h-10 w-10">
                <Icon className="text-border group-hover:text-card-foreground h-full w-full transition-all duration-200 ease-in-out group-hover:-rotate-45" />
            </div>
        </div>
    );
}
