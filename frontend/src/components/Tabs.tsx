import { Tab, TabName, TabsContainer } from "./styled/PanelAdmin.styles";
import data from "../data/data.json";

export default function Tabs({
    handleChangeTab,
}: {
    handleChangeTab: (index: number) => void;
}) {
    return (
        <TabsContainer>
            {data.tabs.map((tab, i) => (
                <Tab key={i} onClick={() => handleChangeTab(i)}>
                    <TabName>{tab.tab}</TabName>
                </Tab>
            ))}
        </TabsContainer>
    );
}
