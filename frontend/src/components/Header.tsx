import NavBar from "./NavBar";
import Form from "./Form";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { styledButton, ButtonProps } from "./StyledButton";

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
    return (
        <HeaderApp id="header">
            <MainMenu>
                <h1>
                    <StyledLogo to="/">
                        <MobileLogo>TGC</MobileLogo>
                        <DesktopLogo>THE GOOD CORNER</DesktopLogo>
                    </StyledLogo>
                </h1>
                <Form />
                <StyledLink
                    to="ads/newAd"
                    transition="background-color 0.2s ease-in-out,
                    color 0.2s ease-in-out"
                >
                    <MobileLogo>Publier</MobileLogo>
                    <DesktopLogo>Publier une annonce</DesktopLogo>
                </StyledLink>
            </MainMenu>
            <NavBar />
        </HeaderApp>
    );
}
