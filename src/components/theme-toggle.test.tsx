import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { ThemeToggle } from "@/components/theme-toggle";

const mockSetTheme = vi.fn();
vi.mock("next-themes", () => ({
    useTheme: () => ({
        setTheme: mockSetTheme,
        resolvedTheme: "light",
    }),
}));

describe("ThemeToggle", () => {
    it("renders the toggle button", () => {
        render(<ThemeToggle />);
        expect(
            screen.getByRole("button", { name: /toggle theme/i }),
        ).toBeInTheDocument();
    });

    it("calls setTheme when clicked", async () => {
        render(<ThemeToggle />);

        await userEvent.click(
            screen.getByRole("button", { name: /toggle theme/i }),
        );
        expect(mockSetTheme).toHaveBeenCalledWith("dark");
    });
});
