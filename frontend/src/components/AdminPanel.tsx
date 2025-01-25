import styled from "styled-components";
import data from "../data/data.json";
import { AdTypeCard } from "../../types";
import { useQuery } from "@apollo/client";
import { queryAds } from "../api/ads";
import AdCard from "./AdCard";
import { Eye, SquarePen, Trash2 } from "lucide-react";
import { useState } from "react";

const AdminPanelContainer = styled.div`
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 50px;
    width: 100%;
`;

const PanelContainer = styled.div`
    display: flex;
    flex-direction: column;
    gap: 30px;
`;

const TabsContainer = styled.div`
    border: 1px solid var(--border);
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
    max-width: 480px;
`;

const Tab = styled.div`
    background-color: var(--card);
    width: 160px;
    padding: 15px 0 15px 25px;
    cursor: pointer;

    &:nth-child(2) {
        border-left: 1px solid var(--border);
        border-right: 1px solid var(--border);
    }
`;

const TabName = styled.h4`
    color: var(--card-foreground);
    font-size: 16px;
    font-weight: 700;
`;

const ContentToManage = styled.div`
    display: flex;
    flex-direction: column;
    gap: 20px;
`;

const Content = styled.div`
    background-color: var(--card);
    border: 1px solid var(--border);
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 20px;
    padding: 15px;
    width: 600px;
    transition: border-color 0.2s ease-in-out;

    &:hover {
        border-color: var(--card-foreground);
    }
`;

const Infos = styled.div``;

const Title = styled(TabName).attrs({ as: "h5" })`
    font-weight: 500;
    margin-bottom: 5px;
`;

const Owner = styled(TabName).attrs({ as: "h6" })`
    font-weight: 400;
`;

const ActionsIcons = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 15px;

    svg {
        color: var(--card-foreground);
        height: 20px;
        width: 20px;
        cursor: pointer;
        transition: color 0.2s ease-in-out, transform 0.2s ease-in-out;

        &:hover {
            color: var(--primary);
            transform: scale(1.1);
        }
    }
`;

export default function AdminPanel() {
    const [previewAdId, setPreviewAdId] = useState<number | null>(null);

    const handleShowPreview = (id: number) => {
        setPreviewAdId((prev) => (prev === id ? null : id));
    };

    const { data: dataAds } = useQuery<{ ads: AdTypeCard[] }>(queryAds, {
        fetchPolicy: "cache-and-network",
    });
    const ads = dataAds?.ads;

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
                <ContentToManage>
                    {ads?.map((ad) => (
                        <Content key={ad.id}>
                            <Infos>
                                <Title>{ad.title}</Title>
                                <Owner>{ad.owner}</Owner>
                            </Infos>
                            <ActionsIcons>
                                <Eye onClick={() => handleShowPreview(ad.id)} />
                                <SquarePen />
                                <Trash2 />
                            </ActionsIcons>
                        </Content>
                    ))}
                </ContentToManage>
            </PanelContainer>
            {previewAdId && ads && (
                <AdCard {...ads.find((ad) => ad.id === previewAdId)!} />
            )}
        </AdminPanelContainer>
    );
}
