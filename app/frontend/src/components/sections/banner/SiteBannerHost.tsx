import Banner from "@/components/UI/Banner/Banner";
import type { BannerAction } from "@/components/UI/Banner/Banner.types";
import { useSiteBanner } from "@/hooks/banner/useSiteBanner";
import { useLocalStorage } from "@/hooks/storage/useLocalStorage";
import { toBannerVariant } from "@/lib/banner";

const DISMISS_KEY = "site-banner-dismissed";

/**
 * Affiche la bannière de site active en tête du contenu. Mémorise la fermeture
 * par couple `id:updatedAt` : une bannière modifiée par l'admin réapparaît.
 */
export default function SiteBannerHost() {
    const { banner } = useSiteBanner();
    const [dismissed, setDismissed] = useLocalStorage<string | null>(
        DISMISS_KEY,
        null,
    );

    if (!banner) return null;

    const marker = `${banner.id}:${banner.updatedAt}`;
    if (banner.dismissible && dismissed === marker) return null;

    const action: BannerAction | undefined =
        banner.actionLabel && banner.actionUrl
            ? {
                  label: banner.actionLabel,
                  ariaLabel: banner.actionLabel,
                  ...(banner.actionUrl.startsWith("/")
                      ? { to: banner.actionUrl }
                      : { href: banner.actionUrl }),
              }
            : undefined;

    return (
        <Banner
            variant={toBannerVariant(banner.variant)}
            title={banner.title}
            action={action}
            dismissible={banner.dismissible}
            onDismiss={() => setDismissed(marker)}
        >
            {banner.message}
        </Banner>
    );
}
