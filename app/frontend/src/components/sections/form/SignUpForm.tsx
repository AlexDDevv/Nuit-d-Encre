import { useState } from "react";
import { useToast } from "../UI/Toaster/ToasterHook";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@apollo/client";
import { createUser } from "../../graphql/createUser";
import clsx from "clsx";
import GoogleButton from "../UI/GoogleButton";
import { Button } from "../UI/Button";

export default function SignUpForm() {
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

        if (password !== confirmPassword) {
            addToast("Les mots de passe ne sont pas identiques", "error");
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
            } else {
                addToast(
                    "Un compte avec cette adresse email existe déjà",
                    "error",
                );
            }
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
            <div className="mb-7 flex w-full flex-col justify-center gap-5">
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
                            setEmail(e.target.value);
                            setError(false);
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
                <div className="flex flex-col gap-1">
                    <label
                        htmlFor="confirmPassword"
                        className="text-card-foreground mb-1 text-sm leading-none font-semibold peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                        Mot de passe
                    </label>
                    <input
                        id="confirmPassword"
                        type="password"
                        placeholder="Ajouter un mot de passe..."
                        value={confirmPassword}
                        onChange={(e) => {
                            setConfirmPassword(e.target.value);
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
            <Button
                type="submit"
                ariaLabel="S'inscrire à Nuit d'Encre"
                children="S'inscrire"
                fullWidth
            />
            <GoogleButton />
        </form>
    );
}
