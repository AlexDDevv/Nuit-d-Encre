import { Outlet } from "react-router-dom";
import Header from "./Header";
import styled from "styled-components";

const Main = styled.main`
    max-width: 832px;
    padding: 0 16px;
    margin: 150px auto 50px;
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
