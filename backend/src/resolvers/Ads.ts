import {
    Arg,
    Mutation,
    Query,
    Resolver,
    ID,
    Authorized,
    Ctx,
} from "type-graphql";
import { Ad, createAdInput, updateAdInput } from "../entities/Ad";
import { AuthContextType } from "../auth";
import { merge } from "../utils/merge";
import { validate } from "class-validator";

@Resolver()
export class AdsResolver {
    @Query(() => [Ad])
    async ads(): Promise<Ad[]> {
        const ads = await Ad.find({
            relations: {
                category: true,
                tags: true,
                createdBy: true,
            },
        });

        return ads;
    }

    @Query(() => Ad, { nullable: true })
    async ad(@Arg("id", () => ID) id: number): Promise<Ad | null> {
        const ad = await Ad.findOne({
            where: { id },
            relations: {
                category: true,
                tags: true,
                createdBy: true,
            },
        });

        if (ad) {
            return ad;
        } else {
            return null;
        }
    }

    @Authorized("user", "admin")
    @Mutation(() => Ad)
    async createAd(
        @Arg("data", () => createAdInput) data: createAdInput,
        @Ctx() context: AuthContextType
    ): Promise<Ad> {
        const newAd = new Ad();
            const user = context.user;
        Object.assign(newAd, data, { createdBy: user });

        const errors = await validate(data);
        if (errors.length > 0) {
            throw new Error(`Validation error: ${JSON.stringify(errors)}`);
        } else {
            await newAd.save();
            return newAd;
        }
    }

    @Authorized("user", "admin")
    @Mutation(() => Ad, { nullable: true })
    async updateAd(
        @Arg("id", () => ID) id: number,
        @Arg("data", () => updateAdInput) data: updateAdInput,
        @Ctx() context: AuthContextType
    ): Promise<Ad | null> {
        const whereCreatedBy =
            context.user.role === "admin" ? undefined : { id: context.user.id };

        const ad = await Ad.findOne({
            where: { id, createdBy: whereCreatedBy },
            relations: { tags: true },
        });

        if (ad !== null) {
            merge(ad, data);
            await ad.save();
            return ad;
        } else {
            return null;
        }
    }

    @Authorized("user", "admin")
    @Mutation(() => Ad, { nullable: true })
    async deleteAd(
        @Arg("id", () => ID) id: number,
        @Ctx() context: AuthContextType
    ): Promise<Ad | null> {
        const whereCreatedBy =
            context.user.role === "admin" ? undefined : { id: context.user.id };

        const ad = await Ad.findOneBy({
            id,
            createdBy: whereCreatedBy,
        });

        if (ad !== null) {
            await ad.remove();
            Object.assign(ad, { id });
            return ad;
        } else {
            return null;
        }
    }
}
