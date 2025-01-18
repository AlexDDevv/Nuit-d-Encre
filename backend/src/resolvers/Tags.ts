import {
    Arg,
    Mutation,
    Query,
    Resolver,
    ID,
    Authorized,
    Ctx,
} from "type-graphql";
import { Tag, createTagInput, updateTagInput } from "../entities/Tag";
import { AuthContextType } from "../auth";

@Resolver()
export class TagsResolver {
    @Query(() => [Tag])
    async tags(): Promise<Tag[]> {
        const tags = await Tag.find();

        if (tags) {
            return tags;
        } else {
            return null;
        }
    }

    @Query(() => Tag)
    async tag(@Arg("id", () => ID) id: number): Promise<Tag> {
        const tag = await Tag.findOneBy({ id });

        if (tag) {
            return tag;
        } else {
            return null;
        }
    }

    @Authorized("admin")
    @Mutation(() => Tag)
    async createTag(
        @Arg("data", () => createTagInput) data: createTagInput,
        @Ctx() context: AuthContextType
    ): Promise<Tag> {
        const newTag = new Tag();
        const user = context.user;

        Object.assign(newTag, data, { createdBy: user });
        await newTag.save();
        return newTag;
    }

    @Authorized("admin")
    @Mutation(() => Tag)
    async updateTag(
        @Arg("id", () => ID) id: number,
        @Arg("data", () => updateTagInput) data: updateTagInput,
        @Ctx() context: AuthContextType
    ): Promise<Tag> {
        const tag = await Tag.findOneBy({
            id,
            createdBy: { id: context.user.id },
        });

        if (tag !== null) {
            Object.assign(tag, data);
            await tag.save();
            return tag;
        } else {
            return null;
        }
    }

    @Authorized("admin")
    @Mutation(() => Tag)
    async deleteTag(
        @Arg("id", () => ID) id: number,
        @Ctx() context: AuthContextType
    ): Promise<Tag> {
        const tag = await Tag.findOneBy({
            id,
            createdBy: { id: context.user.id },
        });

        if (tag !== null) {
            await tag.remove();
            tag.id = id;
            return tag;
        } else {
            return null;
        }
    }
}
