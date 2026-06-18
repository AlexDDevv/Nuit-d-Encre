/**
 * @packageDocumentation
 * @category Resolvers
 * @description
 * Gestion de la bannière de site : CRUD réservé aux administrateurs et query
 * publique `activeSiteBanner` qui résout l'audience côté serveur. Invariant :
 * au plus une bannière active à la fois (activation exclusive transactionnelle).
 */

import {
	Arg,
	Authorized,
	Ctx,
	ID,
	Mutation,
	Query,
	Resolver,
} from "type-graphql"
import { dataSource } from "../../../database/config/datasource"
import { SiteBanner } from "../../../database/entities/banner/site-banner"
import { CreateSiteBannerInput } from "../../inputs/create/banner/create-site-banner-input"
import { UpdateSiteBannerInput } from "../../inputs/update/banner/update-site-banner-input"
import { AppError } from "../../../middlewares/error-handler"
import { Context, Roles } from "../../../types/types"
import { whoami } from "../../../services/auth-service"
import { isBannerVisibleTo } from "../../../utils/banner-visibility"

@Resolver(SiteBanner)
export class SiteBannersResolver {
	/**
	 * Bannière active visible par le visiteur courant. Publique : résout
	 * l'audience via le cookie de session. Renvoie `null` si aucune bannière
	 * active ou si l'audience ne correspond pas au visiteur.
	 */
	@Query(() => SiteBanner, { nullable: true })
	async activeSiteBanner(
		@Ctx() context: Context,
	): Promise<SiteBanner | null> {
		const banner = await SiteBanner.findOne({
			where: { isActive: true },
			order: { updatedAt: "DESC" },
		})
		if (!banner) return null

		let isAuthenticated = false
		try {
			const user = await whoami(context.cookies)
			isAuthenticated = !!user
		} catch {
			isAuthenticated = false
		}

		return isBannerVisibleTo(banner.audience, isAuthenticated)
			? banner
			: null
	}

	/**
	 * Liste complète des bannières (active + historique) pour le panel admin.
	 */
	@Authorized(Roles.Admin)
	@Query(() => [SiteBanner])
	async siteBanners(): Promise<SiteBanner[]> {
		return SiteBanner.find({
			order: { isActive: "DESC", updatedAt: "DESC" },
			relations: { createdBy: true },
		})
	}

	/**
	 * Crée une bannière. Si elle est activée, désactive toutes les autres.
	 */
	@Authorized(Roles.Admin)
	@Mutation(() => SiteBanner)
	async createSiteBanner(
		@Arg("data", () => CreateSiteBannerInput) data: CreateSiteBannerInput,
		@Ctx() context: Context,
	): Promise<SiteBanner> {
		const user = context.user
		if (!user) throw new AppError("User not found", 404, "NotFoundError")

		return dataSource.transaction(async (manager) => {
			if (data.isActive) {
				await manager.update(
					SiteBanner,
					{ isActive: true },
					{ isActive: false },
				)
			}
			const banner = manager.create(SiteBanner, {
				...data,
				createdBy: user,
			})
			return manager.save(banner)
		})
	}

	/**
	 * Met à jour une bannière. Si on l'active, désactive toutes les autres.
	 */
	@Authorized(Roles.Admin)
	@Mutation(() => SiteBanner, { nullable: true })
	async updateSiteBanner(
		@Arg("id", () => ID) id: string,
		@Arg("data", () => UpdateSiteBannerInput) data: UpdateSiteBannerInput,
	): Promise<SiteBanner | null> {
		return dataSource.transaction(async (manager) => {
			const banner = await manager.findOne(SiteBanner, { where: { id } })
			if (!banner) {
				throw new AppError("Banner not found", 404, "NotFoundError")
			}
			if (data.isActive) {
				await manager.update(
					SiteBanner,
					{ isActive: true },
					{ isActive: false },
				)
			}
			Object.assign(banner, data)
			return manager.save(banner)
		})
	}

	/**
	 * Supprime une bannière.
	 */
	@Authorized(Roles.Admin)
	@Mutation(() => SiteBanner, { nullable: true })
	async deleteSiteBanner(
		@Arg("id", () => ID) id: string,
	): Promise<SiteBanner | null> {
		const banner = await SiteBanner.findOneBy({ id })
		if (!banner) {
			throw new AppError("Banner not found", 404, "NotFoundError")
		}
		await banner.remove()
		return banner
	}
}
