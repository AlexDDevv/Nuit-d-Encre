import NavBar from "./NavBar";
import Form from "./Form";
import { Link, useNavigate, useLocation } from "react-router-dom";
import logo from "../assets/logo.svg";
import styled from "styled-components";
import { styledButton, ButtonProps } from "./StyledButton";
import { useMutation, useQuery } from "@apollo/client";
import { whoami } from "../api/whoami";
import { signOut } from "../api/signout";

const HeaderApp = styled.header`
    background-color: var(--card);
    border: 1px solid var(--border);
    border-radius: 12px;
    display: flex;
    flex-direction: column;
    gap: 24px;
    padding: 24px;
`;

const StyledLogo = styled(Link)<ButtonProps>`
    ${styledButton}
    border: none;
    text-decoration: none;
`;

const StyledLink = styled(StyledLogo)`
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
    gap: 20px;
`;

export default function Header() {
    const { data: whoamiData } = useQuery(whoami);
    const me = whoamiData?.whoami;
    const navigate = useNavigate();
    const location = useLocation();

    const [doSignOut] = useMutation(signOut, { refetchQueries: [whoami] });

    const onSignOut = () => {
        doSignOut();
        navigate("/");
    };

    const renderButtons = () => {
        if (!me) {
            return (
                <ButtonsContainer>
                    <StyledLink to="/signup">Inscription</StyledLink>
                    <StyledLink to="/signin">Connexion</StyledLink>
                </ButtonsContainer>
            );
        }

        const commonButtons = [
            <StyledLink
                key="newAd"
                to="ads/newAd"
                transition="background-color 0.2s ease-in-out, color 0.2s ease-in-out"
            >
                Publier une annonce
            </StyledLink>,
        ];

        const signOutButton = (
            <SignOutButton
                key="signOut"
                onClick={onSignOut}
                background="var(--destructive)"
                color="var(--destructive-foreground)"
            >
                Se déconnecter
            </SignOutButton>
        );

        if (me.role === "admin") {
            if (location.pathname === "/admin") {
                return (
                    <ButtonsContainer>
                        {commonButtons}
                        {signOutButton}
                    </ButtonsContainer>
                );
            }
            return (
                <ButtonsContainer>
                    {commonButtons}
                    <StyledLink
                        to="/admin"
                        background="var(--secondary)"
                        color="var(--secondary-foreground)"
                    >
                        Admin
                    </StyledLink>
                </ButtonsContainer>
            );
        }

        if (location.pathname === "/profil") {
            return (
                <ButtonsContainer>
                    {commonButtons}
                    {signOutButton}
                </ButtonsContainer>
            );
        }

        return (
            <ButtonsContainer>
                {commonButtons}
                <StyledLink
                    to="/profil"
                    background="var(--secondary)"
                    color="var(--secondary-foreground)"
                >
                    Profil
                </StyledLink>
            </ButtonsContainer>
        );
    };

    return (
        <HeaderApp id="header">
            <MainMenu>
                <StyledLogo
                    to="/"
                    background="transparent"
                    color="var(--primary)"
                    height="auto"
                    padding="0"
                >
                    <img src={logo} alt="The good corner" />
                </StyledLogo>
                <Form />
                {renderButtons()}
            </MainMenu>
            <NavBar />
        </HeaderApp>
    );
}
