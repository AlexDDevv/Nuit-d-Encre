import { Link, useLocation } from "react-router-dom";
import { useQuery } from "@apollo/client";
import { LuHeart, LuAward } from "react-icons/lu";
import { GET_USER_FAVORITE_BOOKS } from "@/graphql/user/profile";
import { useAuthContext } from "@/hooks/auth/useAuthContext";
import { slugify } from "@/lib/utils";

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
    const { user } = useAuthContext();
    const { pathname } = useLocation();

    const isOnProfilePage = pathname.startsWith("/profil");

    const { data, loading } = useQuery<{
        getUserFavoriteBooks: FavoriteBookData[];
    }>(GET_USER_FAVORITE_BOOKS, {
        variables: { userId: user?.id },
        skip: !user || isOnProfilePage,
    });

    if (!user || isOnProfilePage) return null;

    const favorites = data?.getUserFavoriteBooks ?? [];

    if (loading) {
        return (
            <section aria-label="Livres favoris" className="flex flex-col gap-2">
                {!collapsed && (
                    <h2 className="text-card-foreground flex items-center gap-3 text-sm font-semibold">
                        <LuHeart className="h-5 w-5 shrink-0" />
                        <span>Vos livres favoris</span>
                    </h2>
                )}
                <div className="flex flex-col gap-1.5">
                    {[1, 2, 3].map((i) => (
                        <div
                            key={i}
                            className="bg-muted h-8 animate-pulse rounded-md"
                        />
                    ))}
                </div>
            </section>
        );
    }

    if (favorites.length === 0) return null;

    const sortedFavorites = [...favorites].sort(
        (a, b) => a.favoriteRank - b.favoriteRank,
    );

    return (
        <section aria-label="Livres favoris" className="flex flex-col gap-2">
            {!collapsed && (
                <h2 className="text-card-foreground flex items-center gap-3 text-sm font-semibold">
                    <LuHeart className="h-5 w-5 shrink-0" />
                    <span>Vos livres favoris</span>
                </h2>
            )}
            <ol className="flex flex-col gap-1">
                {sortedFavorites.map((fav) => (
                    <li key={fav.id}>
                        <Link
                            to={`/books/${fav.book.id}-${slugify(fav.book.title)}`}
                            className="text-muted-foreground hover:bg-accent hover:text-foreground flex items-center gap-3 rounded-md px-2 py-1.5 text-sm transition-colors duration-200"
                            title={
                                collapsed ? fav.book.title : undefined
                            }
                            aria-label={`Voir le livre ${fav.book.title}`}
                        >
                            <LuAward className="h-4 w-4 shrink-0" />
                            {!collapsed && (
                                <span className="truncate">
                                    {fav.book.title}
                                </span>
                            )}
                        </Link>
                    </li>
                ))}
            </ol>
        </section>
    );
}
