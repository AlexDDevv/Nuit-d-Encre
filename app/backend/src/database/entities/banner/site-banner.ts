/**
 * @packageDocumentation
 * @category Entities
 * @description
 * Entité `SiteBanner` : bannière de site administrable, persistée et affichée
 * sur toute l'application (annonce, maintenance, information). Au plus une
 * bannière active à la fois (invariant garanti par le resolver).
 */

import {
	BaseEntity,
	Column,
	Entity,
	ManyToOne,
	PrimaryGeneratedColumn,
} from "typeorm"
import { Field, ID, ObjectType } from "type-graphql"
import { User } from "../user/user"
import { BannerAudience, BannerVariant } from "../../../types/types"

@ObjectType()
@Entity({ name: "site_banner" })
export class SiteBanner extends BaseEntity {
	@Field(() => ID)
	@PrimaryGeneratedColumn("uuid")
	id!: string

	@Field()
	@Column({ type: "varchar", length: 120 })
	title!: string

	@Field(() => String, { nullable: true })
	@Column({ type: "text", nullable: true })
	message?: string | null

	@Field(() => BannerVariant)
	@Column({ type: "varchar", length: 20, default: BannerVariant.INFO })
	variant!: BannerVariant

	@Field(() => BannerAudience)
	@Column({ type: "varchar", length: 20, default: BannerAudience.ALL })
	audience!: BannerAudience

	@Field()
	@Column({ type: "boolean", default: true })
	dismissible!: boolean

	@Field(() => String, { nullable: true })
	@Column({ type: "varchar", length: 60, nullable: true })
	actionLabel?: string | null

	@Field(() => String, { nullable: true })
	@Column({ type: "varchar", nullable: true })
	actionUrl?: string | null

	@Field()
	@Column({ type: "boolean", default: false })
	isActive!: boolean

	@ManyToOne(() => User, { nullable: true })
	@Field(() => User, { nullable: true })
	createdBy?: User | null

	@Field()
	@Column({ default: () => "CURRENT_TIMESTAMP" })
	createdAt!: Date

	@Field()
	@Column({
		default: () => "CURRENT_TIMESTAMP",
		onUpdate: "CURRENT_TIMESTAMP",
	})
	updatedAt!: Date
}
