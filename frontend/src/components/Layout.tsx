import { Outlet } from "react-router-dom";
import Header from "./Header";
import styled from "styled-components";

const Main = styled.main`
    max-width: 1440px;
    margin: 175px auto 25px auto;
    padding: 0 25px;
`;

export default function Layout() {
    return (
        <>
            <Header />
            <Main>
                <Outlet />
            </Main>
        </>
    );
}
