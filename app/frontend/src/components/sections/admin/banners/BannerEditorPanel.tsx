import {
    LuAlignLeft,
    LuLink2,
    LuMegaphone,
    LuMousePointer2,
    LuPower,
    LuRotateCcw,
    LuSend,
    LuType,
    LuUsers,
} from "react-icons/lu";
import Button from "@/components/UI/Button/Button";
import Icon from "@/components/UI/Icon/Icon";
import { Switch } from "@/components/UI/Switch/Switch";
import { Label } from "@/components/UI/form/Label";
import {
    Field,
    StateSelector,
    inputCls,
    type BannerDraft,
} from "@/components/sections/admin/ui/bannerEditor";

/** Panneau gauche : éditeur de bannière (état, titre, contenu, action, options). */
export default function BannerEditorPanel({
    draft,
    set,
    onReset,
    onDeactivate,
    onPublish,
    hasActive,
    isMutating,
}: {
    draft: BannerDraft;
    set: (patch: Partial<BannerDraft>) => void;
    onReset: () => void;
    onDeactivate: () => void;
    onPublish: () => void;
    hasActive: boolean;
    isMutating: boolean;
}) {
    return (
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
                        onChange={(e) => set({ content: e.target.value })}
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
                            className="flex items-center gap-2 font-body text-xs font-bold uppercase tracking-[0.14em] text-muted-foreground"
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
                            onCheckedChange={(hasAction) => set({ hasAction })}
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
                                        set({ actionLabel: e.target.value })
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
                                        set({ actionTarget: e.target.value })
                                    }
                                    placeholder="/livres ou https://…"
                                    className={`${inputCls} font-mono text-sm`}
                                />
                            </Field>
                        </div>
                    )}
                </div>

                <div className="h-px bg-border/70" />

                {/* Audience */}
                <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                        <LuUsers size={14} className="text-primary/70" />
                        <div>
                            <Label
                                htmlFor="b-audience"
                                className="font-body text-xs font-bold uppercase tracking-[0.14em] text-muted-foreground"
                            >
                                Réserver aux membres connectés
                            </Label>
                            <p className="mt-0.5 font-body text-xs text-muted-foreground/55">
                                Si activé, seuls les lecteurs connectés voient la
                                bannière ; sinon elle est visible par tous.
                            </p>
                        </div>
                    </div>
                    <Switch
                        id="b-audience"
                        checked={draft.audience === "AUTHENTICATED"}
                        onCheckedChange={(restricted) =>
                            set({
                                audience: restricted ? "AUTHENTICATED" : "ALL",
                            })
                        }
                        aria-label="Réserver la bannière aux membres connectés"
                    />
                </div>

                <div className="h-px bg-border/70" />

                {/* Fermable */}
                <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                        <Icon name="x" size={14} className="text-primary/70" />
                        <div>
                            <Label
                                htmlFor="b-dismiss"
                                className="font-body text-xs font-bold uppercase tracking-[0.14em] text-muted-foreground"
                            >
                                L'utilisateur peut fermer la bannière
                            </Label>
                            <p className="mt-0.5 font-body text-xs text-muted-foreground/55">
                                Affiche une croix de fermeture à droite.
                            </p>
                        </div>
                    </div>
                    <Switch
                        id="b-dismiss"
                        checked={draft.dismissible}
                        onCheckedChange={(dismissible) => set({ dismissible })}
                        aria-label="Bannière fermable"
                    />
                </div>

                {/* Pied de l'éditeur */}
                <div className="-mx-5 -mb-5 mt-1 flex flex-col gap-3 border-t-2 border-border/70 bg-popover/30 px-5 py-4 sm:-mx-6 sm:-mb-6 sm:flex-row sm:items-center sm:justify-between sm:px-6">
                    <button
                        type="button"
                        onClick={onReset}
                        className="inline-flex items-center justify-center gap-2 rounded-lg border-2 border-transparent bg-transparent px-4 py-2.5 font-body text-sm font-bold tracking-wide text-muted-foreground transition-colors hover:bg-muted/60 hover:text-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
                    >
                        <LuRotateCcw size={15} /> Réinitialiser
                    </button>
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                        {hasActive && (
                            <button
                                type="button"
                                onClick={onDeactivate}
                                className="inline-flex items-center justify-center gap-2 rounded-lg border-2 border-destructive/55 bg-transparent px-4 py-2.5 font-body text-sm font-bold tracking-wide text-destructive transition-colors hover:bg-destructive hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-destructive/40"
                            >
                                <LuPower size={15} /> Désactiver la bannière en
                                cours
                            </button>
                        )}
                        <Button
                            variant="primary"
                            onClick={onPublish}
                            disabled={isMutating}
                            loading={isMutating}
                            leftIcon={<LuSend size={15} />}
                            className="px-5"
                        >
                            Publier la bannière
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
