import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import Home from "@/app/page";

const mockPush = vi.fn();
vi.mock("next/navigation", () => ({
    useRouter: () => ({
        push: mockPush,
    }),
}));

vi.mock("next-themes", () => ({
    useTheme: () => ({
        setTheme: vi.fn(),
        resolvedTheme: "light",
    }),
}));

const mockSocialSignIn = vi.fn();
const mockUseSession = vi.fn(() => ({ data: null, isPending: false }));
vi.mock("@/lib/auth-client", () => ({
    authClient: {
        useSession: (...args: unknown[]) => mockUseSession(...args),
        signIn: {
            social: (...args: unknown[]) => mockSocialSignIn(...args),
        },
    },
}));

describe("Home (login page)", () => {
    it("renders the welcome title", () => {
        render(<Home />);
        expect(screen.getByText("Welcome")).toBeInTheDocument();
    });

    it("renders the sign-in description", () => {
        render(<Home />);
        expect(
            screen.getByText(/sign in with your github account/i),
        ).toBeInTheDocument();
    });

    it("renders the GitHub sign-in button", () => {
        render(<Home />);
        expect(
            screen.getByRole("button", { name: /sign in with github/i }),
        ).toBeInTheDocument();
    });

    it("calls signIn.social with github when button clicked", async () => {
        render(<Home />);

        await userEvent.click(
            screen.getByRole("button", { name: /sign in with github/i }),
        );
        expect(mockSocialSignIn).toHaveBeenCalledWith({
            provider: "github",
            callbackURL: "/dashboard",
        });
    });

    it("renders the theme toggle", () => {
        render(<Home />);
        expect(
            screen.getByRole("button", { name: /toggle theme/i }),
        ).toBeInTheDocument();
    });

    it("renders accessible loading spinner when session is pending", () => {
        mockUseSession.mockReturnValueOnce({ data: null, isPending: true });
        render(<Home />);
        expect(
            screen.getByRole("status", { name: /loading/i }),
        ).toBeInTheDocument();
    });
});
