import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { signIn } from "../api/signIn";
import { useMutation } from "@apollo/client";
import { whoami } from "../api/whoami";
import { useToast } from "../components/UI/Toaster/ToasterHook";
import clsx from "clsx";
import ActionButton from "../components/UI/ActionButton";

export default function SignIn() {
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
        <>
            <section className="bg-card border-border mx-auto max-w-lg rounded-xl border px-6 py-5">
                <h1 className="text-card-foreground mb-7 text-center font-bold">
                    Se connecter
                </h1>
                <form
                    className="flex flex-col gap-5"
                    onSubmit={(e) => {
                        e.preventDefault();
                        doSubmit();
                    }}
                >
                    <div className="mb-7 flex w-full flex-col justify-center gap-5">
                        <div className="flex flex-col gap-1">
                            <label
                                htmlFor="email"
                                className="text-card-foreground text-sm"
                            >
                                Adresse email
                            </label>
                            <input
                                id="email"
                                type="text"
                                placeholder="Ajouter une adresse mail..."
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className={clsx(
                                    "bg-input text-accent-foreground focus:outline-ring rounded-lg p-2.5 text-xs placeholder:italic placeholder:opacity-85 focus:outline-2",
                                    error &&
                                        "border-destructive outline-destructive border",
                                )}
                            />
                        </div>
                        <div className="flex flex-col gap-1">
                            <label
                                htmlFor="password"
                                className="text-card-foreground text-sm"
                            >
                                Mot de passe
                            </label>
                            <input
                                id="password"
                                type="password"
                                placeholder="Ajouter un mot de passe..."
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className={clsx(
                                    "bg-input text-accent-foreground focus:outline-ring rounded-lg p-2.5 text-xs placeholder:italic placeholder:opacity-85 focus:outline-2",
                                    error &&
                                        "border-destructive outline-destructive border",
                                )}
                            />
                        </div>
                    </div>
                    <ActionButton
                        type="submit"
                        bgColor="bg-primary"
                        color="text-primary-foreground"
                        content="Connexion"
                    />
                </form>
            </section>
            <p className="text-foreground mt-7 text-center">
                Vous n'avez pas encore de compte?{" "}
                <Link
                    to={"/signup"}
                    className="text-primary cursor-pointer font-semibold transition-opacity duration-200 ease-in-out hover:opacity-90"
                >
                    Inscrivez vous!
                </Link>
            </p>
        </>
    );
}
