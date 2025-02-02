import { useState } from "react";
import {
    FormSection,
    TitleForm,
    Form,
    InputsContainer,
    InputContainer,
    Label,
    Input,
    AlreadyHaveAccount,
} from "../components/styled/Form.styles";
import { Button } from "../components/StyledButton";
import { Link, useNavigate } from "react-router-dom";
import { createUser } from "../api/createUser";
import { useMutation } from "@apollo/client";
import { useToast } from "../components/Toaster/ToasterHook";

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
            (field) => field && (Array.isArray(field) ? field.length > 0 : true)
        );

        if (!isFormValid) {
            addToast(
                "Veuillez remplir tous les champs du formulaire.",
                "warning"
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
                    "Password must be at least 10 characters long and include 1 number, 1 uppercase letter, and 1 symbol"
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
                    "error"
                );
            }
        }
    };

    return (
        <>
            <FormSection maxWidth="500px" margin="0 auto">
                <TitleForm marginBottom="30px">Créer un compte</TitleForm>
                <Form
                    display="flex"
                    direction="column"
                    gap="20px"
                    onSubmit={(e) => {
                        e.preventDefault();
                        doSubmit();
                    }}
                >
                    <InputsContainer marginBottom="30px">
                        <InputContainer>
                            <Label htmlFor="email">Adresse email</Label>
                            <Input
                                id="email"
                                type="text"
                                placeholder="Ajouter une adresse mail..."
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                error={error}
                            />
                        </InputContainer>
                        <InputContainer>
                            <Label htmlFor="password">Mot de passe</Label>
                            <Input
                                id="password"
                                type="password"
                                placeholder="Ajouter un mot de passe..."
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                error={error}
                            />
                        </InputContainer>
                        <InputContainer>
                            <Label htmlFor="confirmPassword">
                                Mot de passe
                            </Label>
                            <Input
                                id="confirmPassword"
                                type="password"
                                placeholder="Ajouter un mot de passe..."
                                value={confirmPassword}
                                onChange={(e) =>
                                    setConfirmPassword(e.target.value)
                                }
                                error={error}
                            />
                        </InputContainer>
                    </InputsContainer>
                    <Button type="submit">Inscription</Button>
                </Form>
            </FormSection>
            <AlreadyHaveAccount>
                Vous avez déjà un compte?{" "}
                <Link to={"/signin"}>Connectez vous!</Link>
            </AlreadyHaveAccount>
        </>
    );
}
