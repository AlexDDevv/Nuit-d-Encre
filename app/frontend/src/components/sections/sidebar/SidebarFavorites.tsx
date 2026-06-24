import { useLocation } from "react-router-dom";
import { useQuery } from "@apollo/client";
import { LuBookOpenCheck, LuAward } from "react-icons/lu";
import { GET_USER_FAVORITE_BOOKS } from "@/graphql/user/profile";
import { useAuthContext } from "@/hooks/auth/useAuthContext";
import { cn, slugify } from "@/lib/utils";
import Button from "@/components/UI/Button";
import SidebarFavoritesSkeleton from "@/components/UI/skeleton/SidebarFavoritesSkeleton";

interface FavoriteBookData {
    id: string;
    favoriteRank: number;
    book: {
        id: string;
        title: string;
        author: {
            id: string;
            firstname: string;
            lastname: string;
        };
    };
}

interface SidebarFavoritesProps {
    collapsed: boolean;
}

export default function SidebarFavorites({ collapsed }: SidebarFavoritesProps) {
    const { user, isLoading: isAuthLoading } = useAuthContext();
    const { pathname } = useLocation();

    const isOnProfilePage = pathname.startsWith("/profil");

    const { data, loading } = useQuery<{
        getUserFavoriteBooks: FavoriteBookData[];
    }>(GET_USER_FAVORITE_BOOKS, {
        variables: { userId: user?.id },
        skip: !user || isOnProfilePage,
    });

    if (isAuthLoading) {
        return <SidebarFavoritesSkeleton collapsed={collapsed} />;
    }

    if (!user || isOnProfilePage) return null;

    const favorites = data?.getUserFavoriteBooks ?? [];

    if (loading || !data) {
        return <SidebarFavoritesSkeleton collapsed={collapsed} />;
    }

    if (favorites.length === 0) return null;

    const sortedFavorites = [...favorites].sort(
        (a, b) => a.favoriteRank - b.favoriteRank,
    );

    const labelClasses = cn(
        "whitespace-nowrap transition-opacity",
        collapsed
            ? "opacity-0 duration-150"
            : "opacity-100 duration-200 delay-150",
    );

    return (
        <section
            aria-label="Livres favoris"
            className="flex flex-col gap-2 p-4 pb-0"
        >
            <h2
                className={cn(
                    "text-popover-foreground flex items-center gap-3 overflow-hidden text-sm font-medium",
                    collapsed
                        ? "h-5 opacity-0 transition-all duration-150"
                        : "h-5 opacity-100 transition-all delay-150 duration-200",
                )}
            >
                <LuBookOpenCheck className="shrink-0" />
                <span>Vos livres favoris</span>
            </h2>
            <ol className="flex flex-col gap-1">
                {sortedFavorites.map((fav) => (
                    <li key={fav.id}>
                        <Button
                            variant="nav"
                            to={`/books/${fav.book.id}-${slugify(fav.book.title)}`}
                            fullWidth
                            ariaLabel={`Voir le livre ${fav.book.title}`}
                            title={fav.book.title}
                            leftIcon={<LuAward />}
                            className={cn(
                                collapsed &&
                                    "justify-center rounded-md [&>span:first-child]:mr-0",
                            )}
                        >
                            <span className={cn(labelClasses, "truncate")}>
                                {fav.book.title}
                            </span>
                        </Button>
                    </li>
                ))}
            </ol>
        </section>
    );
}
