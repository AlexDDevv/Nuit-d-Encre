import { shouldRunMigrations } from "./should-run-migrations";

describe("shouldRunMigrations", () => {
    it("active par défaut quand la variable est absente", () => {
        expect(shouldRunMigrations(undefined)).toBe(true);
    });

    it('active pour toute valeur autre que "false"', () => {
        expect(shouldRunMigrations("true")).toBe(true);
        expect(shouldRunMigrations("")).toBe(true);
        expect(shouldRunMigrations("1")).toBe(true);
    });

    it('désactive uniquement pour la valeur exacte "false"', () => {
        expect(shouldRunMigrations("false")).toBe(false);
    });
});
