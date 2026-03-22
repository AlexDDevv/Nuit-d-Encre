import { User } from "@/types/types";

interface LevelCardProps {
    user: User;
}

export default function LevelCard({ user }: LevelCardProps) {
    // The backend stores xp relative to the current level (not cumulative).
    // xpNeeded to go from level N to level N+1 is 100 * N (see user-xp-service.ts).
    const xpInLevel = user.xp; // already relative to current level
    const xpNeeded = 100 * user.level; // = getXpNeededForLevel(user.level)
    const progress = Math.min(Math.max((xpInLevel / xpNeeded) * 100, 0), 100);

    return (
        <div className="bg-card rounded-lg p-4 border border-border">
            <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground">Niveau</span>
                <span className="text-2xl font-bold text-primary">{user.level}</span>
            </div>

            {user.title && (
                <p className="text-sm font-medium text-foreground mb-3">{user.title.label}</p>
            )}

            <div className="space-y-1">
                <div className="flex justify-between text-xs text-muted-foreground">
                    <span>{xpInLevel} XP</span>
                    <span>{xpNeeded} XP</span>
                </div>
                <div className="w-full h-2 bg-accent rounded-full overflow-hidden">
                    <div
                        className="h-full bg-primary rounded-full transition-all duration-300"
                        style={{ width: `${progress}%` }}
                    />
                </div>
                <p className="text-xs text-muted-foreground text-right">
                    {Math.max(xpNeeded - xpInLevel, 0)} XP pour le niveau {user.level + 1}
                </p>
            </div>
        </div>
    );
}
