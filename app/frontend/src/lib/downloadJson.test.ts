// @vitest-environment happy-dom
import { describe, expect, it, vi } from "vitest";
import { downloadJson } from "./downloadJson";

describe("downloadJson", () => {
    it("crée un lien de téléchargement et le clique", () => {
        const click = vi.fn();
        const anchor = { href: "", download: "", click } as unknown as HTMLAnchorElement;
        vi.spyOn(document, "createElement").mockReturnValue(anchor);
        vi.stubGlobal("URL", {
            createObjectURL: vi.fn(() => "blob:x"),
            revokeObjectURL: vi.fn(),
        });

        downloadJson("mes-donnees.json", '{"a":1}');

        expect(anchor.download).toBe("mes-donnees.json");
        expect(click).toHaveBeenCalledTimes(1);
    });
});
