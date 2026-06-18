import { Field, InputType } from "type-graphql"
import {
	IsBoolean,
	IsEnum,
	IsOptional,
	IsUrl,
	Length,
	ValidateIf,
} from "class-validator"
import { BannerAudience, BannerVariant } from "../../../../types/types"

@InputType()
export class CreateSiteBannerInput {
	@Field()
	@Length(1, 120, {
		message: "Le titre doit faire entre 1 et 120 caractères.",
	})
	title!: string

	@Field(() => String, { nullable: true })
	@IsOptional()
	@Length(0, 1000, {
		message: "Le message ne peut dépasser 1000 caractères.",
	})
	message?: string | null

	@Field(() => BannerVariant, { nullable: true })
	@IsOptional()
	@IsEnum(BannerVariant, { message: "Variante invalide." })
	variant?: BannerVariant

	@Field(() => BannerAudience, { nullable: true })
	@IsOptional()
	@IsEnum(BannerAudience, { message: "Audience invalide." })
	audience?: BannerAudience

	@Field({ nullable: true })
	@IsOptional()
	@IsBoolean()
	dismissible?: boolean

	@Field(() => String, { nullable: true })
	@IsOptional()
	@Length(1, 60, {
		message: "Le libellé d'action doit faire entre 1 et 60 caractères.",
	})
	actionLabel?: string | null

	@Field(() => String, { nullable: true })
	@IsOptional()
	@ValidateIf((o) => o.actionUrl != null && !o.actionUrl.startsWith("/"))
	@IsUrl(
		{},
		{
			message:
				"L'URL d'action doit être une URL valide ou un chemin interne.",
		},
	)
	actionUrl?: string | null

	@Field({ nullable: true })
	@IsOptional()
	@IsBoolean()
	isActive?: boolean
}
