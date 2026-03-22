import { Authorized, Query, Resolver } from "type-graphql";
import { Title } from "../../../database/entities/gamification/title";
import { AppError } from "../../../middlewares/error-handler";
import { Roles } from "../../../types/types";

@Resolver(Title)
export class TitleResolver {
    @Authorized(Roles.Admin)
    @Query(() => [Title])
    async getTitles(): Promise<Title[]> {
        try {
            return Title.find({ order: { minLevel: "ASC" } });
        } catch (error) {
            throw new AppError("Failed to fetch titles", 500, "InternalServerError");
        }
    }
}
