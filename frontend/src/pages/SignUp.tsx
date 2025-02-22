import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { createUser } from "../api/createUser";
import { useMutation } from "@apollo/client";
import { useToast } from "../components/UI/Toaster/ToasterHook";
import clsx from "clsx";
import ActionButton from "../components/UI/ActionButton";

export default function SignUp() {
    const [email, setEmail] = useState("alex@gmail.com");
    const [password, setPassword] = useState("Supersecret!1");
    const [confirmPassword, setConfirmPassword] = useState("Supersecret!1");
    const [error, setError] = useState<boolean>(false);
    const { addToast } = useToast();
    const navigate = useNavigate();

    const [doCreateUser] = useMutation(createUser);

    const doSubmit = async () => {
        const requiredFields = [email, password, confirmPassword];

        const isFormValid = requiredFields.every(
            (field) =>
                field && (Array.isArray(field) ? field.length > 0 : true),
        );

        if (!isFormValid) {
            addToast(
                "Veuillez remplir tous les champs du formulaire.",
                "warning",
            );
            setError(true);
            return;
        }

        try {
            await doCreateUser({
                variables: {
                    data: {
                        email,
                        password,
                    },
                },
            });
            setError(false);
            addToast("Inscription réussie !", "success");
            navigate("/signin", { replace: true });
        } catch (e: any) {
            console.error(e.message);
            setError(true);
            if (
                e.message.includes(
                    "Password must be at least 10 characters long and include 1 number, 1 uppercase letter, and 1 symbol",
                )
            ) {
                addToast("Le mot de passe n'est pas assez fort", "warning");
            } else if (e.message.includes("Email must be an email")) {
                addToast("L'email est invalide", "warning");
            } else if (password !== confirmPassword) {
                addToast("Les mots de passe ne sont pas identiques", "error");
            } else {
                addToast(
                    "Un compte avec cette adresse email existe déjà",
                    "error",
                );
            }
        }
    };

    return (
        <>
            <section className="bg-card border-border mx-auto max-w-lg rounded-xl border px-6 py-5">
                <h1 className="text-card-foreground mb-7 text-center font-bold">
                    Créer un compte
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
                                    "bg-input text-accent-foreground focus:outline-ring rounded-lg p-3 text-xs placeholder:italic placeholder:opacity-85 focus:outline-2",
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
                                    "bg-input text-accent-foreground focus:outline-ring rounded-lg p-3 text-xs placeholder:italic placeholder:opacity-85 focus:outline-2",
                                    error &&
                                        "border-destructive outline-destructive border",
                                )}
                            />
                        </div>
                        <div className="flex flex-col gap-1">
                            <label
                                htmlFor="confirmPassword"
                                className="text-card-foreground text-sm"
                            >
                                Mot de passe
                            </label>
                            <input
                                id="confirmPassword"
                                type="password"
                                placeholder="Ajouter un mot de passe..."
                                value={confirmPassword}
                                onChange={(e) =>
                                    setConfirmPassword(e.target.value)
                                }
                                className={clsx(
                                    "bg-input text-accent-foreground focus:outline-ring rounded-lg p-3 text-xs placeholder:italic placeholder:opacity-85 focus:outline-2",
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
                        content="Inscription"
                    />
                </form>
            </section>
            <p className="text-foreground mt-7 text-center">
                Vous avez déjà un compte?{" "}
                <Link
                    to={"/signin"}
                    className="text-primary cursor-pointer font-semibold transition-opacity duration-200 ease-in-out hover:opacity-90"
                >
                    Connectez vous!
                </Link>
            </p>
        </>
    );
}
