import { FaRegUser, FaShieldHalved } from "react-icons/fa6";
import { Tab } from "./types";

// — Sélecteur d'onglets segmenté (bascule dorée) —
export default function TabSwitch({
    tab,
    setTab,
}: {
    tab: Tab;
    setTab: (t: Tab) => void;
}) {
    const opts = [
        { id: "infos" as const, label: "Informations", icon: FaRegUser },
        { id: "security" as const, label: "Sécurité", icon: FaShieldHalved },
    ];
    return (
        <div
            role="tablist"
            aria-label="Sections du profil"
            className="border-border bg-popover grid grid-cols-2 gap-1 rounded-lg border-2 p-1"
        >
            {opts.map((o) => {
                const on = tab === o.id;
                const Icon = o.icon;
                return (
                    <button
                        key={o.id}
                        role="tab"
                        aria-selected={on}
                        id={`tab-${o.id}`}
                        aria-controls={`panel-${o.id}`}
                        onClick={() => setTab(o.id)}
                        className={`inline-flex items-center justify-center gap-2 rounded-md px-3.5 py-2 font-body text-[13.5px] font-bold tracking-wide whitespace-nowrap transition-all duration-200 ${
                            on
                                ? "bg-primary text-primary-foreground shadow-sm"
                                : "text-muted-foreground hover:text-foreground"
                        }`}
                    >
                        <Icon size={14} /> {o.label}
                    </button>
                );
            })}
        </div>
    );
}
