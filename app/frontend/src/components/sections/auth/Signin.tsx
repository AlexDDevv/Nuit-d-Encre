import { useToast } from "@/hooks/useToast";
import { UserSignIn } from "@/types/types";
import { ApolloError } from "@apollo/client";
import { SubmitHandler, useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import FormButtonSubmit from "@/components/sections/auth/form/FormButtonSubmit";
import FormTitle from "@/components/sections/auth/form/FormTitle";
import FormWrapper from "@/components/UI/form/FormWrapper";
import InputEmail from "@/components/sections/auth/form/InputEmail";
import InputPassword from "@/components/sections/auth/form/InputPassword";
import { Checkbox } from "@/components/UI/Checkbox";
import { Label } from "@/components/UI/form/Label";
import ContinueWithGoogle from "@/components/UI/ContinueWithGoogle";
import { useAuth } from "@/hooks/useAuth";

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

    const { Login } = useAuth();
    const navigate = useNavigate();
    const { showToast } = useToast();

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
                navigate("/books");
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
        <div className="flex w-full flex-col items-center gap-10">
            <FormTitle isSignUp={false} />
            <FormWrapper onSubmit={handleSubmit(onSubmit)}>
                <InputEmail<UserSignIn> register={register} errors={errors} />
                <InputPassword<UserSignIn>
                    register={register}
                    errors={errors}
                />
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Checkbox />
                        <Label htmlFor="rememberMe">Se souvenir de moi</Label>
                    </div>
                    <p className="text-card-foreground text-sm font-medium">
                        Mot de passe oublié?
                    </p>
                </div>
                <FormButtonSubmit type="sign-in" />
                <ContinueWithGoogle />
            </FormWrapper>
        </div>
    );
}
