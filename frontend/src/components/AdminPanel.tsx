import { useState } from "react";
import {
    AdminPanelContainer,
    PanelContainer,
    TabsContainer,
    Tab,
    TabName,
} from "../components/styled/PanelAdmin.styles";
import data from "../data/data.json";
import ManageAds from "./ManageContent/ManageAds";
import AdCard from "./AdCard";
import { useQuery } from "@apollo/client";
import { AdTypeCard } from "../../types";
import { queryAds } from "../api/ads";

export default function AdminPanel() {
    const [previewAdId, setPreviewAdId] = useState<number | null>(null);

    const { data: dataAds } = useQuery<{ ads: AdTypeCard[] }>(queryAds, {
        fetchPolicy: "cache-and-network",
    });
    const ads = dataAds?.ads;

    const handlePreviewAdChange = (id: number | null) => {
        setPreviewAdId(id);
    };

    return (
        <AdminPanelContainer>
            <PanelContainer>
                <TabsContainer>
                    {data.tabs.map((tab, i) => (
                        <Tab key={i}>
                            <TabName>{tab.tab}</TabName>
                        </Tab>
                    ))}
                </TabsContainer>
                <ManageAds onPreviewAdChange={handlePreviewAdChange} />
            </PanelContainer>
            {previewAdId && ads && (
                <AdCard {...ads.find((ad) => ad.id === previewAdId)!} />
            )}
        </AdminPanelContainer>
    );
}
