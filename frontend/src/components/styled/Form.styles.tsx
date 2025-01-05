import styled from "styled-components";

export const FormSection = styled.div`
    background-color: var(--card);
    border: 1px solid var(--border);
    border-radius: 10px;
    padding: 20px 25px;
`;

export const TtitleForm = styled.h1`
    color: var(--card-foreground);
    margin-bottom: 50px;
    text-align: center;
`;

export const Form = styled.form``;

export const InputsContainer = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    gap: 20px;
    width: 100%;
    margin-bottom: 40px;
`;

export const InputContainer = styled.div`
    display: flex;
    flex-direction: column;
    gap: 5px;
`;

export const Label = styled.label`
    color: var(--card-foreground);
    font-size: 14px;
`;

export const Input = styled.input`
    background-color: var(--input);
    border: none;
    border-radius: 8px;
    color: var(--accent-foreground);
    padding: 10px;
    font-size: 12px;

    &::placeholder {
        opacity: 0.85;
        font-style: italic;
    }

    &:focus {
        outline: 2px solid var(--ring);
    }
`;

export const InputFileContainer = styled.div`
    position: relative;
    background-color: var(--input);
    border-radius: 8px;
    width: 100%;
    height: 350px;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
    cursor: pointer;
    z-index: 150;

    &:focus {
        outline: 2px solid var(--ring);
    }
`;

export const InputFile = styled(Input)`
    height: 100%;
    width: 100%;
    padding: 0;
`;

export const CarrouselContainer = styled.div`
    position: absolute;
    inset: 0;
    height: 100%;
    width: 100%;
`;

export const Carrousel = styled.div`
    position: relative;
    height: 100%;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 auto;
    padding: 15px 0;
    overflow: hidden;
`;

export const ImageAction = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 10px;
    transition: transform 0.2s ease-in-out;

    svg {
        color: var(--accent-foreground);
        height: 75px;
        width: 75px;
    }

    p {
        color: var(--accent-foreground);
    }

    &:hover {
        transform: scale(1.05);
    }
`;

export const Image = styled.img<{
    isVisible: boolean;
    slideDirection: "left" | "right";
    isExiting: boolean;
}>`
    position: absolute;
    width: 320px;
    height: 320px;
    object-fit: cover;
    border-radius: 8px;

    opacity: ${({ isVisible }) => (isVisible ? 1 : 0)};
    transform: ${({ isVisible, slideDirection, isExiting }) =>
        isVisible
            ? "translateX(0)"
            : slideDirection === "right"
            ? isExiting
                ? "translateX(-100%)"
                : "translateX(100%)"
            : isExiting
            ? "translateX(100%)"
            : "translateX(-100%)"};

    transition: opacity 0.5s ease-in-out, transform 0.5s ease-in-out;
`;

const ArrowBase = styled.div`
    position: absolute;
    width: 50px;
    height: 50px;
    cursor: pointer;
    top: 50%;
    transform: translateY(-50%);
    z-index: 200;

    svg {
        color: var(--accent-foreground);
        width: 100%;
        height: 100%;
        transition: transform 0.2s ease-in-out, color 0.2s ease-in-out;

        &:hover {
            color: var(--primary);
            transform: scale(1.05);
        }
    }
`;

export const ArrowLeft = styled(ArrowBase)`
    left: 80px;
`;

export const ArrowRight = styled(ArrowBase)`
    right: 80px;
`;

export const InputsFlex = styled.div`
    display: flex;
    gap: 20px;
    width: 100%;
`;

export const InputFlex = styled.div`
    display: flex;
    flex-direction: column;
    gap: 20px;
    width: 50%;
`;

export const TextArea = styled(Input).attrs({ as: "textarea" })`
    font-family: Arial, sans-serif;
    height: 100px;
    resize: none;
`;

export const CategoriesAndTags = styled(InputContainer)`
    width: 50%;
`;

export const CategoryContainer = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;

    select {
        width: 75%;
    }
`;

export const Select = styled(Input).attrs({ as: "select" })`
    width: 60%;
    cursor: pointer;
`;

export const TagsContainer = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 10px;
`;

export const Tags = styled.div`
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: 5px 10px;

    label {
        display: flex;
        align-items: center;
        gap: 5px;
        color: var(--card-foreground);
        font-size: 12px;

        input {
            &:focus {
                outline: 2px solid var(--ring);
            }
        }
    }
`;
