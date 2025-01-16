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
import { signIn } from "../api/signIn";
import { useMutation } from "@apollo/client";
import { whoami } from "../api/whoami";

export default function SignIn() {
    const [email, setEmail] = useState("alex@gmail.com");
    const [password, setPassword] = useState("Supersecret!1");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const [doSignIn] = useMutation(signIn, { refetchQueries: [whoami] });

    const doSubmit = async () => {
        try {
            const { data } = await doSignIn({
                variables: {
                    email,
                    password,
                },
            });
            if (data.signIn) {
                navigate(`/`, { replace: true });
            } else {
                setError("Impossible de vous connecter");
            }
        } catch (e: any) {
            console.error(e);
            setError("Identification échouée");
        }
    };

    return (
        <>
            <FormSection maxWidth="500px" margin="0 auto">
                <TtitleForm marginBottom="30px">Se connecter</TtitleForm>
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
                    </InputsContainer>
                    <Button type="submit">Connexion</Button>
                </Form>
            </FormSection>
            <AlreadyHaveAccount>
                Vous n'avez pas encore de compte?{" "}
                <Link to={"/signup"}>Inscrivez vous!</Link>
            </AlreadyHaveAccount>
            {error && <ErrorForm error={error} />}
        </>
    );
}
