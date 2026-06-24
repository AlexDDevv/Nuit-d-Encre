import { useEffect, useRef, useState } from "react";
import { useMutation } from "@apollo/client";
import { FaXmark, FaCheck, FaLock } from "react-icons/fa6";
import Button from "@/components/UI/Button/Button";
import { UPDATE_PROFILE, CHANGE_PASSWORD } from "@/graphql/user/profile";
import { WHOAMI } from "@/graphql/user/auth";
import { useToast } from "@/hooks/toast/useToast";
import { User } from "@/types/types";
import { atelierTextareaClass } from "@/components/sections/shared/atelierField";
import { cn } from "@/lib/utils";
import { Ornament } from "./ProfileUI";
import { Tab } from "./editProfile/types";
import TabSwitch from "./editProfile/TabSwitch";
import Field from "./editProfile/Field";
import { TextInput, PasswordInput } from "./editProfile/Inputs";
import { validateInfos, validateSecurity } from "./editProfile/validation";

interface EditProfileModalProps {
    user: User;
    initialTab?: Tab;
    onClose: () => void;
}

export default function EditProfileModal({
    user,
    initialTab = "infos",
    onClose,
}: EditProfileModalProps) {
    const dialogRef = useRef<HTMLDivElement>(null);
    const lastFocus = useRef<Element | null>(null);
    const { showToast } = useToast();

    const [tab, setTab] = useState<Tab>(initialTab);
    const [name, setName] = useState(user.userName);
    const [bio, setBio] = useState(user.bio ?? "");
    const [current, setCurrent] = useState("");
    const [newpw, setNewpw] = useState("");
    const [confirm, setConfirm] = useState("");
    const [touched, setTouched] = useState<Record<string, boolean>>({});
    const [submitted, setSubmitted] = useState({
        infos: false,
        security: false,
    });

    const refetch = [{ query: WHOAMI }];
    const [updateProfile, { loading: savingInfos }] = useMutation(
        UPDATE_PROFILE,
        {
            refetchQueries: refetch,
            onCompleted: () => {
                showToast({
                    type: "success",
                    title: "Profil mis à jour",
                    description: "Vos informations ont été enregistrées.",
                });
                finishClose();
            },
            onError: () =>
                showToast({
                    type: "error",
                    title: "Erreur",
                    description: "La mise à jour du profil a échoué.",
                }),
        },
    );
    const [changePassword, { loading: savingPw }] = useMutation(
        CHANGE_PASSWORD,
        {
            onCompleted: () => {
                showToast({
                    type: "success",
                    title: "Mot de passe modifié",
                    description: "Votre nouveau sésame est scellé.",
                });
                finishClose();
            },
            onError: (err) =>
                showToast({
                    type: "error",
                    title: "Erreur",
                    description:
                        err.message ||
                        "La modification du mot de passe a échoué.",
                }),
        },
    );
    const submitting = savingInfos || savingPw;

    // Fermeture inconditionnelle (après succès) : restaure le focus déclencheur.
    const finishClose = () => {
        onClose();
        if (lastFocus.current instanceof HTMLElement) {
            const el = lastFocus.current;
            setTimeout(() => el.focus(), 0);
        }
    };
    // Fermeture manuelle (Annuler / backdrop / Échap) : bloquée pendant l'envoi.
    const close = () => {
        if (submitting) return;
        finishClose();
    };

    // Verrou de défilement + Échap + piège de focus + focus initial
    useEffect(() => {
        lastFocus.current = document.activeElement;
        const first = dialogRef.current?.querySelector<HTMLElement>(
            "input, textarea, button",
        );
        const focusTimer = setTimeout(() => first?.focus(), 60);

        const onKey = (ev: KeyboardEvent) => {
            if (ev.key === "Escape" && !submitting) {
                ev.preventDefault();
                close();
            }
            if (ev.key === "Tab" && dialogRef.current) {
                const nodes = Array.from(
                    dialogRef.current.querySelectorAll<HTMLElement>(
                        'a[href], button:not([disabled]), input:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
                    ),
                ).filter(
                    (n) =>
                        n.offsetParent !== null || n === document.activeElement,
                );
                if (!nodes.length) return;
                const firstEl = nodes[0];
                const lastEl = nodes[nodes.length - 1];
                if (ev.shiftKey && document.activeElement === firstEl) {
                    ev.preventDefault();
                    lastEl.focus();
                } else if (!ev.shiftKey && document.activeElement === lastEl) {
                    ev.preventDefault();
                    firstEl.focus();
                }
            }
        };
        document.addEventListener("keydown", onKey);
        const prevOverflow = document.body.style.overflow;
        document.body.style.overflow = "hidden";
        return () => {
            clearTimeout(focusTimer);
            document.removeEventListener("keydown", onKey);
            document.body.style.overflow = prevOverflow;
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [submitting]);

    const errInfos = validateInfos({ name, bio });
    const errSec = validateSecurity({ current, newpw, confirm });
    const showI = (f: string) => submitted.infos || touched[f];
    const showS = (f: string) => submitted.security || touched[f];

    const submitInfos = () => {
        setSubmitted((s) => ({ ...s, infos: true }));
        if (Object.keys(errInfos).length) return;
        updateProfile({ variables: { data: { userName: name.trim(), bio } } });
    };
    const submitSecurity = () => {
        setSubmitted((s) => ({ ...s, security: true }));
        if (Object.keys(errSec).length) return;
        changePassword({
            variables: { currentPassword: current, newPassword: newpw },
        });
    };

    const bioLen = bio.length;
    const bioTone =
        bioLen > 300
            ? "text-destructive"
            : bioLen > 270
              ? "text-warning-medium"
              : "text-muted-foreground/70";

    return (
        <div className="z-60 fixed inset-0 flex items-end justify-center sm:items-center">
            <div
                className="overlay-in bg-background/70 absolute inset-0 backdrop-blur-sm"
                onClick={close}
                aria-hidden="true"
            />

            <div
                ref={dialogRef}
                role="dialog"
                aria-modal="true"
                aria-labelledby="edit-modal-title"
                className="modal-in border-border bg-popover grain sm:w-130 relative z-10 flex max-h-[92vh] w-full flex-col overflow-hidden rounded-t-2xl border-2 shadow-[0_30px_80px_-20px_hsl(0_0%_0%/0.85)] sm:max-h-[90vh] sm:rounded-2xl"
            >
                {/* En-tête */}
                <div className="border-border/70 relative shrink-0 border-b-2 px-5 pb-4 pt-5 md:px-7">
                    <button
                        type="button"
                        onClick={close}
                        aria-label="Fermer"
                        disabled={submitting}
                        className="border-border text-muted-foreground hover:border-primary hover:text-primary absolute right-3.5 top-3.5 grid h-9 w-9 place-items-center rounded-lg border-2 transition-colors focus:outline-none disabled:opacity-40"
                    >
                        <FaXmark size={18} />
                    </button>
                    <div className="flex flex-col items-start gap-1 pr-10">
                        <span className="text-muted-foreground font-body text-xs uppercase tracking-[0.28em]">
                            Votre profil
                        </span>
                        <h2
                            id="edit-modal-title"
                            className="text-foreground font-quote text-2xl font-semibold leading-none"
                        >
                            Modifier le profil
                        </h2>
                    </div>
                    <div className="mt-4">
                        <TabSwitch tab={tab} setTab={setTab} />
                    </div>
                </div>

                {/* Corps défilable */}
                <div className="min-h-0 flex-1 overflow-y-auto px-5 py-5 md:px-7">
                    {tab === "infos" ? (
                        <div
                            role="tabpanel"
                            id="panel-infos"
                            aria-labelledby="tab-infos"
                            className="flex flex-col gap-5"
                        >
                            <Field
                                id="f-name"
                                label="Nom d'utilisateur"
                                hint="2 à 100 caractères"
                                error={showI("name") ? errInfos.name : ""}
                            >
                                <TextInput
                                    id="f-name"
                                    value={name}
                                    maxLength={120}
                                    error={showI("name") ? errInfos.name : ""}
                                    placeholder="Votre nom de lecteur"
                                    onChange={(e) => setName(e.target.value)}
                                    onBlur={() =>
                                        setTouched((t) => ({
                                            ...t,
                                            name: true,
                                        }))
                                    }
                                />
                            </Field>

                            <Field
                                id="f-bio"
                                label="Bio"
                                hint="Récit en quelques lignes"
                                error={showI("bio") ? errInfos.bio : ""}
                            >
                                <div className="relative">
                                    <textarea
                                        id="f-bio"
                                        value={bio}
                                        rows={4}
                                        maxLength={360}
                                        aria-invalid={
                                            !!(showI("bio") && errInfos.bio)
                                        }
                                        placeholder="Quelques mots sur votre rapport aux livres…"
                                        onChange={(e) => setBio(e.target.value)}
                                        onBlur={() =>
                                            setTouched((t) => ({
                                                ...t,
                                                bio: true,
                                            }))
                                        }
                                        className={cn(
                                            atelierTextareaClass,
                                            "font-quote w-full resize-none px-3.5 py-3 text-base italic placeholder:not-italic focus-visible:outline-none",
                                            showI("bio") &&
                                                errInfos.bio &&
                                                "border-destructive focus-visible:border-destructive",
                                        )}
                                    />
                                    <span
                                        className={`font-title pointer-events-none absolute bottom-2.5 right-3 text-xs font-bold ${bioTone}`}
                                    >
                                        {bioLen}/300
                                    </span>
                                </div>
                            </Field>
                        </div>
                    ) : (
                        <div
                            role="tabpanel"
                            id="panel-security"
                            aria-labelledby="tab-security"
                            className="flex flex-col gap-5"
                        >
                            <Field
                                id="f-current"
                                label="Mot de passe actuel"
                                error={showS("current") ? errSec.current : ""}
                            >
                                <PasswordInput
                                    id="f-current"
                                    value={current}
                                    error={
                                        showS("current") ? errSec.current : ""
                                    }
                                    autoComplete="current-password"
                                    placeholder="••••••••"
                                    onChange={(e) => setCurrent(e.target.value)}
                                    onBlur={() =>
                                        setTouched((t) => ({
                                            ...t,
                                            current: true,
                                        }))
                                    }
                                />
                            </Field>

                            <Field
                                id="f-newpw"
                                label="Nouveau mot de passe"
                                hint="8 caractères minimum"
                                error={showS("newpw") ? errSec.newpw : ""}
                            >
                                <PasswordInput
                                    id="f-newpw"
                                    value={newpw}
                                    error={showS("newpw") ? errSec.newpw : ""}
                                    autoComplete="new-password"
                                    placeholder="••••••••"
                                    onChange={(e) => setNewpw(e.target.value)}
                                    onBlur={() =>
                                        setTouched((t) => ({
                                            ...t,
                                            newpw: true,
                                        }))
                                    }
                                />
                                <p className="text-muted-foreground/80 font-quote flex items-center gap-1.5 text-sm italic">
                                    <FaLock
                                        size={11}
                                        className="text-primary/55"
                                    />{" "}
                                    Au moins 8 caractères pour sceller votre
                                    grimoire.
                                </p>
                            </Field>

                            <Field
                                id="f-confirm"
                                label="Confirmer le nouveau mot de passe"
                                error={showS("confirm") ? errSec.confirm : ""}
                            >
                                <PasswordInput
                                    id="f-confirm"
                                    value={confirm}
                                    error={
                                        showS("confirm") ? errSec.confirm : ""
                                    }
                                    autoComplete="new-password"
                                    placeholder="••••••••"
                                    onChange={(e) => setConfirm(e.target.value)}
                                    onBlur={() =>
                                        setTouched((t) => ({
                                            ...t,
                                            confirm: true,
                                        }))
                                    }
                                />
                            </Field>
                        </div>
                    )}
                </div>

                {/* Pied */}
                <div className="border-border/70 shrink-0 border-t-2 px-5 py-4 md:px-7">
                    <div className="mb-3 flex justify-center">
                        <Ornament width="w-10" />
                    </div>
                    <div className="flex items-center justify-end gap-2.5">
                        <Button
                            variant="text"
                            onClick={close}
                            disabled={submitting}
                        >
                            Annuler
                        </Button>
                        {tab === "infos" ? (
                            <Button
                                variant="primary"
                                size="md"
                                onClick={submitInfos}
                                loading={savingInfos}
                                leftIcon={<FaCheck />}
                            >
                                Enregistrer
                            </Button>
                        ) : (
                            <Button
                                variant="primary"
                                onClick={submitSecurity}
                                loading={savingPw}
                                leftIcon={<FaLock />}
                            >
                                Changer le mot de passe
                            </Button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
