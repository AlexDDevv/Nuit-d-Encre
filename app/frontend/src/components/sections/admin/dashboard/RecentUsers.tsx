import { LuUserPlus } from "react-icons/lu";
import type { AdminRecentActivity } from "@/types/types";
import { Avatar } from "@/components/sections/admin/ui/Avatar";
import { formatDate } from "@/components/sections/admin/adminFormat";
import DashBlock from "./DashBlock";

export default function RecentUsers({
    users,
}: {
    users: AdminRecentActivity["recentUsers"];
}) {
    return (
        <DashBlock icon={LuUserPlus} title="Inscriptions récentes" meta="5 derniers">
            <ul className="divide-y-2 divide-border/55">
                {users.map((u) => (
                    <li
                        key={u.id}
                        className="flex items-center gap-3.5 px-5 py-3 transition-colors hover:bg-muted/25"
                    >
                        <Avatar name={u.userName} avatar={u.avatar} size={40} />
                        <div className="min-w-0 flex-1">
                            <span className="truncate font-body text-[14.5px] font-bold text-foreground">
                                {u.userName}
                            </span>
                            <span className="block truncate font-body text-[12.5px] text-muted-foreground">
                                {u.email}
                            </span>
                        </div>
                        <span className="shrink-0 font-body text-[12px] text-muted-foreground/80">
                            {formatDate(u.createdAt)}
                        </span>
                    </li>
                ))}
            </ul>
        </DashBlock>
    );
}
