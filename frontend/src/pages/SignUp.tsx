import { useState } from "react";
import {
    FormSection,
    TtitleForm,
    Form,
    InputsContainer,
    InputContainer,
    Label,
    Input,
    AlreadyHaveAccount,
} from "../components/styled/Form.styles";
import { Button } from "../components/StyledButton";
import ErrorForm from "../components/ErrorForm";
import { Link, useNavigate } from "react-router-dom";
import { createUser } from "../api/createUser";
import { useMutation } from "@apollo/client";

export default function SignUp() {
    const [email, setEmail] = useState("alex@gmail.com");
    const [password, setPassword] = useState("Supersecret!1");
    const [confirmPassword, setConfirmPassword] = useState("Supersecret!1");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const [doCreateUser] = useMutation(createUser);

    const doSubmit = async () => {
        try {
            await doCreateUser({
                variables: {
                    data: {
                        email,
                        password,
                    },
                },
            });

            navigate("/signin", { replace: true });
        } catch (e: any) {
            console.error(e.message);
            if (
                e.message.includes(
                    "Password must be at least 10 characters long and include 1 number, 1 uppercase letter, and 1 symbol"
                )
            ) {
                setError("Le mot de passe n'est pas assez fort");
            } else if (e.message.includes("email must be an email")) {
                setError("L'email est invalide");
            } else if (password !== confirmPassword) {
                setError("Les mots de passe ne sont pas identiques");
            } else {
                setError("Un compte avec cette adresse email existe déjà");
            }
        }
    };

    return (
        <>
            <FormSection maxWidth="500px" margin="0 auto">
                <TtitleForm marginBottom="30px">Créer un compte</TtitleForm>
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
            {error && <ErrorForm error={error} />}
        </>
    );
}
