import { useState } from "react";
import { X, TriangleAlert } from "lucide-react";
import styled from "styled-components";

const ErrorContainer = styled.div`
    background-color: var(--destructive);
    border-radius: 6px;
    position: absolute;
    top: -10px;
    right: 50px;
    box-shadow: 0 5px 10px rgb(0, 0, 0, 0.1);
`;

const ErrorContent = styled.div`
    position: relative;
    padding: 30px;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;

    svg {
        color: var(--destructive-foreground);
    }
`;

const CloseToaster = styled(X)`
    color: var(--destructive-foreground);
    position: absolute;
    top: 10px;
    right: 10px;
    height: 16px;
    width: 16px;
    cursor: pointer;
`;

const Error = styled.p`
    color: var(--destructive-foreground);
    font-weight: 500;
`;

export default function ErrorForm({ error }: { error: string }) {
    const [closeToast, setCloseToast] = useState(false);

    const handleCloseToast = () => {
        setCloseToast(true);
    };

    return (
        !closeToast && (
            <ErrorContainer>
                <ErrorContent>
                    <CloseToaster onClick={handleCloseToast} />
                    <TriangleAlert />
                    <Error>{error}</Error>
                </ErrorContent>
            </ErrorContainer>
        )
    );
}
