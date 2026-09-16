import { FaRegUser, FaShieldHalved, FaUserShield } from "react-icons/fa6";
import SegmentedTabs from "@/components/UI/SegmentedTabs";
import { SegmentedOption } from "@/types/types";
import { Tab } from "./types";

const OPTIONS: SegmentedOption<Tab>[] = [
    { value: "infos", label: "Informations", icon: FaRegUser },
    { value: "security", label: "Sécurité", icon: FaShieldHalved },
    { value: "privacy", label: "Confidentialité", icon: FaUserShield },
];

// - Sélecteur d'onglets segmenté (bascule dorée), via la primitive SegmentedTabs -
export default function TabSwitch({
    tab,
    setTab,
}: {
    tab: Tab;
    setTab: (t: Tab) => void;
}) {
    return (
        <SegmentedTabs
            options={OPTIONS}
            value={tab}
            onChange={setTab}
            ariaLabel="Sections du profil"
            fullWidth
            className="max-xs:[&_button]:px-2 max-xs:[&_button]:text-xs max-xs:[&_svg]:hidden"
        />
    );
}
