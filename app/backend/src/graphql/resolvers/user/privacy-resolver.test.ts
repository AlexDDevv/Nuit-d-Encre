import * as argon2 from "argon2";
import { User } from "../../../database/entities/user/user";
import { CloudinaryService } from "../../../services/cloudinary.service";
import { eraseUserAccount } from "../../../services/rgpd/erasure-service";
import { makeContext, makeUser } from "../../../test/factories";
import { PrivacyResolver } from "./privacy-resolver";

jest.mock("../../../services/cloudinary.service");
jest.mock("../../../services/rgpd/erasure-service");
jest.mock("../../../services/rgpd/export-service");

const erase = eraseUserAccount as jest.Mock;
const deleteImage = CloudinaryService.prototype.deleteImage as jest.Mock;

const PASSWORD = "Motdepasse1!";

describe("PrivacyResolver.deleteMyAccount", () => {
    const resolver = new PrivacyResolver();

    async function storedUser(hashedPassword: string | null): Promise<User> {
        const user = makeUser("user-1");
        user.hashedPassword = hashedPassword;
        jest.spyOn(User, "findOne").mockResolvedValue(user);
        return user;
    }

    beforeEach(() => {
        jest.restoreAllMocks();
        deleteImage.mockResolvedValue(undefined);
    });

    it("exige le mot de passe d'un compte local", async () => {
        await storedUser(await argon2.hash(PASSWORD));

        await expect(
            resolver.deleteMyAccount(makeContext(makeUser("user-1")))
        ).rejects.toMatchObject({ statusCode: 400 });
        expect(erase).not.toHaveBeenCalled();
    });

    it("refuse un mot de passe incorrect", async () => {
        await storedUser(await argon2.hash(PASSWORD));

        await expect(
            resolver.deleteMyAccount(makeContext(makeUser("user-1")), "Mauvais1!")
        ).rejects.toMatchObject({ statusCode: 401 });
        expect(erase).not.toHaveBeenCalled();
    });

    it("efface le compte, ses images et la session avec le bon mot de passe", async () => {
        await storedUser(await argon2.hash(PASSWORD));
        const context = makeContext(makeUser("user-1"));

        await expect(resolver.deleteMyAccount(context, PASSWORD)).resolves.toBe(
            true
        );
        expect(erase).toHaveBeenCalledWith("user-1");
        expect(deleteImage).toHaveBeenCalledWith("users/user-1/avatar");
        expect(deleteImage).toHaveBeenCalledWith("users/user-1/banner");
        expect(context.cookies.set).toHaveBeenCalledWith("token", "", {
            maxAge: -1,
        });
    });

    it("n'exige pas de mot de passe pour un compte Google", async () => {
        await storedUser(null);

        await expect(
            resolver.deleteMyAccount(makeContext(makeUser("user-1")))
        ).resolves.toBe(true);
        expect(erase).toHaveBeenCalledWith("user-1");
    });

    it("efface le compte même si le nettoyage Cloudinary échoue", async () => {
        await storedUser(null);
        deleteImage.mockRejectedValue(new Error("cloudinary down"));
        jest.spyOn(console, "error").mockImplementation(() => {});
        const context = makeContext(makeUser("user-1"));

        await expect(resolver.deleteMyAccount(context)).resolves.toBe(true);
        expect(erase).toHaveBeenCalledWith("user-1");
        expect(context.cookies.set).toHaveBeenCalledWith("token", "", {
            maxAge: -1,
        });
    });
});
