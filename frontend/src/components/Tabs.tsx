import { Tab, TabName, TabsContainer } from "./styled/PanelAdmin.styles";
import data from "../data/data.json";

interface TabsProps {
    handleChangeTab: (index: number) => void;
    isSelected: number
}

export default function Tabs({
    handleChangeTab,
    isSelected
}: TabsProps) {
    return (
        <TabsContainer>
            {data.tabs.map((tab, i) => (
                <Tab key={i} onClick={() => handleChangeTab(i)} background={isSelected === i ? "var(--border)" : "var(--card)"}>
                    <TabName>{tab.tab}</TabName>
                </Tab>
            ))}
        </TabsContainer>
    );
}
