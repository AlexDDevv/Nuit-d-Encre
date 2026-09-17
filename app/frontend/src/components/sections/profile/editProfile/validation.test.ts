import { describe, expect, it } from "vitest";
import { validateSecurity } from "./validation";

describe("validateSecurity", () => {
    const valid = {
        current: "Ancien1!",
        newpw: "Nouveau2?",
        confirm: "Nouveau2?",
    };

    it("valide un changement conforme", () => {
        expect(validateSecurity(valid)).toEqual({});
    });

    it("refuse un nouveau mot de passe faible, comme le backend", () => {
        expect(
            validateSecurity({ ...valid, newpw: "motdepasse", confirm: "motdepasse" }),
        ).toHaveProperty("newpw");
    });

    it("exige la confirmation identique et le mot de passe actuel", () => {
        const errors = validateSecurity({
            current: "",
            newpw: "Nouveau2?",
            confirm: "Nouveau3?",
        });
        expect(errors).toHaveProperty("current");
        expect(errors).toHaveProperty("confirm");
    });
});
