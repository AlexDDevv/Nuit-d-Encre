import { useToast } from "@/hooks/toast/useToast";
import { UserSignUpForm } from "@/types/types";
import { ApolloError, useMutation } from "@apollo/client";
import { SubmitHandler, useForm } from "react-hook-form";
import { Link, useSearchParams } from "react-router-dom";
import { LuArrowRight } from "react-icons/lu";
import InputUserName from "@/components/sections/auth/form/InputUserName";
import InputEmail from "@/components/sections/auth/form/InputEmail";
import InputPassword from "@/components/sections/auth/form/InputPassword";
import InputConfirmPassword from "@/components/sections/auth/form/InputConfirmPassword";
import PasswordStrengthMeter from "@/components/sections/auth/PasswordStrengthMeter";
import AuthShell from "@/components/sections/auth/AuthShell";
import AuthCardHeader from "@/components/sections/auth/AuthCardHeader";
import Button from "@/components/UI/Button/Button";
import ContinueWithGoogle from "@/components/UI/form/ContinueWithGoogle";
import { REGISTER, WHOAMI } from "@/graphql/user/auth";

export default function Signup() {
    const {
        register,
        handleSubmit,
        reset,
        watch,
        getValues,
        formState: { errors },
    } = useForm<UserSignUpForm>({
        mode: "onBlur",
        defaultValues: {
            userName: "",
            email: "",
            password: "",
            confirmPassword: "",
        },
    });

    const [Register] = useMutation(REGISTER, {
        refetchQueries: [WHOAMI],
    });

    const [searchParams] = useSearchParams();
    const { showToast } = useToast();

    // Get the redirect URL from query params to pass it to the login page
    const redirectUrl = searchParams.get("redirect");
    const loginHref = redirectUrl
        ? `/connexion?redirect=${encodeURIComponent(redirectUrl)}`
        : "/connexion";

    const onSubmit: SubmitHandler<UserSignUpForm> = async (formData) => {
        try {
            const { data } = await Register({
                variables: {
                    data: {
                        email: formData.email,
                        password: formData.password,
                        userName: formData.userName,
                    },
                },
            });

            if (data) {
                reset();
                showToast({
                    type: "success",
                    title: "Inscription réussie !",
                    description: "Bienvenue dans Nuit d'Encre",
                    actionLabel: "Me connecter",
                    redirectTo: loginHref,
                });
            }
        } catch (err) {
            console.error("Erreur complète :", err);

            // Handle GraphQL errors : invalid formats, email already used...
            if (err instanceof ApolloError) {
                const emailError = err.graphQLErrors.find((e) =>
                    e.message.includes("Email already exists"),
                );

                if (emailError) {
                    showToast({
                        type: "warning",
                        title: "Cette e-mail est déjà utilisée !",
                        description: "Choisissez une autre adresse e-mail.",
                    });
                    return;
                }
            }

            // Handle others errors
            console.error("Error:", err);
            showToast({
                type: "error",
                title: "Oops, nous avons rencontré un problème pour créer votre compte.",
                description: "Réessayer ultérieurement.",
            });
        }
    };

    const password = watch("password");

    return (
        <AuthShell mode="inscription" onSubmit={handleSubmit(onSubmit)}>
            <AuthCardHeader
                welcome="Faites-vous une place au coin du feu."
                eyebrow="Inscription"
            />

            {/* Champs */}
            <div className="mt-6 flex flex-col gap-4">
                <InputUserName<UserSignUpForm>
                    register={register}
                    errors={errors}
                />
                <InputEmail<UserSignUpForm>
                    register={register}
                    errors={errors}
                />

                <div className="flex flex-col gap-2.5">
                    <InputPassword<UserSignUpForm>
                        register={register}
                        errors={errors}
                        strong
                    />
                    <PasswordStrengthMeter value={password} />
                </div>

                <InputConfirmPassword
                    register={register}
                    errors={errors}
                    getValues={getValues}
                />

                <div className="mt-1">
                    <Button
                        type="submit"
                        variant="primary"
                        fullWidth
                        ariaLabel="Créer un compte Nuit d'Encre"
                        rightIcon={<LuArrowRight size={16} />}
                    >
                        Créer mon compte
                    </Button>
                </div>
            </div>

            {/* Séparateur orné « ou » + bouton Google */}
            <ContinueWithGoogle />

            {/* Mentions légales + navigation vers la page de connexion */}
            <div className="mt-6 flex flex-col items-center gap-2.5 text-center">
                <p className="font-quote text-muted-foreground/70 text-pretty text-sm italic leading-relaxed">
                    En créant un compte, vous acceptez les conditions exposées
                    dans nos{" "}
                    <Link
                        to="/terms-of-use"
                        className="text-primary decoration-primary/40 focus-visible:ring-primary/70 rounded-sm font-medium not-italic underline underline-offset-[3px] transition-colors hover:text-[hsl(43_70%_88%)] hover:decoration-[hsl(43_59%_81%)] focus:outline-none focus-visible:ring-2"
                    >
                        mentions légales
                    </Link>
                    .
                </p>
                <p className="font-quote text-muted-foreground/75 text-sm italic leading-relaxed">
                    Déjà une carte d'accès ?{" "}
                    <Link
                        to={loginHref}
                        className="text-primary decoration-primary/40 focus-visible:ring-primary/70 rounded-sm font-medium not-italic underline underline-offset-[3px] transition-colors hover:text-[hsl(43_70%_88%)] hover:decoration-[hsl(43_59%_81%)] focus:outline-none focus-visible:ring-2"
                    >
                        Se connecter
                    </Link>
                    .
                </p>
            </div>
        </AuthShell>
    );
}
