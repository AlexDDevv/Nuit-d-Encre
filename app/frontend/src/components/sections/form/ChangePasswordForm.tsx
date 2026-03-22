import { useForm } from "react-hook-form";
import { useMutation } from "@apollo/client";
import { CHANGE_PASSWORD } from "@/graphql/user/profile";

interface ChangePasswordFormProps {
    onSuccess?: () => void;
}

type FormData = {
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
};

export default function ChangePasswordForm({ onSuccess }: ChangePasswordFormProps) {
    const { register, handleSubmit, watch, formState: { errors }, reset } = useForm<FormData>();

    const [changePassword, { loading, error }] = useMutation(CHANGE_PASSWORD, {
        onCompleted: () => {
            reset();
            onSuccess?.();
        },
    });

    const onSubmit = (data: FormData) => {
        changePassword({
            variables: {
                currentPassword: data.currentPassword,
                newPassword: data.newPassword,
            },
        });
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
                <label className="block text-sm text-muted-foreground mb-1">Mot de passe actuel</label>
                <input
                    type="password"
                    {...register("currentPassword", { required: "Champ requis" })}
                    className="w-full bg-accent border border-border rounded px-3 py-2 text-foreground text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                />
                {errors.currentPassword && (
                    <p className="text-destructive text-xs mt-1">{errors.currentPassword.message}</p>
                )}
            </div>

            <div>
                <label className="block text-sm text-muted-foreground mb-1">Nouveau mot de passe</label>
                <input
                    type="password"
                    {...register("newPassword", { required: "Champ requis", minLength: { value: 8, message: "8 caractères minimum" } })}
                    className="w-full bg-accent border border-border rounded px-3 py-2 text-foreground text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                />
                {errors.newPassword && (
                    <p className="text-destructive text-xs mt-1">{errors.newPassword.message}</p>
                )}
            </div>

            <div>
                <label className="block text-sm text-muted-foreground mb-1">Confirmer le nouveau mot de passe</label>
                <input
                    type="password"
                    {...register("confirmPassword", {
                        required: "Champ requis",
                        validate: (val) => val === watch("newPassword") || "Les mots de passe ne correspondent pas",
                    })}
                    className="w-full bg-accent border border-border rounded px-3 py-2 text-foreground text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                />
                {errors.confirmPassword && (
                    <p className="text-destructive text-xs mt-1">{errors.confirmPassword.message}</p>
                )}
            </div>

            {error && (
                <p className="text-destructive text-sm">{error.message}</p>
            )}

            <button
                type="submit"
                disabled={loading}
                className="bg-primary text-background px-4 py-2 rounded text-sm font-medium hover:opacity-90 disabled:opacity-50 transition-opacity"
            >
                {loading ? "Changement..." : "Changer le mot de passe"}
            </button>
        </form>
    );
}
