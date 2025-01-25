import styled from "styled-components"
import AppStats from "../components/AppStats"
import AdminPanel from "../components/AdminPanel"
import { IdCard, User, Tag } from "lucide-react"
import data from "../data/data.json"

const SectionAdmin = styled.section`
    display: flex;
    flex-direction: column;
    gap: 75px;
`

const StatsContainer = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 20px;
`

export default function Admin() {
    const icons = [IdCard, User, Tag];

    return (
        <SectionAdmin>
            <StatsContainer>
                {data.stats.map((item, index) => {
                    const IconComponent = icons[index % icons.length];
                    return (
                        <AppStats
                            key={item.number}
                            number={item.number}
                            numberOf={item.numberOf}
                            Icon={IconComponent}
                        />
                    );
                })}
            </StatsContainer>
            <AdminPanel />
        </SectionAdmin>
    )
}
