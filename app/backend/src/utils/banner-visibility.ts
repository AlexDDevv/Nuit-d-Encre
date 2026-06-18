import { BannerAudience } from "../types/types"

/**
 * Détermine si une bannière est visible par le visiteur courant selon son
 * audience. `ALL` est toujours visible ; `AUTHENTICATED` requiert une session.
 */
export function isBannerVisibleTo(
	audience: BannerAudience,
	isAuthenticated: boolean,
): boolean {
	if (audience === BannerAudience.AUTHENTICATED) {
		return isAuthenticated
	}
	return true
}
