import styled from "styled-components";

export const AdminPanelContainer = styled.div`
    width: 100%;
`;

export const PanelContainer = styled.div`
    display: flex;
    flex-direction: column;
    gap: 30px;
`;

export const TabsContainer = styled.div`
    border: 1px solid var(--border);
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
    max-width: 480px;
`;

export const Tab = styled.div<{ background: string }>`
    background-color: ${props => props.background || "var(--card)"};
    width: 160px;
    padding: 15px 0 15px 25px;
    cursor: pointer;
    transition: background-color 0.2s ease-in-out;

    &:hover {
        background-color: var(--border);
    }

    &:nth-child(2) {
        border-left: 1px solid var(--border);
        border-right: 1px solid var(--border);
    }
`;

export const TabName = styled.h4`
    color: var(--card-foreground);
    font-size: 16px;
    font-weight: 700;
`;

export const ManageContainer = styled.div`
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 50px;
`;

export const ContentToManage = styled.div`
    display: flex;
    flex-direction: column;
    gap: 20px;
`;

export const Content = styled.div`
    background-color: var(--card);
    border: 1px solid var(--border);
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 20px;
    padding: 15px;
    width: 600px;
    transition: border-color 0.2s ease-in-out;

    &:hover {
        border-color: var(--card-foreground);
    }
`;

export const Infos = styled.div``;

export const Title = styled(TabName).attrs({ as: "h5" })`
    font-weight: 500;
    margin-bottom: 5px;
`;

export const Owner = styled(TabName).attrs({ as: "h6" })`
    font-weight: 400;
`;

export const ActionsIcons = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 15px;

    svg {
        color: var(--card-foreground);
        height: 20px;
        width: 20px;
        cursor: pointer;
        transition: color 0.2s ease-in-out, transform 0.2s ease-in-out;

        &:hover {
            color: var(--primary);
            transform: scale(1.1);
        }
    }
`;

export const AdsContainer = styled.div`
    display: flex;
    align-items: flex-start;
    justify-content: center;
    gap: 20px;
`;

export const NoAd = styled.p`
    color: var(--foreground);
    font-weight: 500;
`;

export const Form = styled.form`
    background-color: var(--card);
    border-radius: 8px;
    display: flex;
    flex-direction: column;
    gap: 20px;
    padding: 20px;
    width: 300px;
`;

export const FormTitle = styled(TabName).attrs({ as: "h6" })``;
