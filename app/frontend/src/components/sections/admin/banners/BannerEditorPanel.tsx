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
import { Input } from "@/components/UI/form/Input";
import { Textarea } from "@/components/UI/form/Textarea";
import {
    atelierControlClass,
    atelierTextareaClass,
} from "@/components/sections/shared/atelierField";
import { cn } from "@/lib/utils";
import {
    Field,
    StateSelector,
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
        <div className="border-border bg-card order-2 rounded-xl border-2 lg:order-1">
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

                <div className="bg-border/70 h-px" />

                {/* Titre */}
                <Field
                    icon={LuType}
                    label="Titre"
                    htmlFor="b-title"
                    hint="Le message principal, lu en premier."
                >
                    <Input
                        id="b-title"
                        type="text"
                        value={draft.title}
                        onChange={(e) => set({ title: e.target.value })}
                        placeholder="Ex. Vous avez gagné 50 points d'expérience !"
                        errorMessage=""
                        hideErrorMessage
                        className={atelierControlClass}
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
                    <Textarea
                        id="b-content"
                        rows={3}
                        value={draft.content}
                        onChange={(e) => set({ content: e.target.value })}
                        placeholder="Précisez le contexte, la récompense, l'échéance…"
                        errorMessage=""
                        hideErrorMessage
                        className={atelierTextareaClass}
                    />
                </Field>

                <div className="bg-border/70 h-px" />

                {/* Bouton d'action */}
                <div className="flex flex-col gap-4">
                    <div className="flex items-center justify-between gap-3">
                        <Label
                            htmlFor="b-hasaction"
                            className="font-body text-muted-foreground flex items-center gap-2 text-xs font-bold uppercase tracking-[0.14em]"
                        >
                            <LuMousePointer2 className="text-primary/70" />{" "}
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
                        <div className="border-border/70 bg-popover/40 flex flex-col gap-4 rounded-lg border-2 p-4">
                            <Field
                                label="Libellé du bouton"
                                htmlFor="b-actionlabel"
                            >
                                <Input
                                    id="b-actionlabel"
                                    type="text"
                                    value={draft.actionLabel}
                                    onChange={(e) =>
                                        set({ actionLabel: e.target.value })
                                    }
                                    placeholder="Ex. Voir ma progression"
                                    errorMessage=""
                                    hideErrorMessage
                                    className={atelierControlClass}
                                />
                            </Field>
                            <Field
                                icon={LuLink2}
                                label="Cible de redirection"
                                htmlFor="b-actiontarget"
                                hint="Route interne (ex. « /livres ») ou URL complète. Au clic, l'utilisateur est redirigé."
                            >
                                <Input
                                    id="b-actiontarget"
                                    type="text"
                                    value={draft.actionTarget}
                                    onChange={(e) =>
                                        set({ actionTarget: e.target.value })
                                    }
                                    placeholder="/livres ou https://…"
                                    errorMessage=""
                                    hideErrorMessage
                                    className={cn(
                                        atelierControlClass,
                                        "font-mono",
                                    )}
                                />
                            </Field>
                        </div>
                    )}
                </div>

                <div className="bg-border/70 h-px" />

                {/* Audience */}
                <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                        <LuUsers className="text-primary/70" />
                        <div>
                            <Label
                                htmlFor="b-audience"
                                className="font-body text-muted-foreground text-xs font-bold uppercase tracking-[0.14em]"
                            >
                                Réserver aux membres connectés
                            </Label>
                            <p className="font-body text-muted-foreground/55 mt-0.5 text-xs">
                                Si activé, seuls les lecteurs connectés voient
                                la bannière ; sinon elle est visible par tous.
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

                <div className="bg-border/70 h-px" />

                {/* Fermable */}
                <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                        <Icon name="x" className="text-primary/70" />
                        <div>
                            <Label
                                htmlFor="b-dismiss"
                                className="font-body text-muted-foreground text-xs font-bold uppercase tracking-[0.14em]"
                            >
                                L'utilisateur peut fermer la bannière
                            </Label>
                            <p className="font-body text-muted-foreground/55 mt-0.5 text-xs">
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
                <div className="border-border/70 bg-popover/30 -mx-5 -mb-5 mt-1 flex flex-col gap-3 border-t-2 px-5 py-4 sm:-mx-6 sm:-mb-6 sm:flex-row sm:items-center sm:justify-between sm:px-6">
                    <button
                        type="button"
                        onClick={onReset}
                        className="font-body text-muted-foreground hover:bg-muted/60 hover:text-foreground focus-visible:ring-primary/40 inline-flex items-center justify-center gap-2 rounded-lg border-2 border-transparent bg-transparent px-4 py-2.5 text-sm font-bold tracking-wide transition-colors focus:outline-none focus-visible:ring-2"
                    >
                        <LuRotateCcw size={15} /> Réinitialiser
                    </button>
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                        {hasActive && (
                            <button
                                type="button"
                                onClick={onDeactivate}
                                className="border-destructive/55 font-body text-destructive hover:bg-destructive focus-visible:ring-destructive/40 inline-flex items-center justify-center gap-2 rounded-lg border-2 bg-transparent px-4 py-2.5 text-sm font-bold tracking-wide transition-colors hover:text-white focus:outline-none focus-visible:ring-2"
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
                        >
                            Publier la bannière
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
