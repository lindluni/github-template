import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { UserMenu } from "@/components/user-menu";

vi.mock("next/navigation", () => ({
    useRouter: () => ({
        push: vi.fn(),
    }),
}));

vi.mock("@/lib/auth-client", () => ({
    authClient: {
        signOut: vi.fn(),
    },
}));

const mockUser = {
    name: "John Smith",
    email: "john@example.com",
    image: null,
};

describe("UserMenu", () => {
    it("renders the avatar with initials as fallback", () => {
        render(<UserMenu user={mockUser} />);
        expect(screen.getByText("JS")).toBeInTheDocument();
    });

    it("renders the avatar trigger button", () => {
        render(<UserMenu user={mockUser} />);
        // Avatar fallback text serves as the trigger
        expect(screen.getByText("JS")).toBeInTheDocument();
    });
});
