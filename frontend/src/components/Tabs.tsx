import data from "../data/data.json";
import clsx from "clsx";

interface TabsProps {
    handleChangeTab: (index: number) => void;
    isSelected: number;
}

export default function Tabs({ handleChangeTab, isSelected }: TabsProps) {
    return (
        <div className="border-border flex max-w-md items-center justify-center overflow-hidden rounded-lg border">
            {data.tabs.map((tab, i) => (
                <div
                    key={i}
                    onClick={() => handleChangeTab(i)}
                    className={clsx(
                        isSelected === i ? "bg-border" : "bg-card",
                        "hover:bg-border border-border w-40 cursor-pointer border-r py-4 pl-6 transition-colors duration-200 ease-in-out nth-[2]:border-l",
                    )}
                >
                    <h4 className="text-card-foreground font-title text-lg font-medium">
                        {tab.tab}
                    </h4>
                </div>
            ))}
        </div>
    );
}
