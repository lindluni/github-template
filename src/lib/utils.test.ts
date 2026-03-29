import { describe, expect, it } from "vitest";
import { cn } from "@/lib/utils";

describe("cn utility", () => {
    it("merges class names", () => {
        expect(cn("foo", "bar")).toBe("foo bar");
    });

    it("handles conditional classes", () => {
        expect(cn("base", false && "hidden", "visible")).toBe("base visible");
    });

    it("deduplicates conflicting tailwind classes", () => {
        expect(cn("px-4", "px-6")).toBe("px-6");
    });

    it("handles undefined and null inputs", () => {
        expect(cn("base", undefined, null, "end")).toBe("base end");
    });

    it("returns empty string with no inputs", () => {
        expect(cn()).toBe("");
    });
});
