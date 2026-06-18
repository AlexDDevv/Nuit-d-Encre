import { useState } from "react";
import {
    LuAlignLeft,
    LuExternalLink,
    LuHistory,
    LuLink2,
    LuMegaphone,
    LuMousePointer2,
    LuPower,
    LuRotateCcw,
    LuSend,
    LuType,
} from "react-icons/lu";
import Banner from "@/components/UI/Banner/Banner";
import Button from "@/components/UI/Button/Button";
import Icon from "@/components/UI/Icon/Icon";
import { Switch } from "@/components/UI/Switch/Switch";
import { Label } from "@/components/UI/form/Label";
import { Ornament } from "@/components/sections/admin/ui/chips";
import { useToast } from "@/hooks/toast/useToast";
import {
    Field,
    StateSelector,
    SavedBannerRow,
    blankDraft,
    inputCls,
    type BannerDraft,
    type SavedBanner,
} from "@/components/sections/admin/ui/bannerEditor";

/** Bannières fictives (le câblage GraphQL viendra avec les tâches backend). */
const SEED_SAVED: SavedBanner[] = [
    {
        id: "b-xp",
        variant: "success",
        title: "Vous avez gagné 50 points d'expérience !",
        content:
            "Trois chroniques publiées cette semaine — votre plume gagne en éclat. Continuez ainsi.",
        dismissible: true,
        action: { label: "Voir ma progression", target: "/profil" },
        date: "14 juin 2026",
    },
    {
        id: "b-maint",
        variant: "warning",
        title: "Maintenance nocturne prévue",
        content:
            "La bibliothèque fermera ses portes le 21 juin de 2h à 4h pour entretien des archives.",
        dismissible: true,
        action: null,
        date: "9 juin 2026",
    },
    {
        id: "b-club",
        variant: "info",
        title: "Le Cercle de Minuit ouvre ses inscriptions",
        content:
            "Rejoignez la lecture commune des « Chroniques du Crépuscule » dès le 1ᵉʳ juillet.",
        dismissible: true,
        action: { label: "Découvrir le cercle", target: "/cercles" },
        date: "2 juin 2026",
    },
    {
        id: "b-cgu",
        variant: "error",
        title: "Action requise : confirmez votre adresse",
        content:
            "Certains comptes n'ont pas validé leur courriel et seront suspendus sous 30 jours.",
        dismissible: false,
        action: { label: "Confirmer", target: "/compte/verification" },
        date: "28 mai 2026",
    },
];

/** Onglet « Bannières » : éditeur, aperçu en direct épinglé, historique. */
export function BannersTab() {
    const { showToast } = useToast();
    const [draft, setDraft] = useState<BannerDraft>({
        variant: "success",
        title: "Vous avez gagné 50 points d'expérience !",
        content:
            "Trois chroniques publiées cette semaine — votre plume gagne en éclat. Continuez ainsi.",
        hasAction: true,
        actionLabel: "Voir ma progression",
        actionTarget: "/profil",
        dismissible: true,
    });
    const [saved, setSaved] = useState<SavedBanner[]>(SEED_SAVED);
    const [activeId, setActiveId] = useState<string | null>("b-xp");
    const [publishing, setPublishing] = useState(false);
    const [previewKey, setPreviewKey] = useState(0);
    const [previewDismissed, setPreviewDismissed] = useState(false);

    const set = (patch: Partial<BannerDraft>) =>
        setDraft((d) => ({ ...d, ...patch }));
    const activeBanner = saved.find((s) => s.id === activeId) ?? null;

    const action =
        draft.hasAction && draft.actionLabel
            ? { label: draft.actionLabel, ariaLabel: draft.actionLabel }
            : undefined;

    const publish = () => {
        if (publishing) return;
        setPublishing(true);
        window.setTimeout(() => {
            const id = "b-" + Date.now().toString(36);
            const entry: SavedBanner = {
                id,
                variant: draft.variant,
                title: draft.title.trim() || "Bannière sans titre",
                content: draft.content.trim(),
                dismissible: draft.dismissible,
                action:
                    draft.hasAction && draft.actionLabel.trim()
                        ? {
                            label: draft.actionLabel.trim(),
                            target: draft.actionTarget.trim() || "/",
                        }
                        : null,
                date: new Date().toLocaleDateString("fr-FR", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                }),
            };
            setSaved((s) => [entry, ...s]);
            setActiveId(id);
            setPublishing(false);
            showToast({
                type: "success",
                title: "Bannière publiée",
                description: "Elle est désormais visible par les lecteurs.",
            });
        }, 1100);
    };

    const reset = () => {
        setDraft(blankDraft());
        setPreviewDismissed(false);
        setPreviewKey((k) => k + 1);
        showToast({ type: "info", title: "Éditeur réinitialisé" });
    };

    const deactivate = () => {
        setActiveId(null);
        showToast({ type: "info", title: "Bannière retirée du site" });
    };

    const loadFrom = (item: SavedBanner) => {
        setDraft({
            variant: item.variant,
            title: item.title,
            content: item.content || "",
            hasAction: !!item.action,
            actionLabel: item.action?.label || "",
            actionTarget: item.action?.target || "",
            dismissible: item.dismissible,
        });
        setPreviewDismissed(false);
        setPreviewKey((k) => k + 1);
        showToast({ type: "info", title: "Bannière chargée dans l'éditeur" });
    };

    const reactivate = (item: SavedBanner) => {
        setActiveId(item.id);
        showToast({ type: "success", title: "Bannière réactivée" });
    };

    return (
        <div className="fade-up">
            {/* En-tête d'onglet */}
            <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                <div className="flex items-center gap-3">
                    <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl border-2 border-primary/40 bg-gradient-to-b from-primary/15 to-transparent text-primary">
                        <LuMegaphone size={20} />
                    </span>
                    <div>
                        <h2 className="font-quote text-[23px] font-medium leading-tight text-foreground">
                            Composer une bannière
                        </h2>
                        <p className="mt-0.5 max-w-xl font-body text-[13px] leading-snug text-muted-foreground">
                            Choisissez l'état, rédigez le message et définissez
                            le lien du bouton. L'aperçu se met à jour en direct.
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-2 sm:pb-1">
                    {activeBanner ? (
                        <span className="inline-flex items-center gap-2 rounded-full border-2 border-primary/45 bg-primary/10 px-3 py-1.5 font-body text-[11.5px] font-bold uppercase tracking-[0.12em] text-primary">
                            <span className="h-2 w-2 animate-pulse rounded-full bg-primary" />{" "}
                            Une bannière est active
                        </span>
                    ) : (
                        <span className="inline-flex items-center gap-2 rounded-full border-2 border-border bg-muted/50 px-3 py-1.5 font-body text-[11.5px] font-bold uppercase tracking-[0.12em] text-muted-foreground">
                            <span className="h-2 w-2 rounded-full bg-muted-foreground/50" />{" "}
                            Aucune bannière active
                        </span>
                    )}
                </div>
            </div>

            {/* Disposition : éditeur (gauche) + aperçu épinglé (droite) */}
            <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(360px,420px)] lg:items-start">
                {/* ── Éditeur ── */}
                <div className="order-2 rounded-xl border-2 border-border bg-card lg:order-1">
                    <div className="flex flex-col gap-7 p-5 sm:p-6">
                        {/* État */}
                        <Field
                            icon={LuMegaphone}
                            label="État de la bannière"
                            hint="Détermine la couleur, l'icône et le ton du message."
                        >
                            <StateSelector
                                value={draft.variant}
                                onChange={(variant) => set({ variant })}
                            />
                        </Field>

                        <div className="h-px bg-border/70" />

                        {/* Titre */}
                        <Field
                            icon={LuType}
                            label="Titre"
                            htmlFor="b-title"
                            hint="Le message principal, lu en premier."
                        >
                            <input
                                id="b-title"
                                type="text"
                                value={draft.title}
                                onChange={(e) => set({ title: e.target.value })}
                                placeholder="Ex. Vous avez gagné 50 points d'expérience !"
                                className={inputCls}
                            />
                        </Field>

                        {/* Contenu */}
                        <Field
                            icon={LuAlignLeft}
                            label="Contenu"
                            htmlFor="b-content"
                            optional
                            hint="Détail secondaire affiché sous le titre."
                        >
                            <textarea
                                id="b-content"
                                rows={3}
                                value={draft.content}
                                onChange={(e) =>
                                    set({ content: e.target.value })
                                }
                                placeholder="Précisez le contexte, la récompense, l'échéance…"
                                className={`${inputCls} resize-none leading-relaxed`}
                            />
                        </Field>

                        <div className="h-px bg-border/70" />

                        {/* Bouton d'action */}
                        <div className="flex flex-col gap-4">
                            <div className="flex items-center justify-between gap-3">
                                <Label
                                    htmlFor="b-hasaction"
                                    className="flex items-center gap-2 font-body text-[12px] font-bold uppercase tracking-[0.14em] text-muted-foreground"
                                >
                                    <LuMousePointer2
                                        size={14}
                                        className="text-primary/70"
                                    />{" "}
                                    Ajouter un bouton
                                </Label>
                                <Switch
                                    id="b-hasaction"
                                    checked={draft.hasAction}
                                    onCheckedChange={(hasAction) =>
                                        set({ hasAction })
                                    }
                                    aria-label="Ajouter un bouton d'action"
                                />
                            </div>
                            {draft.hasAction && (
                                <div className="flex flex-col gap-4 rounded-lg border-2 border-border/70 bg-popover/40 p-4">
                                    <Field
                                        label="Libellé du bouton"
                                        htmlFor="b-actionlabel"
                                    >
                                        <input
                                            id="b-actionlabel"
                                            type="text"
                                            value={draft.actionLabel}
                                            onChange={(e) =>
                                                set({
                                                    actionLabel: e.target.value,
                                                })
                                            }
                                            placeholder="Ex. Voir ma progression"
                                            className={inputCls}
                                        />
                                    </Field>
                                    <Field
                                        icon={LuLink2}
                                        label="Cible de redirection"
                                        htmlFor="b-actiontarget"
                                        hint="Route interne (ex. « /livres ») ou URL complète. Au clic, l'utilisateur est redirigé."
                                    >
                                        <input
                                            id="b-actiontarget"
                                            type="text"
                                            value={draft.actionTarget}
                                            onChange={(e) =>
                                                set({
                                                    actionTarget:
                                                        e.target.value,
                                                })
                                            }
                                            placeholder="/livres ou https://…"
                                            className={`${inputCls} font-mono text-[13px]`}
                                        />
                                    </Field>
                                </div>
                            )}
                        </div>

                        <div className="h-px bg-border/70" />

                        {/* Fermable */}
                        <div className="flex items-center justify-between gap-3">
                            <div className="flex items-center gap-2">
                                <Icon
                                    name="x"
                                    size={14}
                                    className="text-primary/70"
                                />
                                <div>
                                    <Label
                                        htmlFor="b-dismiss"
                                        className="font-body text-[12px] font-bold uppercase tracking-[0.14em] text-muted-foreground"
                                    >
                                        L'utilisateur peut fermer la bannière
                                    </Label>
                                    <p className="mt-0.5 font-body text-[11.5px] text-muted-foreground/55">
                                        Affiche une croix de fermeture à droite.
                                    </p>
                                </div>
                            </div>
                            <Switch
                                id="b-dismiss"
                                checked={draft.dismissible}
                                onCheckedChange={(dismissible) =>
                                    set({ dismissible })
                                }
                                aria-label="Bannière fermable"
                            />
                        </div>

                        {/* Pied de l'éditeur */}
                        <div className="-mx-5 -mb-5 mt-1 flex flex-col gap-3 border-t-2 border-border/70 bg-popover/30 px-5 py-4 sm:-mx-6 sm:-mb-6 sm:flex-row sm:items-center sm:justify-between sm:px-6">
                            <button
                                type="button"
                                onClick={reset}
                                className="inline-flex items-center justify-center gap-2 rounded-lg border-2 border-transparent bg-transparent px-4 py-2.5 font-body text-[13.5px] font-bold tracking-wide text-muted-foreground transition-colors hover:bg-muted/60 hover:text-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
                            >
                                <LuRotateCcw size={15} /> Réinitialiser
                            </button>
                            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                                {activeBanner && (
                                    <button
                                        type="button"
                                        onClick={deactivate}
                                        className="inline-flex items-center justify-center gap-2 rounded-lg border-2 border-destructive/55 bg-transparent px-4 py-2.5 font-body text-[13.5px] font-bold tracking-wide text-destructive transition-colors hover:bg-destructive hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-destructive/40"
                                    >
                                        <LuPower size={15} /> Désactiver la
                                        bannière en cours
                                    </button>
                                )}
                                <Button
                                    variant="primary"
                                    onClick={publish}
                                    disabled={publishing}
                                    loading={publishing}
                                    leftIcon={<LuSend size={15} />}
                                    className="px-5"
                                >
                                    Publier la bannière
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* ── Aperçu en direct ── */}
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
                                        La bannière a été fermée par
                                        l'utilisateur.
                                    </p>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setPreviewDismissed(false);
                                            setPreviewKey((k) => k + 1);
                                        }}
                                        className="inline-flex items-center gap-1.5 rounded-md border-2 border-border px-3 py-1.5 font-body text-[12px] font-bold text-muted-foreground transition-colors hover:border-primary/55 hover:text-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
                                    >
                                        <LuRotateCcw size={13} /> Rejouer
                                        l'aperçu
                                    </button>
                                </div>
                            ) : (
                                <Banner
                                    key={previewKey}
                                    variant={draft.variant}
                                    title={
                                        draft.title || "Titre de la bannière…"
                                    }
                                    action={action}
                                    dismissible={draft.dismissible}
                                    onDismiss={() => setPreviewDismissed(true)}
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
                                    onReactivate={() => reactivate(item)}
                                    onLoad={() => loadFrom(item)}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
