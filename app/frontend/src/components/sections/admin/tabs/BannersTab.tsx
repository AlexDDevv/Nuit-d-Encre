import { useState } from "react";
import { useToast } from "@/hooks/toast/useToast";
import { useSiteBanners } from "@/hooks/admin/useSiteBanners";
import { toBannerVariant, toSiteBannerVariant } from "@/lib/banner";
import type { SiteBanner } from "@/types/types";
import {
    blankDraft,
    type BannerDraft,
    type SavedBanner,
} from "@/components/sections/admin/ui/bannerEditor";
import BannerTabHeader from "../banners/BannerTabHeader";
import BannerEditorPanel from "../banners/BannerEditorPanel";
import BannerPreviewPanel from "../banners/BannerPreviewPanel";

/** Formate une date ISO en libellé court français (« 14 juin 2026 »). */
const formatDate = (iso: string) =>
    new Date(iso).toLocaleDateString("fr-FR", {
        day: "numeric",
        month: "long",
        year: "numeric",
    });

/** Projette une bannière GraphQL vers la forme attendue par la liste d'historique. */
const toRow = (b: SiteBanner): SavedBanner => ({
    id: b.id,
    variant: toBannerVariant(b.variant),
    title: b.title,
    content: b.message ?? "",
    audience: b.audience,
    dismissible: b.dismissible,
    action:
        b.actionLabel && b.actionUrl
            ? { label: b.actionLabel, target: b.actionUrl }
            : null,
    date: formatDate(b.createdAt),
});

/** Onglet « Bannières » : éditeur, aperçu en direct épinglé, historique. */
export function BannersTab() {
    const { showToast } = useToast();
    const { banners, createBanner, updateBanner, deleteBanner, isMutating } =
        useSiteBanners();
    const [draft, setDraft] = useState<BannerDraft>(blankDraft);
    const [previewKey, setPreviewKey] = useState(0);
    const [previewDismissed, setPreviewDismissed] = useState(false);

    const set = (patch: Partial<BannerDraft>) =>
        setDraft((d) => ({ ...d, ...patch }));

    // La bannière active est celle dont `isActive` est vrai (au plus une).
    const activeBanner = banners.find((b) => b.isActive) ?? null;
    const activeId = activeBanner?.id ?? null;
    const saved = banners.map(toRow);

    const publish = async () => {
        if (isMutating) return;
        try {
            await createBanner({
                title: draft.title.trim() || "Bannière sans titre",
                message: draft.content.trim() || null,
                variant: toSiteBannerVariant(draft.variant),
                audience: draft.audience,
                dismissible: draft.dismissible,
                actionLabel:
                    draft.hasAction && draft.actionLabel.trim()
                        ? draft.actionLabel.trim()
                        : null,
                actionUrl:
                    draft.hasAction && draft.actionLabel.trim()
                        ? draft.actionTarget.trim() || "/"
                        : null,
                isActive: true,
            });
            showToast({
                type: "success",
                title: "Bannière publiée",
                description: "Elle est désormais visible par les lecteurs.",
            });
        } catch (error) {
            showToast({
                type: "error",
                title: "Publication impossible",
                description: (error as Error).message,
            });
        }
    };

    const reset = () => {
        setDraft(blankDraft());
        setPreviewDismissed(false);
        setPreviewKey((k) => k + 1);
        showToast({ type: "info", title: "Éditeur réinitialisé" });
    };

    const deactivate = async () => {
        if (!activeId) return;
        try {
            await updateBanner(activeId, { isActive: false });
            showToast({ type: "info", title: "Bannière retirée du site" });
        } catch (error) {
            showToast({
                type: "error",
                title: "Désactivation impossible",
                description: (error as Error).message,
            });
        }
    };

    const loadFrom = (item: SavedBanner) => {
        setDraft({
            variant: item.variant,
            title: item.title,
            content: item.content || "",
            audience: item.audience,
            hasAction: !!item.action,
            actionLabel: item.action?.label || "",
            actionTarget: item.action?.target || "",
            dismissible: item.dismissible,
        });
        setPreviewDismissed(false);
        setPreviewKey((k) => k + 1);
        showToast({ type: "info", title: "Bannière chargée dans l'éditeur" });
    };

    const reactivate = async (item: SavedBanner) => {
        try {
            await updateBanner(item.id, { isActive: true });
            showToast({ type: "success", title: "Bannière réactivée" });
        } catch (error) {
            showToast({
                type: "error",
                title: "Réactivation impossible",
                description: (error as Error).message,
            });
        }
    };

    const remove = async (item: SavedBanner) => {
        try {
            await deleteBanner(item.id);
            showToast({ type: "success", title: "Bannière supprimée" });
        } catch (error) {
            showToast({
                type: "error",
                title: "Suppression impossible",
                description: (error as Error).message,
            });
        }
    };

    return (
        <div className="fade-up">
            <BannerTabHeader active={!!activeBanner} />

            {/* Disposition : éditeur (gauche) + aperçu épinglé (droite) */}
            <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(360px,420px)] lg:items-start">
                <BannerEditorPanel
                    draft={draft}
                    set={set}
                    onReset={reset}
                    onDeactivate={deactivate}
                    onPublish={publish}
                    hasActive={!!activeBanner}
                    isMutating={isMutating}
                />
                <BannerPreviewPanel
                    draft={draft}
                    previewKey={previewKey}
                    previewDismissed={previewDismissed}
                    onReplay={() => {
                        setPreviewDismissed(false);
                        setPreviewKey((k) => k + 1);
                    }}
                    onDismiss={() => setPreviewDismissed(true)}
                    saved={saved}
                    activeId={activeId}
                    onReactivate={reactivate}
                    onLoad={loadFrom}
                    onDelete={remove}
                />
            </div>
        </div>
    );
}
