import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { DashboardContent } from "@/app/dashboard/dashboard-content";

vi.mock("next-themes", () => ({
    useTheme: () => ({
        setTheme: vi.fn(),
        resolvedTheme: "light",
    }),
}));

vi.mock("next/navigation", () => ({
    useRouter: () => ({
        push: vi.fn(),
    }),
}));

vi.mock("@/lib/auth-client", () => ({
    authClient: {
        useSession: () => ({ data: null, isPending: false }),
        signOut: vi.fn(),
    },
}));

const mockUser = {
    id: "user-1",
    name: "Jane Doe",
    email: "jane@example.com",
    image: "https://example.com/avatar.jpg",
};

describe("DashboardContent", () => {
    it("renders the dashboard heading", () => {
        render(<DashboardContent user={mockUser} />);
        expect(
            screen.getByRole("heading", { name: "Dashboard" }),
        ).toBeInTheDocument();
    });

    it("displays the user name in the welcome card", () => {
        render(<DashboardContent user={mockUser} />);
        expect(screen.getByText(/signed in as Jane Doe/i)).toBeInTheDocument();
    });

    it("displays the user email", () => {
        render(<DashboardContent user={mockUser} />);
        expect(screen.getByText("jane@example.com")).toBeInTheDocument();
    });

    it("renders the get started card", () => {
        render(<DashboardContent user={mockUser} />);
        expect(screen.getByText("Get Started")).toBeInTheDocument();
    });
});
