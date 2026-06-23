import { useToast } from "@/hooks/toast/useToast";
import { UserSignIn } from "@/types/types";
import { ApolloError, useMutation } from "@apollo/client";
import { SubmitHandler, useForm } from "react-hook-form";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { LuArrowRight, LuLock, LuMail } from "react-icons/lu";
import TextField from "@/components/sections/shared/fields/TextField";
import AuthShell from "@/components/sections/auth/AuthShell";
import AuthCardHeader from "@/components/sections/auth/AuthCardHeader";
import Button from "@/components/UI/Button/Button";
import { Checkbox } from "@/components/UI/Checkbox";
import { Label } from "@/components/UI/form/Label";
import ContinueWithGoogle from "@/components/UI/form/ContinueWithGoogle";
import { LOGIN, WHOAMI } from "@/graphql/user/auth";

export default function Signin() {
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<UserSignIn>({
        mode: "onBlur",
        defaultValues: {
            email: "admin@example.com",
            password: "SuperPassword!2025",
        },
    });

    const [Login] = useMutation(LOGIN, {
        refetchQueries: [WHOAMI],
    });

    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const { showToast } = useToast();

    // Get the redirect URL from query params, default to "/books"
    const redirectUrl = searchParams.get("redirect") || "/books";

    const onSubmit: SubmitHandler<UserSignIn> = async (formData) => {
        try {
            const { data } = await Login({
                variables: {
                    data: {
                        email: formData.email,
                        password: formData.password,
                    },
                },
            });

            // If registration ok, navigate to surveys page and toastify
            if (data) {
                reset();
                navigate(redirectUrl);
                showToast({
                    type: "success",
                    title: "Connexion réussie, bienvenue !",
                    description:
                        "Vous pouvez dès à présent créer votre bibliothèque !",
                });
            }
        } catch (err) {
            // Handle ApolloError
            if (err instanceof ApolloError) {
                const invalidCredentialsError = err.graphQLErrors.find((e) =>
                    e.message.includes("Login failed"),
                );

                showToast({
                    type: "error",
                    title: invalidCredentialsError
                        ? "Identifiants incorrects"
                        : "La connexion a échoué",
                    description: invalidCredentialsError
                        ? "L'email et/ou le mot de passe est incorrect."
                        : "Veuillez réessayer",
                });
                return;
            }
            // Handle other errors
            showToast({
                type: "error",
                title: "La connexion a échoué.",
                description: "Veuillez réessayer",
            });
            console.error("Error:", err);
        }
    };

    return (
        <AuthShell mode="connexion" onSubmit={handleSubmit(onSubmit)}>
            <AuthCardHeader
                welcome="La bibliothèque ne dort jamais - entrez."
                eyebrow="Connexion"
            />

            {/* Champs */}
            <div className="mt-6 flex flex-col gap-4">
                <TextField<UserSignIn>
                    name="email"
                    label="Email"
                    type="email"
                    inputMode="email"
                    icon={LuMail}
                    required
                    placeholder="vous@exemple.fr"
                    register={register}
                    errors={errors}
                    rules={{
                        required: "L'email est requis",
                        pattern: {
                            value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                            message: "Format d'email invalide",
                        },
                    }}
                />
                <TextField<UserSignIn>
                    name="password"
                    label="Mot de passe"
                    type="password"
                    icon={LuLock}
                    required
                    placeholder="••••••••"
                    register={register}
                    errors={errors}
                    rules={{
                        required: "Le mot de passe est requis",
                        minLength: {
                            value: 8,
                            message: "Doit contenir au moins 8 caractères",
                        },
                    }}
                />

                {/* Se souvenir de moi + mot de passe oublié */}
                <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2.5">
                    <div className="flex items-center gap-2.5">
                        <Checkbox defaultChecked />
                        <Label
                            htmlFor="rememberMe"
                            className="text-muted-foreground cursor-pointer text-sm font-normal"
                        >
                            Se souvenir de moi
                        </Label>
                    </div>
                    <Button
                        type="button"
                        variant="ghost"
                        ariaLabel="Réinitialiser le mot de passe"
                        className="decoration-primary/30 hover:decoration-primary h-auto px-0 text-sm font-medium underline underline-offset-[3px]"
                    >
                        Mot de passe oublié ?
                    </Button>
                </div>

                <div className="mt-1">
                    <Button
                        type="submit"
                        variant="primary"
                        fullWidth
                        ariaLabel="Se connecter à Nuit d'Encre"
                        rightIcon={<LuArrowRight size={16} />}
                    >
                        Se connecter
                    </Button>
                </div>
            </div>

            {/* Séparateur orné « ou » + bouton Google */}
            <ContinueWithGoogle />

            {/* Navigation vers la page d'inscription */}
            <div className="mt-6 flex flex-col items-center gap-2.5 text-center">
                <p className="font-quote text-muted-foreground/75 text-sm italic leading-relaxed">
                    Première veillée parmi nous ?{" "}
                    <Link
                        to="/register"
                        className="text-primary decoration-primary/40 focus-visible:ring-primary/70 rounded-sm font-medium not-italic underline underline-offset-[3px] transition-colors hover:text-[hsl(43_70%_88%)] hover:decoration-[hsl(43_59%_81%)] focus:outline-none focus-visible:ring-2"
                    >
                        Créer une carte d'accès
                    </Link>
                    .
                </p>
            </div>
        </AuthShell>
    );
}
