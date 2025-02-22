import { useState } from "react";
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
        <div className="w-full">
            <div className="flex flex-col gap-7">
                <Tabs
                    handleChangeTab={handleChangeTab}
                    isSelected={selectedTab}
                />
                <div className="flex items-start justify-between gap-12">
                    {selectedTab === 0 && (
                        <>
                            <ManageAds
                                onPreviewAdChange={handlePreviewAdChange}
                            />
                            {previewAdId && ads && (
                                <AdCard
                                    {...ads.find(
                                        (ad) => ad.id === previewAdId,
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
                                    previewAdsId.includes(ad.id),
                                ).length > 0 ? (
                                    <div className="flex items-start justify-center gap-5">
                                        {previewAdsId.map((id) => {
                                            const ad = ads.find(
                                                (ad) => ad.id === id,
                                            );
                                            return ad ? (
                                                <AdCard {...ad} key={id} />
                                            ) : null;
                                        })}
                                    </div>
                                ) : (
                                    <p className="text-foreground font-medium">
                                        Il n'y a pas encore d'annonce pour cette
                                        catégorie.
                                    </p>
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
                </div>
            </div>
        </div>
    );
}
