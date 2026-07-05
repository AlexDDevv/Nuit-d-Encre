import { FcGoogle } from "react-icons/fc";
import { useGoogleLogin } from "@react-oauth/google";
import { ApolloError, useMutation } from "@apollo/client";
import { useNavigate, useSearchParams } from "react-router-dom";
import ContinueWith from "@/components/UI/form/ContinueWith";
import Button from "@/components/UI/Button/Button";
import { GOOGLE_AUTH, WHOAMI } from "@/graphql/user/auth";
import { useToast } from "@/hooks/toast/useToast";

/** Séparateur orné « ou » + bouton « Continuer avec Google » (contour doré). */
export default function ContinueWithGoogle() {
    const [googleAuth, { loading }] = useMutation(GOOGLE_AUTH, {
        refetchQueries: [WHOAMI],
    });
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const { showToast } = useToast();

    const redirectUrl = searchParams.get("redirect") || "/books";

    const login = useGoogleLogin({
        flow: "auth-code",
        onSuccess: async ({ code }) => {
            try {
                const { data } = await googleAuth({ variables: { code } });

                if (data) {
                    navigate(redirectUrl);
                    showToast({
                        type: "success",
                        title: "Connexion réussie, bienvenue !",
                        description:
                            "Vous pouvez dès à présent créer votre bibliothèque !",
                    });
                }
            } catch (err) {
                showToast({
                    type: "error",
                    title: "La connexion Google a échoué.",
                    description: "Veuillez réessayer",
                });
                if (!(err instanceof ApolloError)) {
                    console.error("Google auth error:", err);
                }
            }
        },
        onError: () => {
            showToast({
                type: "error",
                title: "La connexion Google a échoué.",
                description: "Veuillez réessayer",
            });
        },
    });

    return (
        <>
            <ContinueWith />
            <Button
                type="button"
                variant="google"
                fullWidth
                disabled={loading}
                onClick={() => login()}
                ariaLabel="Continuer avec Google"
                leftIcon={
                    <span className="bg-foreground/95 grid h-5 w-5 place-items-center rounded-full">
                        <FcGoogle className="h-3 w-3" />
                    </span>
                }
            >
                Continuer avec Google
            </Button>
        </>
    );
}
