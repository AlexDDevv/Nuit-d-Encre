import { useEffect, useRef, useState } from "react";
import { useMutation } from "@apollo/client";
import {
    FaXmark,
    FaCheck,
    FaLock,
    FaShieldHalved,
    FaRegUser,
    FaEye,
    FaEyeSlash,
    FaCircleExclamation,
} from "react-icons/fa6";
import Button from "@/components/UI/Button/Button";
import { UPDATE_PROFILE, CHANGE_PASSWORD } from "@/graphql/user/profile";
import { WHOAMI } from "@/graphql/user/auth";
import { useToast } from "@/hooks/toast/useToast";
import { User } from "@/types/types";
import { Ornament } from "./ProfileUI";

type Tab = "infos" | "security";

interface EditProfileModalProps {
    user: User;
    initialTab?: Tab;
    onClose: () => void;
}

// — Sélecteur d'onglets segmenté (bascule dorée) —
function TabSwitch({ tab, setTab }: { tab: Tab; setTab: (t: Tab) => void }) {
    const opts = [
        { id: "infos" as const, label: "Informations", icon: FaRegUser },
        { id: "security" as const, label: "Sécurité", icon: FaShieldHalved },
    ];
    return (
        <div
            role="tablist"
            aria-label="Sections du profil"
            className="border-border bg-popover grid grid-cols-2 gap-1 rounded-lg border-2 p-1"
        >
            {opts.map((o) => {
                const on = tab === o.id;
                const Icon = o.icon;
                return (
                    <button
                        key={o.id}
                        role="tab"
                        aria-selected={on}
                        id={`tab-${o.id}`}
                        aria-controls={`panel-${o.id}`}
                        onClick={() => setTab(o.id)}
                        className={`inline-flex items-center justify-center gap-2 rounded-md px-3.5 py-2 font-body text-[13.5px] font-bold tracking-wide whitespace-nowrap transition-all duration-200 ${
                            on
                                ? "bg-primary text-primary-foreground shadow-sm"
                                : "text-muted-foreground hover:text-foreground"
                        }`}
                    >
                        <Icon size={14} /> {o.label}
                    </button>
                );
            })}
        </div>
    );
}

// — Champ : étiquette ornementale + indice + erreur inline —
function Field({
    id,
    label,
    hint,
    error,
    children,
}: {
    id: string;
    label: string;
    hint?: string;
    error?: string;
    children: React.ReactNode;
}) {
    return (
        <div className="flex flex-col gap-1.5">
            <label
                htmlFor={id}
                className="flex items-baseline justify-between gap-3"
            >
                <span className="text-foreground/85 font-quote text-[15px] italic">
                    {label}
                </span>
                {hint && (
                    <span className="text-muted-foreground/70 font-body text-[11px] tracking-wider uppercase">
                        {hint}
                    </span>
                )}
            </label>
            {children}
            {error && (
                <p
                    role="alert"
                    className="text-destructive flex items-center gap-1.5 font-body text-[12.5px] font-bold"
                >
                    <FaCircleExclamation size={13} /> {error}
                </p>
            )}
        </div>
    );
}

const inputBase =
    "w-full rounded-lg border-2 bg-popover px-3.5 py-2.5 font-body text-[15px] text-foreground placeholder:text-muted-foreground/55 transition-colors duration-200 focus:outline-none focus:border-primary";

function TextInput({
    id,
    error,
    ...rest
}: { id: string; error?: string } & React.InputHTMLAttributes<HTMLInputElement>) {
    return (
        <input
            id={id}
            aria-invalid={!!error}
            className={`${inputBase} ${error ? "border-destructive/70" : "border-border"}`}
            {...rest}
        />
    );
}

function PasswordInput({
    id,
    error,
    ...rest
}: { id: string; error?: string } & React.InputHTMLAttributes<HTMLInputElement>) {
    const [show, setShow] = useState(false);
    return (
        <div className="relative">
            <input
                id={id}
                type={show ? "text" : "password"}
                aria-invalid={!!error}
                className={`${inputBase} pr-11 ${error ? "border-destructive/70" : "border-border"}`}
                {...rest}
            />
            <button
                type="button"
                onClick={() => setShow((v) => !v)}
                aria-label={
                    show ? "Masquer le mot de passe" : "Afficher le mot de passe"
                }
                title={show ? "Masquer" : "Afficher"}
                className="text-muted-foreground hover:text-primary absolute top-1/2 right-1.5 grid h-8 w-8 -translate-y-1/2 place-items-center rounded-md transition-colors focus:outline-none"
            >
                {show ? <FaEyeSlash size={16} /> : <FaEye size={16} />}
            </button>
        </div>
    );
}

// — Validation —
const validateInfos = ({ name, bio }: { name: string; bio: string }) => {
    const n = name.trim();
    const e: { name?: string; bio?: string } = {};
    if (n.length === 0) e.name = "Le nom d'utilisateur est requis.";
    else if (n.length < 2) e.name = "Le nom doit comporter au moins 2 caractères.";
    else if (n.length > 100) e.name = "100 caractères maximum.";
    if (bio.length > 300) e.bio = "La bio ne doit pas dépasser 300 caractères.";
    return e;
};
const validateSecurity = ({
    current,
    newpw,
    confirm,
}: {
    current: string;
    newpw: string;
    confirm: string;
}) => {
    const e: { current?: string; newpw?: string; confirm?: string } = {};
    if (!current) e.current = "Saisissez votre mot de passe actuel.";
    if (newpw.length < 8) e.newpw = "8 caractères minimum.";
    if (confirm !== newpw) e.confirm = "Les mots de passe ne correspondent pas.";
    return e;
};

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
    const [submitted, setSubmitted] = useState({ infos: false, security: false });

    const refetch = [{ query: WHOAMI }];
    const [updateProfile, { loading: savingInfos }] = useMutation(UPDATE_PROFILE, {
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
    });
    const [changePassword, { loading: savingPw }] = useMutation(CHANGE_PASSWORD, {
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
                    err.message || "La modification du mot de passe a échoué.",
            }),
    });
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
                ).filter((n) => n.offsetParent !== null || n === document.activeElement);
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
        <div className="fixed inset-0 z-[60] flex items-end justify-center sm:items-center">
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
                className="modal-in border-border bg-popover grain relative z-10 flex max-h-[92vh] w-full flex-col overflow-hidden rounded-t-2xl border-2 shadow-[0_30px_80px_-20px_hsl(0_0%_0%/0.85)] sm:max-h-[90vh] sm:w-[520px] sm:rounded-2xl"
            >
                {/* En-tête */}
                <div className="border-border/70 relative shrink-0 border-b-2 px-5 pt-5 pb-4 md:px-7">
                    <button
                        type="button"
                        onClick={close}
                        aria-label="Fermer"
                        disabled={submitting}
                        className="border-border text-muted-foreground hover:border-primary hover:text-primary absolute top-3.5 right-3.5 grid h-9 w-9 place-items-center rounded-lg border-2 transition-colors focus:outline-none disabled:opacity-40"
                    >
                        <FaXmark size={18} />
                    </button>
                    <div className="flex flex-col items-start gap-1 pr-10">
                        <span className="text-muted-foreground font-body text-[11px] tracking-[0.28em] uppercase">
                            Votre profil
                        </span>
                        <h2
                            id="edit-modal-title"
                            className="text-foreground font-quote text-[24px] leading-none font-semibold md:text-[26px]"
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
                                        setTouched((t) => ({ ...t, name: true }))
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
                                        className={`bg-popover text-foreground/90 placeholder:text-muted-foreground/55 focus:border-primary w-full resize-none rounded-lg border-2 px-3.5 py-3 font-quote text-[16px] leading-relaxed italic transition-colors duration-200 placeholder:not-italic focus:outline-none ${
                                            showI("bio") && errInfos.bio
                                                ? "border-destructive/70"
                                                : "border-border"
                                        }`}
                                    />
                                    <span
                                        className={`pointer-events-none absolute right-3 bottom-2.5 font-title text-[11px] font-bold ${bioTone}`}
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
                                <p className="text-muted-foreground/80 flex items-center gap-1.5 font-quote text-[13px] italic">
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
                            size="md"
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
                                leftIcon={<FaCheck size={15} />}
                            >
                                Enregistrer
                            </Button>
                        ) : (
                            <Button
                                variant="primary"
                                size="md"
                                onClick={submitSecurity}
                                loading={savingPw}
                                leftIcon={<FaLock size={14} />}
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
