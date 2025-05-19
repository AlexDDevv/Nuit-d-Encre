import { useState } from "react";
import { useToast } from "../UI/Toaster/ToasterHook";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@apollo/client";
import { signIn } from "../../api/signIn";
import { whoami } from "../../api/whoami";
import clsx from "clsx";
import GoogleButton from "../UI/GoogleButton";
import { Button } from "../UI/Button";

export default function SignInForm() {
    const [email, setEmail] = useState("alex@gmail.com");
    const [password, setPassword] = useState("Supersecret!1");
    const [error, setError] = useState<boolean>(false);
    const { addToast } = useToast();
    const navigate = useNavigate();

    const [doSignIn] = useMutation(signIn, { refetchQueries: [whoami] });

    const doSubmit = async () => {
        const requiredFields = [email, password];

        const isFormValid = requiredFields.every(
            (field) =>
                field && (Array.isArray(field) ? field.length > 0 : true),
        );

        if (!isFormValid) {
            addToast(
                "Veuillez indiquer votre adresse email et votre mot de passe.",
                "warning",
            );
            setError(true);
            return;
        }

        try {
            const { data } = await doSignIn({
                variables: {
                    email,
                    password,
                },
            });
            if (data.signIn) {
                setError(false);
                addToast("Connexion réussie, bienvenue !", "success");
                navigate(`/`, { replace: true });
            } else {
                addToast(
                    "Identification échouée, mauvaise adresse email ou mot de passe.",
                    "error",
                );
                setError(true);
            }
        } catch (e: any) {
            console.error(e);
            addToast("Impossible de vous connecter", "error");
            setError(true);
        }
    };
    return (
        <form
            className="flex flex-col gap-6"
            onSubmit={(e) => {
                e.preventDefault();
                doSubmit();
            }}
        >
            <div className="flex w-full flex-col justify-center gap-5">
                <div className="flex flex-col gap-1">
                    <label
                        htmlFor="email"
                        className="text-card-foreground mb-1 text-sm leading-none font-semibold peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                        Adresse email
                    </label>
                    <input
                        id="email"
                        type="text"
                        placeholder="Ajouter une adresse mail..."
                        value={email}
                        onChange={(e) => {
                            setEmail(e.target.value), setError(false);
                        }}
                        className={clsx(
                            "border-border bg-input ring-offset-input text-accent-foreground focus-visible:ring-ring flex h-10 w-full rounded-md border px-3 py-2 text-sm placeholder:italic placeholder:opacity-85 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50",
                            error &&
                                "border-destructive outline-destructive border",
                        )}
                    />
                </div>
                <div className="flex flex-col gap-1">
                    <label
                        htmlFor="password"
                        className="text-card-foreground mb-1 text-sm leading-none font-semibold peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                        Mot de passe
                    </label>
                    <input
                        id="password"
                        type="password"
                        placeholder="Ajouter un mot de passe..."
                        value={password}
                        onChange={(e) => {
                            setPassword(e.target.value);
                            setError(false);
                        }}
                        className={clsx(
                            "border-border bg-input ring-offset-input text-accent-foreground focus-visible:ring-ring flex h-10 w-full rounded-md border px-3 py-2 text-sm placeholder:italic placeholder:opacity-85 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50",
                            error &&
                                "border-destructive outline-destructive border",
                        )}
                    />
                </div>
            </div>
            <div className="text-center">
                <p className="text-card-foreground text-sm font-medium">
                    Mot de passe oublié?
                </p>
            </div>
            <Button
                type="submit"
                ariaLabel="Se connecter à Nuit d'Encre"
                children="Se connecter"
            />
            <GoogleButton />
        </form>
    );
}
