import { useToast } from "@/hooks/useToast";
import { UserSignUp } from "@/types/types";
import { ApolloError } from "@apollo/client";
import { SubmitHandler, useForm } from "react-hook-form";
import FormButtonSubmit from "@/components/sections/auth/form/FormButtonSubmit";
import FormTitle from "@/components/sections/auth/form/FormTitle";
import FormWrapper from "@/components/UI/form/FormWrapper";
import InputEmail from "@/components/sections/auth/form/InputEmail";
import InputUserName from "@/components/sections/auth/form/InputUserName";
import InputPassword from "@/components/sections/auth/form/InputPassword";
import ContinueWithGoogle from "@/components/UI/ContinueWithGoogle";
import { useAuth } from "@/hooks/useAuth";

export default function Signup() {
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<UserSignUp>({
        mode: "onBlur",
        defaultValues: {
            userName: "",
            email: "",
            password: "",
        },
    });

    const { Register } = useAuth();
    const { showToast } = useToast();

    const onSubmit: SubmitHandler<UserSignUp> = async (formData) => {
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
                    redirectTo: "/connexion",
                });
            }
        } catch (err) {
            console.error("Erreur complète :", err);

            // Handle GraphQL errors : invalid formats, email already used...
            if (err instanceof ApolloError) {
                console.log("err.graphQLErrors", err.graphQLErrors);
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

    return (
        <div className="flex w-full flex-col items-center gap-10">
            <FormTitle isSignUp />
            <FormWrapper onSubmit={handleSubmit(onSubmit)}>
                <InputUserName register={register} errors={errors} />
                <InputEmail<UserSignUp> register={register} errors={errors} />
                <InputPassword<UserSignUp>
                    register={register}
                    errors={errors}
                />
                <FormButtonSubmit type="sign-up" />
                <ContinueWithGoogle />
            </FormWrapper>
        </div>
    );
}
