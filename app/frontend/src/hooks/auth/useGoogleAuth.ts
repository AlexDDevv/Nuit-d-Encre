import { ApolloError, useMutation } from "@apollo/client";
import { useGoogleLogin } from "@react-oauth/google";
import { useNavigate, useSearchParams } from "react-router-dom";
import { GOOGLE_AUTH, WHOAMI } from "@/graphql/user/auth";
import { useToast } from "@/hooks/toast/useToast";
import { GoogleAuthResponse, GoogleAuthVariables } from "@/types/types";

/**
 * Connexion via Google (flux OAuth auth-code). Encapsule l'échange du code
 * contre la session (mutation `googleAuth`), le refetch WHOAMI, la redirection
 * et les toasts. Retourne le déclencheur `login` et l'état `loading`.
 */
export function useGoogleAuth() {
    const [googleAuth, { loading }] = useMutation<
        GoogleAuthResponse,
        GoogleAuthVariables
    >(GOOGLE_AUTH, { refetchQueries: [WHOAMI] });

    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const { showToast } = useToast();

    const redirectUrl = searchParams.get("redirect") || "/books";

    const notifyFailure = () =>
        showToast({
            type: "error",
            title: "La connexion Google a échoué.",
            description: "Veuillez réessayer",
        });

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
                notifyFailure();
                if (!(err instanceof ApolloError)) {
                    console.error("Google auth error:", err);
                }
            }
        },
        onError: notifyFailure,
    });

    return { login, loading };
}
