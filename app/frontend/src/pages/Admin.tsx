import { useState } from "react";
import { Helmet } from "react-helmet-async";
import type { IconType } from "react-icons";
import {
    LuBookOpen,
    LuFeather,
    LuLayoutDashboard,
    LuMegaphone,
    LuMessageSquareQuote,
    LuShield,
    LuTags,
    LuUsers,
} from "react-icons/lu";
import type { TabConfiguration } from "@/components/UI/Tabs/Tab.types";
import { Tabs, TabsContent } from "@/components/UI/Tabs/Tab";
import { useAdminStats } from "@/hooks/admin/useAdminStats";
import { useAdminActivity } from "@/hooks/admin/useAdminActivity";
import { Ornament } from "@/components/sections/admin/ui/chips";
import { AnalyticsBar } from "@/components/sections/admin/AnalyticsBar";
import { AdminDashboard } from "@/components/sections/admin/AdminDashboard";
import { UsersTab } from "@/components/sections/admin/tabs/UsersTab";
import { BooksTab } from "@/components/sections/admin/tabs/BooksTab";
import { AuthorsTab } from "@/components/sections/admin/tabs/AuthorsTab";
import { CategoriesTab } from "@/components/sections/admin/tabs/CategoriesTab";
import { ReviewsTab } from "@/components/sections/admin/tabs/ReviewsTab";
import { BannersTab } from "@/components/sections/admin/tabs/BannersTab";

type AdminTab = {
    value: string;
    label: string;
    icon: IconType;
};

const TABS: AdminTab[] = [
    { value: "dashboard", label: "Dashboard", icon: LuLayoutDashboard },
    { value: "users", label: "Utilisateurs", icon: LuUsers },
    { value: "books", label: "Livres", icon: LuBookOpen },
    { value: "authors", label: "Auteurs", icon: LuFeather },
    { value: "categories", label: "Catégories", icon: LuTags },
    { value: "reviews", label: "Critiques", icon: LuMessageSquareQuote },
    { value: "banners", label: "Bannières", icon: LuMegaphone },
];

const TAB_CONFIG: TabConfiguration[] = TABS.map((t) => ({
    value: t.value,
    label: t.label,
    icon: t.icon,
}));

/** Onglet Dashboard : isolé pour ne charger l'activité que lorsqu'il est actif. */
function DashboardPanel() {
    const { activity, isLoadingActivity } = useAdminActivity();
    return <AdminDashboard activity={activity} loading={isLoadingActivity} />;
}

/** Panel d'administration : analytics permanent, navigation par onglets, contenu. */
export default function Admin() {
    const { stats, isLoadingStats } = useAdminStats();

    const initialHash = window.location.hash.replace("#", "");
    const [active, setActive] = useState(
        TABS.some((t) => t.value === initialHash) ? initialHash : "dashboard",
    );

    const change = (value: string) => {
        setActive(value);
        try {
            window.history.replaceState(null, "", `#${value}`);
        } catch {
            /* noop */
        }
    };

    return (
        <div className="min-h-dvh">
            <Helmet>
                <title>Administration - Nuit d'Encre</title>
            </Helmet>

            {/* En-tête */}
            <header className="border-border border-b-2">
                <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 pb-4 md:px-4">
                    <div className="flex flex-col gap-2">
                        <div className="flex items-center gap-3">
                            <Ornament width="w-8" />
                            <span className="font-body text-muted-foreground text-xs uppercase tracking-[0.3em]">
                                Salle des archives
                            </span>
                        </div>
                        <h1 className="font-quote text-foreground text-lg font-medium leading-tight sm:text-3xl md:text-4xl">
                            Gérer la bibliothèque, veiller sur l'encre.
                        </h1>
                    </div>
                    <div className="flex items-center gap-3">
                        <span className="border-primary/40 bg-primary/10 font-body text-primary hidden items-center gap-2 rounded-full border-2 px-3 py-1.5 text-xs font-bold uppercase tracking-[0.14em] sm:inline-flex">
                            <LuShield size={13} /> Administration
                        </span>
                    </div>
                </div>
            </header>

            {/* Contenu */}
            <main className="mx-auto max-w-7xl py-6 md:px-6 md:py-8">
                {/* Analytics permanent */}
                <div className="mb-7">
                    <AnalyticsBar stats={stats} loading={isLoadingStats} />
                </div>

                {/* Onglets + contenu */}
                <Tabs
                    tabs={TAB_CONFIG}
                    value={active}
                    onChange={change}
                    variant="panel"
                >
                    <TabsContent value="dashboard" className="pt-7">
                        <DashboardPanel />
                    </TabsContent>
                    <TabsContent value="users" className="pt-7">
                        <UsersTab />
                    </TabsContent>
                    <TabsContent value="books" className="pt-7">
                        <BooksTab />
                    </TabsContent>
                    <TabsContent value="authors" className="pt-7">
                        <AuthorsTab />
                    </TabsContent>
                    <TabsContent value="categories" className="pt-7">
                        <CategoriesTab />
                    </TabsContent>
                    <TabsContent value="reviews" className="pt-7">
                        <ReviewsTab />
                    </TabsContent>
                    <TabsContent value="banners" className="pt-7">
                        <BannersTab />
                    </TabsContent>
                </Tabs>

                {/* Épigraphe de pied */}
                <footer className="mt-14 flex flex-col items-center gap-3 pb-6 text-center">
                    <Ornament />
                    <p className="font-quote text-muted-foreground/65 max-w-md text-sm italic">
                        « Un bibliothécaire est un veilleur : il garde la nuit
                        pour que d'autres y trouvent le jour. »
                    </p>
                </footer>
            </main>
        </div>
    );
}
