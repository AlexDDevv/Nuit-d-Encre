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

@Resolver()
export class AdsResolver {
    @Query(() => [Ad])
    async ads(): Promise<Ad[]> {
        const ads = await Ad.find({
            relations: {
                category: true,
                tags: true,
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
            },
        });

        if (ad) {
            return ad;
        } else {
            return null;
        }
    }

    @Authorized()
    @Mutation(() => Ad)
    async createAd(
        @Arg("data", () => createAdInput) data: createAdInput,
        @Ctx() context: AuthContextType
    ): Promise<Ad> {
        const newCategory = new Ad();
        const user = context.user;
        Object.assign(newCategory, data, { createdBy: user });
        await newCategory.save();
        return newCategory;
    }

    @Authorized()
    @Mutation(() => Ad, { nullable: true })
    async updateAd(
        @Arg("id", () => ID) id: number,
        @Arg("data", () => updateAdInput) data: updateAdInput,
        @Ctx() context: AuthContextType
    ): Promise<Ad | null> {
        const ad = await Ad.findOneBy({
            id,
            createdBy: { id: context.user.id },
        });

        if (ad !== null) {
            Object.assign(ad, data);
            await ad.save();
            return ad;
        } else {
            return null;
        }
    }

    @Authorized()
    @Mutation(() => Ad, { nullable: true })
    async deleteAd(
        @Arg("id", () => ID) id: number,
        @Ctx() context: AuthContextType
    ): Promise<Ad | null> {
        const ad = await Ad.findOneBy({
            id,
            createdBy: { id: context.user.id },
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
