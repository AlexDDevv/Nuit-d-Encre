import styled from "styled-components";

export const ContainerSelectedAd = styled.div`
    padding-top: 50px;
`;

export const ImgAndSeller = styled.div`
    display: flex;
    justify-content: center;
    gap: 20px;
    margin-bottom: 50px;
`;

export const AdInformations = styled.div`
    display: flex;
    flex-direction: column;
    gap: 15px;
`;

export const ImageContainer = styled.div`
    border-radius: 10px;
    display: flex;
    max-width: 450px;
    overflow: hidden;

    img {
        width: 100%;
    }
`;

export const InformationsContainer = styled.div`
    display: flex;
    flex-direction: column;
    gap: 15px;

    h1 {
        font-size: 24px;
    }
`;

export const PriceContainer = styled.div`
    display: flex;
    align-items: center;
    gap: 10px;

    h2 {
        font-size: 18px;
    }
`;

export const SpanDelivery = styled.span`
    font-size: 12px;
    font-weight: 600;
    color: #152233;
    background-color: #e6f2fd;
    border-radius: 15px;
    padding: 2px 10px 2px 10px;
`;

export const WithoutCharge = styled.div`
    display: flex;
    gap: 5px;

    p {
        font-size: 14px;
    }
    span {
        font-weight: 600;
    }
`;

export const Triple = styled.div`
    background-color: #84b92b;
    border-radius: 999px;
    display: flex;
    align-items: center;
    justify-content: center;
    height: 22px;
    width: 22px;

    span {
        color: white;
        font-size: 12px;
        font-weight: 700;
    }
`;

export const AdDate = styled.p`
    color: #838a92;
    font-size: 12px;
`;

export const ActionsContainer = styled.div`
    border-radius: 10px;
    border: 1px solid #4f6076;
    padding: 20px 15px;
    height: 100%;
    min-width: 350px;
`;

export const SellerContainer = styled.div`
    border-bottom: 1px solid #4f6076;
    margin-bottom: 20px;
    padding-bottom: 20px;
`;

export const Seller = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 20px;
    margin-bottom: 30px;

    svg {
        color: #4f6076;
        cursor: pointer;
    }
`;

export const AvatarContainer = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;

    a {
        color: black;
        text-decoration: none;
    }
`;

export const Avatar = styled.div`
    width: 65px;
    height: 65px;
    background-color: #f1f1f1;
    border-radius: 999px;
    border: 1px solid #4f6076;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;

    svg {
        color: #4f6076;
        height: 20px;
        width: 20px;
    }
`;

export const TimeResponse = styled.div`
    display: flex;
    align-items: center;
    color: #4f6076;
    gap: 5px;

    svg {
        height: 16px;
        width: 16px;
    }
    p {
        font-size: 14px;
        line-height: 15px;
    }
`;

export const UserActions = styled.div`
    text-align: center;
`;

export const BtnsContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 5px;
    margin-bottom: 20px;
`;

type ButtonProps = {
    bgColor: string;
    width?: string;
    radius?: string;
    size?: string;
    weight?: string;
    padding?: string;
};

export const Button = styled.button<ButtonProps>`
    background-color: ${(props) => props.bgColor || ""};
    border: none;
    border-radius: ${(props) => props.radius || "15px"};
    color: white;
    font-size: ${(props) => props.size || "16px"};
    font-weight: ${(props) => props.weight || "700"};
    width: ${(props) => props.width || "100%"};
    padding: ${(props) => props.padding || "12px 0"};
    cursor: pointer;
    transition: opacity 0.2s ease-in-out;

    &:hover {
        opacity: 0.8;
    }
`;

export const Paiement = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 5px;

    svg {
        height: 20px;
        width: 20px;
    }
    p {
        line-height: 15px;
    }
`;

export const MoreInformations = styled.div`
    display: flex;
    flex-direction: column;
    gap: 20px;

    h3 {
        margin-bottom: 5px;
    }
`;

export const UserBtnsContainer = styled.div`
    display: flex;
    align-items: center;
    gap: 20px;
`;
