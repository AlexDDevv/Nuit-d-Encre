import { Arg, Mutation, Query, Resolver, ID } from "type-graphql";
import { Ad, createAdInput, updateAdInput } from "../entities/Ad";

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

    @Mutation(() => Ad)
    async createAd(
        @Arg("data", () => createAdInput) data: createAdInput
    ): Promise<Ad> {
        const newCategory = new Ad();
        Object.assign(newCategory, data);
        await newCategory.save();
        return newCategory;
    }

    @Mutation(() => Ad, { nullable: true })
    async updateAd(
        @Arg("id", () => ID) id: number,
        @Arg("data", () => updateAdInput) data: updateAdInput
    ): Promise<Ad | null> {
        const ad = await Ad.findOneBy({ id });
        if (ad !== null) {
            Object.assign(ad, data);
            await ad.save();
            return ad;
        } else {
            return null;
        }
    }

    @Mutation(() => Ad, { nullable: true })
    async deleteAd(@Arg("id", () => ID) id: number): Promise<Ad | null> {
        const ad = await Ad.findOneBy({ id });
        if (ad !== null) {
            await ad.remove();
            Object.assign(ad, { id });
            return ad;
        } else {
            return null;
        }
    }
}
