import { Outlet } from "react-router-dom";
import Header from "./Header";
import styled from "styled-components";

const Main = styled.main`
    max-width: 1024px;
    padding: 0 25px;
    margin: 175px auto 25px auto;
    position: relative;
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
