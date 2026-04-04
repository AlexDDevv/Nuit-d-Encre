import { useLocation } from "react-router-dom";
import { useQuery } from "@apollo/client";
import { LuBookOpenCheck, LuAward } from "react-icons/lu";
import { GET_USER_FAVORITE_BOOKS } from "@/graphql/user/profile";
import { useAuthContext } from "@/hooks/auth/useAuthContext";
import { slugify } from "@/lib/utils";
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

export default function SidebarFavorites({
    collapsed,
}: SidebarFavoritesProps) {
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

    return (
        <section aria-label="Livres favoris" className="flex flex-col gap-2 p-4 pb-0">
            {!collapsed && (
                <h2 className="text-popover-foreground flex items-center gap-3 text-sm font-medium">
                    <LuBookOpenCheck className="shrink-0" />
                    <span>Vos livres favoris</span>
                </h2>
            )}
            <ol className="flex flex-col gap-1">
                {sortedFavorites.map((fav) => (
                    <li key={fav.id}>
                        <Button
                            variant="nav"
                            to={`/books/${fav.book.id}-${slugify(fav.book.title)}`}
                            fullWidth
                            ariaLabel={`Voir le livre ${fav.book.title}`}
                            title={fav.book.title}
                            leftIcon={<LuAward className="shrink-0" />}
                            children={!collapsed && (
                                <span className="truncate">{fav.book.title}</span>
                            )}
                        />
                    </li>
                ))}
            </ol>
        </section>
    );
}
