import { Arg, Mutation, Query, Resolver, ID } from "type-graphql";
import { Tag, createTagInput, updateTagInput } from "../entities/Tag";

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

    @Mutation(() => Tag)
    async createTag(
        @Arg("data", () => createTagInput) data: createTagInput
    ): Promise<Tag> {
        const newTag = new Tag();
        Object.assign(newTag, data);
        await newTag.save();
        return newTag;
    }

    @Mutation(() => Tag)
    async updateTag(
        @Arg("id", () => ID) id: number,
        @Arg("data", () => updateTagInput) data: updateTagInput
    ): Promise<Tag> {
        const tag = await Tag.findOneBy({ id });
        if (tag !== null) {
            Object.assign(tag, data);
            await tag.save();
            return tag;
        } else {
            return null;
        }
    }

    @Mutation(() => Tag)
    async deleteTag(@Arg("id", () => ID) id: number): Promise<Tag> {
        const tag = await Tag.findOneBy({ id });
        if (tag !== null) {
            await tag.remove();
            return tag;
        } else {
            return null;
        }
    }
}
