import styled from "styled-components"

const Stats = styled.div`
    background-color: var(--card);
    border: 1px solid var(--border);
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 20px;
    padding: 20px;
    min-width: 430px;
    transition: border-color 0.2s ease-in-out;

    &:hover {
        border-color: var(--card-foreground);

        svg {
            transform: rotate(-30deg);
        }
    }
`

const Stat = styled.div`
    display: flex;
    flex-direction: column;
    gap: 8px;
`

const StatOf = styled.h2`
    color: var(--card-foreground);
    font-size: 16px;
    font-weight: 500;
`

const Number = styled(StatOf).attrs({ as: 'h3' })`
    font-weight: 700;
`;

const IconContainer = styled.div`
    width: 40px;
    height: 40px;

    svg {
        color: var(--card-foreground);
        width: 100%;
        height: 100%;
        transition: transform 0.2s ease-in-out;
    }
`

export default function AppStats({ number, numberOf, Icon }: { number: number, numberOf: string, Icon: React.ElementType }) {
    return (
        <Stats key={number}>
            <Stat>
                <StatOf>
                    {numberOf}
                </StatOf>
                <Number>
                    {number}
                </Number>
            </Stat>
            <IconContainer>
                <Icon />
            </IconContainer>
        </Stats>
    )
}
