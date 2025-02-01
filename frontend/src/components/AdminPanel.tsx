import { useState } from "react";
import {
    AdminPanelContainer,
    PanelContainer,
    ManageContainer,
    AdsContainer,
    NoAd,
} from "../components/styled/PanelAdmin.styles";
import ManageAds from "./ManageContent/ManageAds";
import AdCard from "./AdCard";
import { useQuery } from "@apollo/client";
import { AdTypeCard } from "../../types";
import { queryAds } from "../api/ads";
import Tabs from "./Tabs";
import ManageCategories from "./ManageContent/ManageCategories";
import CategoryForm from "./ManageContent/CategoryForm";

export default function AdminPanel() {
    const [selectedTab, setSelectedTab] = useState(0);
    const [previewAdId, setPreviewAdId] = useState<number | null>(null);
    const [previewAdsId, setPreviewAdsId] = useState<number[] | null>(null);
    const [showCategoryForm, setShowCategoryForm] = useState(false);
    const [editingCategoryId, setEditingCategoryId] = useState<
        number | undefined
    >();

    const { data: dataAds } = useQuery<{ ads: AdTypeCard[] }>(queryAds, {
        fetchPolicy: "cache-and-network",
    });
    const ads = dataAds?.ads;

    const handlePreviewAdChange = (id: number | null) => {
        setPreviewAdId(id);
    };

    const handlePreviewAdsChange = (ids: number[] | null) => {
        setPreviewAdsId(ids);
        setShowCategoryForm(false);
    };

    const handleCategoryForm = (categoryId?: number) => {
        setShowCategoryForm(!showCategoryForm);
        setEditingCategoryId(categoryId);
        setPreviewAdsId(null);
    };

    const handleChangeTab = (index: number) => {
        setSelectedTab(index);
    };

    return (
        <AdminPanelContainer>
            <PanelContainer>
                <Tabs handleChangeTab={handleChangeTab} />
                <ManageContainer>
                    {selectedTab === 0 && (
                        <>
                            <ManageAds
                                onPreviewAdChange={handlePreviewAdChange}
                            />
                            {previewAdId && ads && (
                                <AdCard
                                    {...ads.find(
                                        (ad) => ad.id === previewAdId
                                    )!}
                                />
                            )}
                        </>
                    )}
                    {selectedTab === 1 && (
                        <>
                            <ManageCategories
                                onPreviewAdChange={handlePreviewAdsChange}
                                showCategoryForm={handleCategoryForm}
                            />
                            {previewAdsId &&
                                ads &&
                                (ads.filter((ad) =>
                                    previewAdsId.includes(ad.id)
                                ).length > 0 ? (
                                    <AdsContainer>
                                        {previewAdsId.map((id) => {
                                            const ad = ads.find(
                                                (ad) => ad.id === id
                                            );
                                            return ad ? (
                                                <AdCard {...ad} key={id} />
                                            ) : null;
                                        })}
                                    </AdsContainer>
                                ) : (
                                    <NoAd>
                                        Il n'y a pas encore d'annonce pour cette
                                        catégorie.
                                    </NoAd>
                                ))}
                        </>
                    )}
                    {showCategoryForm && (
                        <CategoryForm
                            onCategoryCreated={async () => {
                                setShowCategoryForm(false);
                            }}
                            onCategoryUpdated={async () => {
                                setShowCategoryForm(false);
                            }}
                            editingId={editingCategoryId}
                        />
                    )}
                </ManageContainer>
            </PanelContainer>
        </AdminPanelContainer>
    );
}
