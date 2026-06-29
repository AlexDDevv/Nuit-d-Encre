import { LuCompass, LuUsers } from "react-icons/lu";
import SegmentedTabs from "@/components/UI/SegmentedTabs";
import { FeedTab, FeedTabsProps, SegmentedOption } from "@/types/types";

const OPTIONS: SegmentedOption<FeedTab>[] = [
    { value: "abonnements", label: "Abonnements", icon: LuUsers },
    { value: "communaute", label: "Communauté", icon: LuCompass },
];

/**
 * Bascule entre le fil des abonnements et celui de la communauté. Verrouille
 * « Abonnements » quand le lecteur ne suit encore personne.
 */
export default function FeedTabs({ value, onChange, locked }: FeedTabsProps) {
    const options = OPTIONS.map((option) =>
        option.value === "abonnements" && locked
            ? {
                  ...option,
                  disabled: true,
                  tooltip: "Aucun abonnement pour le moment",
              }
            : option,
    );

    return (
        <SegmentedTabs
            options={options}
            value={value}
            onChange={onChange}
            ariaLabel="Choisir la source du fil"
        />
    );
}
