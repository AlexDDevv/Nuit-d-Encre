import styled from "styled-components";
import { Search } from "lucide-react";
import { Button } from "./StyledButton";

const ResearchForm = styled.form`
    display: flex;
    align-items: center;
    justify-content: center;
    max-width: 700px;
    flex-grow: 1;
    gap: 10px;
    position: relative;
`;

const InputForm = styled.input`
    background-color: var(--input);
    border: none;
    border-radius: 6px;
    color: var(--accent-foreground);
    font-size: 12px;
    font-family: inherit;
    height: 40px;
    width: 100%;
    padding: 8px;

    &::placeholder {
        opacity: 0.85;
        font-style: italic;
    }

    &:focus {
        outline: 2px solid var(--ring);
    }
`;

const SearchButton = styled(Button)`
    position: absolute;
    right: 8px;
`;

export default function Form() {
    return (
        <ResearchForm>
            <InputForm
                type="search"
                placeholder="Rechercher sur The good corner"
            />
            <SearchButton
                background="var(--primary)"
                rounded="6px"
                width="30px"
                height="30px"
                padding="0"
                type="button"
            >
                <Search
                    color="var(--primary-foreground)"
                    height={16}
                    width={16}
                />
            </SearchButton>
        </ResearchForm>
    );
}
