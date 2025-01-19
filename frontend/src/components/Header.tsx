import NavBar from "./NavBar";
import Form from "./Form";
import { Link, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { styledButton, ButtonProps } from "./StyledButton";
import { useMutation, useQuery } from "@apollo/client";
import { whoami } from "../api/whoami";
import { signOut } from "../api/signout";

const HeaderApp = styled.header`
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    border-bottom: 1px solid var(--border);
    padding: 20px;
    background-color: var(--card);
    z-index: 500;
`;

const StyledLogo = styled(Link)<ButtonProps>`
    ${styledButton}
    border: none;
    text-decoration: none;
`;

const StyledLink = styled(StyledLogo)`
    ${styledButton}
    text-decoration: none;
`;

const SignOutButton = styled.button<ButtonProps>`
    ${styledButton}
`;

const ButtonsContainer = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 20px;
`;

const MainMenu = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 10px;
`;

const MobileLogo = styled.span`
    @media screen and (min-width: 720px) {
        display: none;
    }
`;

const DesktopLogo = styled.span`
    display: none;

    @media screen and (min-width: 720px) {
        display: initial;
    }
`;

export default function Header() {
    const { data: whoamiData } = useQuery(whoami);
    const me = whoamiData?.whoami;
    const navigate = useNavigate();

    const [doSignOut] = useMutation(signOut, { refetchQueries: [whoami] });

    const onSignOut = () => {
        doSignOut();
        navigate("/");
    };

    return (
        <HeaderApp id="header">
            <MainMenu>
                <h1>
                    <StyledLogo
                        to="/"
                        background="transparent"
                        color="var(--primary)"
                    >
                        <MobileLogo>TGC</MobileLogo>
                        <DesktopLogo>THE GOOD CORNER</DesktopLogo>
                    </StyledLogo>
                </h1>
                <Form />
                {me ? (
                    <ButtonsContainer>
                        <StyledLink
                            to="ads/newAd"
                            transition="background-color 0.2s ease-in-out,
                    color 0.2s ease-in-out"
                        >
                            <MobileLogo>Publier</MobileLogo>
                            <DesktopLogo>Publier une annonce</DesktopLogo>
                        </StyledLink>
                        <SignOutButton
                            onClick={onSignOut}
                            background="var(--destructive)"
                            color="var(--destructive-foreground)"
                        >
                            Déconnexion
                        </SignOutButton>
                    </ButtonsContainer>
                ) : me === null ? (
                    <ButtonsContainer>
                        <StyledLink to="/signup">Inscription</StyledLink>
                        <StyledLink to="/signin">Connexion</StyledLink>
                    </ButtonsContainer>
                ) : null}
            </MainMenu>
            <NavBar />
        </HeaderApp>
    );
}
