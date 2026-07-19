import { Arg, Authorized, Ctx, Mutation, Query, Resolver } from "type-graphql";
import * as argon2 from "argon2";
import { User } from "../../../database/entities/user/user";
import { AppError } from "../../../middlewares/error-handler";
import { CloudinaryService } from "../../../services/cloudinary.service";
import { eraseUserAccount } from "../../../services/rgpd/erasure-service";
import { exportUserData } from "../../../services/rgpd/export-service";
import { Context } from "../../../types/types";

/**
 * Resolver des droits RGPD self-service de l'utilisateur connecté :
 * accès/portabilité (exportMyData) et effacement (deleteMyAccount).
 */
@Resolver()
export class PrivacyResolver {
    private cloudinaryService = new CloudinaryService();

    @Authorized()
    @Query(() => String)
    async exportMyData(@Ctx() context: Context): Promise<string> {
        const user = context.user;
        if (!user) throw new AppError("User not found", 404, "NotFoundError");
        return exportUserData(user.id);
    }

    @Authorized()
    @Mutation(() => Boolean)
    async deleteMyAccount(
        @Ctx() context: Context,
        @Arg("password", () => String, { nullable: true })
        password?: string | null,
    ): Promise<boolean> {
        const contextUser = context.user;
        if (!contextUser)
            throw new AppError("User not found", 404, "NotFoundError");

        // Recharge depuis la BDD pour disposer du hash (non exposé en GraphQL).
        const user = await User.findOne({ where: { id: contextUser.id } });
        if (!user) throw new AppError("User not found", 404, "NotFoundError");

        // Comptes locaux : confirmation obligatoire par mot de passe.
        // Comptes Google purs (pas de hash) : la confirmation UI suffit.
        if (user.hashedPassword) {
            if (!password) {
                throw new AppError(
                    "Mot de passe requis pour confirmer la suppression",
                    400,
                    "BadRequestError",
                );
            }
            const valid = await argon2.verify(user.hashedPassword, password);
            if (!valid) {
                throw new AppError(
                    "Mot de passe incorrect",
                    401,
                    "UnauthorizedError",
                );
            }
        }

        const userId = user.id;

        // Efface les données en base (transaction).
        await eraseUserAccount(userId);

        // Best-effort : supprime les images Cloudinary après l'effacement BDD.
        // Un échec ici ne doit pas annuler la suppression déjà committée.
        try {
            await this.cloudinaryService.deleteImage(`users/${userId}/avatar`);
            await this.cloudinaryService.deleteImage(`users/${userId}/banner`);
        } catch (error) {
            console.error("Cloudinary cleanup failed for erased user:", error);
        }

        // Invalide la session.
        context.cookies.set("token", "", { maxAge: -1 });

        return true;
    }
}
