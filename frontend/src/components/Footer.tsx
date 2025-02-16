import { Link } from "react-router-dom";
import logo from "../assets/logo.svg";
import data from "../data/data.json";
import styled from "styled-components";
import { styledButton, ButtonProps } from "./StyledButton";
import { Copyright, Github, Twitter, Linkedin } from "lucide-react";

const FooterApp = styled.footer`
    background-color: var(--card);
    border: 1px solid var(--border);
    border-radius: 12px;
    display: flex;
    flex-direction: column;
    gap: 40px;
    padding: 24px;
`;

const FooterActions = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 20px;
`;

const StyledLogo = styled(Link)<ButtonProps>`
    ${styledButton}
    border: none;
    text-decoration: none;
`;

const FooterNav = styled.nav``;

const FooterList = styled.ul`
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 40px;
`;

const FooterLi = styled.li``;

const FooterLink = styled(Link)`
    color: var(--card-foreground);
    font-weight: 600;
    position: relative;

    &:hover {
        &::after {
            width: 100%;
        }
    }

    &::after {
        content: "";
        position: absolute;
        bottom: -5px;
        left: 0;
        height: 2px;
        width: 0;
        background-color: var(--card-foreground);
        transition: width 0.2s ease-in-out;
    }
`;

const StyledLink = styled(StyledLogo)`
    text-decoration: none;
`;

const Mine = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 48px;

    svg {
        height: 16px;
        width: 16px;
    }
`;

const MadeByMe = styled.div`
    color: var(--card-foreground);
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 12px;
`;

const SocialContainer = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 20px;
`;

const IconContainer = styled.div`
    border: 1px solid var(--card-foreground);
    border-radius: 4px;
    display: flex;
    align-items: center;
    justify-content: center;
    opacity: 0.5;
    padding: 8px;
    cursor: pointer;
    transition: opacity 0.2s ease-in-out;

    &:hover {
        opacity: 1;
    }

    svg {
        color: var(--card-foreground);
    }
`;

export default function Footer() {
    return (
        <FooterApp>
            <FooterActions>
                <StyledLogo
                    to="/"
                    background="transparent"
                    color="var(--primary)"
                    height="auto"
                    padding="0"
                >
                    <img src={logo} alt="The good corner" />
                </StyledLogo>
                <FooterNav>
                    <FooterList>
                        {data.footerLi.map((li) => (
                            <FooterLi key={li.content}>
                                <FooterLink to={li.link}>
                                    {li.content}
                                </FooterLink>
                            </FooterLi>
                        ))}
                    </FooterList>
                </FooterNav>
                <StyledLink
                    key="newAd"
                    to="ads/newAd"
                    transition="background-color 0.2s ease-in-out, color 0.2s ease-in-out"
                >
                    Publier une annonce
                </StyledLink>
            </FooterActions>
            <Mine>
                <MadeByMe>
                    <Copyright />
                    <p>2025 - Alexis Delporte</p>
                </MadeByMe>
                <SocialContainer>
                    <IconContainer>
                        <Github />
                    </IconContainer>
                    <IconContainer>
                        <Twitter />
                    </IconContainer>
                    <IconContainer>
                        <Linkedin />
                    </IconContainer>
                </SocialContainer>
            </Mine>
        </FooterApp>
    );
}
