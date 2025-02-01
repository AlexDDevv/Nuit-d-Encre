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
import ManageTags from "./ManageContent/ManageTags";
import CategoryForm from "./ManageContent/CategoryForm";
import TagForm from "./ManageContent/TagForm";

export default function AdminPanel() {
    const [selectedTab, setSelectedTab] = useState<number>(0);
    const [previewAdId, setPreviewAdId] = useState<number | null>(null);
    const [previewAdsId, setPreviewAdsId] = useState<number[] | null>(null);
    const [showCategoryForm, setShowCategoryForm] = useState(false);
    const [showTagForm, setShowTagForm] = useState(false);
    const [editingCategoryId, setEditingCategoryId] = useState<
        number | undefined
    >();
    const [editingTagId, setEditingTagId] = useState<number | undefined>();

    const { data: dataAds } = useQuery<{ ads: AdTypeCard[] }>(queryAds, {
        fetchPolicy: "cache-and-network",
    });
    const ads = dataAds?.ads;

    const handleChangeTab = (index: number) => {
        setSelectedTab(index);
        setShowCategoryForm(false);
        setShowTagForm(false);
    };

    const handlePreviewAdChange = (id: number | null) => {
        setPreviewAdId(id);
    };

    const handlePreviewAdsChange = (ids: number[] | null) => {
        setPreviewAdsId(ids);
        setShowCategoryForm(false);
        setShowTagForm(false);
    };

    const handleTagForm = (id?: number) => {
        if (id !== editingTagId) {
            setEditingTagId(id);
        }
        setShowTagForm(true);
    };

    const handleCategoryForm = (id?: number) => {
        if (id !== editingCategoryId) {
            setEditingCategoryId(id);
        }
        setPreviewAdsId(null);
        setShowCategoryForm(true);
    };

    const onCloseForm = () => {
        setShowCategoryForm(false);
        setShowTagForm(false);
        setEditingCategoryId(undefined);
        setEditingTagId(undefined);
    };

    return (
        <AdminPanelContainer>
            <PanelContainer>
                <Tabs handleChangeTab={handleChangeTab} isSelected={selectedTab} />
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
                                showCategoryForm={(id) =>
                                    handleCategoryForm(id)
                                }
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
                            {showCategoryForm && (
                                <CategoryForm
                                    onCategoryCreated={onCloseForm}
                                    onCategoryUpdated={onCloseForm}
                                    editingCategoryId={editingCategoryId}
                                />
                            )}
                        </>
                    )}
                    {selectedTab === 2 && (
                        <>
                            <ManageTags
                                showTagForm={(id) => handleTagForm(id)}
                            />
                            {showTagForm && (
                                <TagForm
                                    onTagCreated={onCloseForm}
                                    onTagUpdated={onCloseForm}
                                    editingTagId={editingTagId}
                                />
                            )}
                        </>
                    )}
                </ManageContainer>
            </PanelContainer>
        </AdminPanelContainer>
    );
}
