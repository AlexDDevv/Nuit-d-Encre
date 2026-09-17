import { describe, expect, it } from "vitest";
import { isPasswordStrong, passwordScore } from "./password";

describe("isPasswordStrong", () => {
    it("accepte un mot de passe respectant tous les critères", () => {
        expect(isPasswordStrong("Motdepasse1!")).toBe(true);
    });

    it.each([
        ["trop court", "Ab1!"],
        ["sans majuscule", "motdepasse1!"],
        ["sans minuscule", "MOTDEPASSE1!"],
        ["sans chiffre", "Motdepasse!"],
        ["sans symbole", "Motdepasse1"],
        ["trop long", `Ab1!${"a".repeat(252)}`],
    ])("refuse un mot de passe %s", (_label, value) => {
        expect(isPasswordStrong(value)).toBe(false);
    });

    it("ne compte pas une lettre accentuée comme symbole, comme le backend", () => {
        expect(isPasswordStrong("Motdepassé1")).toBe(false);
    });

    it.each(["-", "#", "£", "_", "\\", "/", " ", "`"])(
        "reconnaît « %s » comme symbole",
        (symbol) => {
            expect(isPasswordStrong(`Motdepasse1${symbol}`)).toBe(true);
        },
    );
});

describe("passwordScore", () => {
    it("compte les critères satisfaits", () => {
        expect(passwordScore("")).toBe(0);
        expect(passwordScore("motdepasse")).toBe(2);
        expect(passwordScore("Motdepasse1!")).toBe(5);
    });
});
