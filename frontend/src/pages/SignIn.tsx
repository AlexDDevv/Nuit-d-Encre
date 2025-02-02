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
import { signIn } from "../api/signIn";
import { useMutation } from "@apollo/client";
import { whoami } from "../api/whoami";
import { useToast } from "../components/Toaster/ToasterHook";

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
            (field) => field && (Array.isArray(field) ? field.length > 0 : true)
        );

        if (!isFormValid) {
            addToast(
                "Veuillez indiquer votre adresse email et votre mot de passe.",
                "warning"
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
                    "error"
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
            <FormSection maxWidth="500px" margin="0 auto">
                <TitleForm marginBottom="30px">Se connecter</TitleForm>
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
                    </InputsContainer>
                    <Button type="submit">Connexion</Button>
                </Form>
            </FormSection>
            <AlreadyHaveAccount>
                Vous n'avez pas encore de compte?{" "}
                <Link to={"/signup"}>Inscrivez vous!</Link>
            </AlreadyHaveAccount>
        </>
    );
}
