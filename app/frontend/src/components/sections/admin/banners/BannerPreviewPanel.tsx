import { LuExternalLink, LuHistory, LuRotateCcw } from "react-icons/lu";
import Banner from "@/components/UI/Banner/Banner";
import { Ornament } from "@/components/sections/admin/ui/chips";
import {
    SavedBannerRow,
    type BannerDraft,
    type SavedBanner,
} from "@/components/sections/admin/ui/bannerEditor";

/** Panneau droit : aperçu en direct de la bannière + historique des bannières. */
export default function BannerPreviewPanel({
    draft,
    previewKey,
    previewDismissed,
    onReplay,
    onDismiss,
    saved,
    activeId,
    onReactivate,
    onLoad,
    onDelete,
}: {
    draft: BannerDraft;
    previewKey: number;
    previewDismissed: boolean;
    onReplay: () => void;
    onDismiss: () => void;
    saved: SavedBanner[];
    activeId: string | null;
    onReactivate: (item: SavedBanner) => void;
    onLoad: (item: SavedBanner) => void;
    onDelete: (item: SavedBanner) => void;
}) {
    const action =
        draft.hasAction && draft.actionLabel
            ? { label: draft.actionLabel, ariaLabel: draft.actionLabel }
            : undefined;

    return (
        <div className="order-1 flex flex-col gap-5 lg:order-2 lg:sticky lg:top-24">
            <div>
                <div className="mb-3 flex items-center gap-2.5">
                    <Ornament width="w-5" />
                    <span className="font-body text-[11px] font-bold uppercase tracking-[0.24em] text-muted-foreground">
                        Aperçu en direct
                    </span>
                </div>
                <div className="rounded-2xl border-2 border-border bg-background/60 p-4 shadow-[inset_0_1px_0_hsl(43_30%_60%/0.05)]">
                    {previewDismissed ? (
                        <div className="flex flex-col items-center gap-3 px-4 py-8 text-center">
                            <p className="font-quote text-[15px] italic text-muted-foreground/70">
                                La bannière a été fermée par l'utilisateur.
                            </p>
                            <button
                                type="button"
                                onClick={onReplay}
                                className="inline-flex items-center gap-1.5 rounded-md border-2 border-border px-3 py-1.5 font-body text-[12px] font-bold text-muted-foreground transition-colors hover:border-primary/55 hover:text-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
                            >
                                <LuRotateCcw size={13} /> Rejouer l'aperçu
                            </button>
                        </div>
                    ) : (
                        <Banner
                            key={previewKey}
                            variant={draft.variant}
                            title={draft.title || "Titre de la bannière…"}
                            action={action}
                            dismissible={draft.dismissible}
                            onDismiss={onDismiss}
                        >
                            {draft.content}
                        </Banner>
                    )}
                </div>
                {/* Récap redirection */}
                {draft.hasAction && draft.actionTarget && (
                    <div className="mt-3 flex items-center gap-2 rounded-lg border border-border bg-popover/40 px-3 py-2 font-body text-[12px] text-muted-foreground">
                        <LuExternalLink
                            size={13}
                            className="shrink-0 text-primary/65"
                        />
                        <span>Le bouton redirige vers&nbsp;</span>
                        <code className="truncate rounded bg-background/70 px-1.5 py-0.5 font-mono text-[11.5px] text-foreground/85">
                            {draft.actionTarget}
                        </code>
                    </div>
                )}
            </div>

            {/* Historique des bannières */}
            <div className="rounded-xl border-2 border-border bg-card">
                <div className="flex items-center gap-2.5 border-b-2 border-border/70 px-4 py-3">
                    <LuHistory size={15} className="text-primary/75" />
                    <h3 className="font-body text-[12px] font-bold uppercase tracking-[0.16em] text-foreground/85">
                        Bannières enregistrées
                    </h3>
                    <span className="ml-auto rounded-full bg-muted/60 px-2 py-0.5 font-body text-[11px] font-bold text-muted-foreground">
                        {saved.length}
                    </span>
                </div>
                <div className="flex max-h-[460px] flex-col gap-2.5 overflow-y-auto p-3">
                    {saved.map((item) => (
                        <SavedBannerRow
                            key={item.id}
                            item={item}
                            isActive={item.id === activeId}
                            onReactivate={() => onReactivate(item)}
                            onLoad={() => onLoad(item)}
                            onDelete={() => onDelete(item)}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}
