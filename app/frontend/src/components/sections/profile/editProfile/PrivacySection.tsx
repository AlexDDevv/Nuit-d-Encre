import { useLazyQuery, useMutation } from "@apollo/client";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { LuDownload, LuTriangleAlert } from "react-icons/lu";
import Button from "@/components/UI/Button/Button";
import { DELETE_MY_ACCOUNT, EXPORT_MY_DATA } from "@/graphql/user/privacy";
import { useAuthContext } from "@/hooks/auth/useAuthContext";
import { useToast } from "@/hooks/toast/useToast";
import { downloadJson } from "@/lib/downloadJson";
import Field from "./Field";
import { PasswordInput } from "./Inputs";

/** Droits RGPD self-service : export des données et suppression de compte. */
export default function PrivacySection() {
    const { refetchUser } = useAuthContext();
    const navigate = useNavigate();
    const { showToast } = useToast();
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [password, setPassword] = useState("");

    const [runExport, { loading: exporting }] = useLazyQuery(EXPORT_MY_DATA, {
        fetchPolicy: "network-only",
    });
    const [deleteAccount, { loading: deleting }] = useMutation(
        DELETE_MY_ACCOUNT,
    );

    const handleExport = async () => {
        const { data } = await runExport();
        if (data?.exportMyData) {
            downloadJson("nuit-dencre-mes-donnees.json", data.exportMyData);
            showToast({
                type: "success",
                title: "Export prêt",
                description: "Vos données ont été téléchargées.",
            });
        }
    };

    const handleDelete = async () => {
        try {
            await deleteAccount({ variables: { password: password || null } });
            showToast({
                type: "success",
                title: "Compte supprimé",
                description: "Vos données personnelles ont été effacées.",
            });
            refetchUser();
            navigate("/");
        } catch {
            showToast({
                type: "error",
                title: "Échec",
                description: "Mot de passe incorrect ou erreur serveur.",
            });
        }
    };

    return (
        <section className="flex flex-col gap-6">
            <div className="flex flex-col gap-2">
                <h3 className="text-foreground/85 font-quote text-base italic">
                    Mes données
                </h3>
                <p className="text-muted-foreground/80 font-body text-sm">
                    Téléchargez une copie de toutes vos données personnelles
                    au format JSON.
                </p>
                <Button
                    variant="secondary"
                    onClick={handleExport}
                    loading={exporting}
                    leftIcon={<LuDownload />}
                    className="w-fit"
                >
                    Télécharger mes données
                </Button>
            </div>

            <div className="border-destructive/40 flex flex-col gap-3 rounded-lg border-2 p-4">
                <div className="text-destructive flex items-center gap-2">
                    <LuTriangleAlert className="size-4" />
                    <h3 className="font-quote text-base italic">
                        Supprimer mon compte
                    </h3>
                </div>
                <p className="text-muted-foreground/80 font-body text-sm">
                    Cette action est irréversible. Votre profil et vos données
                    personnelles seront définitivement supprimés ; vos
                    critiques publiques seront anonymisées.
                </p>
                {!confirmOpen ? (
                    <Button
                        variant="destructiveGhost"
                        onClick={() => setConfirmOpen(true)}
                        className="w-fit"
                    >
                        Supprimer mon compte
                    </Button>
                ) : (
                    <div className="flex flex-col gap-3">
                        <Field
                            id="f-delete-password"
                            label="Confirmez avec votre mot de passe"
                            hint="Comptes locaux uniquement"
                        >
                            <PasswordInput
                                id="f-delete-password"
                                value={password}
                                autoComplete="current-password"
                                placeholder="••••••••"
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </Field>
                        <div className="flex gap-2.5">
                            <Button
                                variant="destructive"
                                onClick={handleDelete}
                                loading={deleting}
                            >
                                Confirmer la suppression
                            </Button>
                            <Button
                                variant="text"
                                onClick={() => {
                                    setConfirmOpen(false);
                                    setPassword("");
                                }}
                                disabled={deleting}
                            >
                                Annuler
                            </Button>
                        </div>
                    </div>
                )}
            </div>
        </section>
    );
}
