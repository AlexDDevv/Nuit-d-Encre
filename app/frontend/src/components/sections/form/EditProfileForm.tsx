import { useForm } from "react-hook-form";
import { useMutation } from "@apollo/client";
import { UPDATE_PROFILE } from "@/graphql/user/profile";
import { WHOAMI } from "@/graphql/user/auth";
import { User } from "@/types/types";

interface EditProfileFormProps {
    user: User;
    onSuccess?: () => void;
}

type FormData = {
    userName: string;
    bio: string;
};

export default function EditProfileForm({ user, onSuccess }: EditProfileFormProps) {
    const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
        defaultValues: { userName: user.userName, bio: user.bio ?? "" },
    });

    const [updateProfile, { loading, error }] = useMutation(UPDATE_PROFILE, {
        refetchQueries: [{ query: WHOAMI }],
        onCompleted: () => onSuccess?.(),
    });

    const onSubmit = (data: FormData) => {
        updateProfile({ variables: { data } });
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
                <label className="block text-sm text-muted-foreground mb-1">Nom d'utilisateur</label>
                <input
                    {...register("userName", { required: "Champ requis", minLength: { value: 2, message: "2 caractères minimum" }, maxLength: { value: 100, message: "100 caractères maximum" } })}
                    className="w-full bg-accent border border-border rounded px-3 py-2 text-foreground text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                />
                {errors.userName && (
                    <p className="text-destructive text-xs mt-1">{errors.userName.message}</p>
                )}
            </div>

            <div>
                <label className="block text-sm text-muted-foreground mb-1">Bio</label>
                <textarea
                    {...register("bio", { maxLength: { value: 300, message: "300 caractères maximum" } })}
                    rows={3}
                    className="w-full bg-accent border border-border rounded px-3 py-2 text-foreground text-sm resize-none focus:outline-none focus:ring-1 focus:ring-primary"
                />
                {errors.bio && (
                    <p className="text-destructive text-xs mt-1">{errors.bio.message}</p>
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
                {loading ? "Sauvegarde..." : "Sauvegarder"}
            </button>
        </form>
    );
}
