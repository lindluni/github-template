import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { DashboardContent } from "@/app/dashboard/dashboard-content";
import type { GitHubRepo } from "@/lib/github";

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

const mockRepos: GitHubRepo[] = [
    {
        id: 1,
        name: "my-project",
        full_name: "jane/my-project",
        description: "A cool project",
        html_url: "https://github.com/jane/my-project",
        language: "TypeScript",
        stargazers_count: 42,
        forks_count: 5,
        updated_at: "2024-01-01T00:00:00Z",
        visibility: "public",
        fork: false,
        private: false,
    },
    {
        id: 2,
        name: "private-repo",
        full_name: "jane/private-repo",
        description: null,
        html_url: "https://github.com/jane/private-repo",
        language: "Python",
        stargazers_count: 0,
        forks_count: 0,
        updated_at: "2024-01-02T00:00:00Z",
        visibility: "private",
        fork: false,
        private: true,
    },
];

describe("DashboardContent", () => {
    it("renders the repositories heading", () => {
        render(<DashboardContent repos={mockRepos} />);
        expect(
            screen.getByRole("heading", { name: "Your Repositories" }),
        ).toBeInTheDocument();
    });

    it("displays repository names", () => {
        render(<DashboardContent repos={mockRepos} />);
        expect(screen.getByText("my-project")).toBeInTheDocument();
        expect(screen.getByText("private-repo")).toBeInTheDocument();
    });

    it("displays repository descriptions", () => {
        render(<DashboardContent repos={mockRepos} />);
        expect(screen.getByText("A cool project")).toBeInTheDocument();
    });

    it("displays repository visibility badges", () => {
        render(<DashboardContent repos={mockRepos} />);
        expect(screen.getByText("public")).toBeInTheDocument();
        expect(screen.getByText("private")).toBeInTheDocument();
    });

    it("displays repository language", () => {
        render(<DashboardContent repos={mockRepos} />);
        expect(screen.getByText("TypeScript")).toBeInTheDocument();
        expect(screen.getByText("Python")).toBeInTheDocument();
    });

    it("displays star count when greater than zero", () => {
        render(<DashboardContent repos={mockRepos} />);
        expect(screen.getByText("42")).toBeInTheDocument();
    });

    it("displays fork count when greater than zero", () => {
        render(<DashboardContent repos={mockRepos} />);
        expect(screen.getByText("5")).toBeInTheDocument();
    });

    it("links to the repository on GitHub", () => {
        render(<DashboardContent repos={mockRepos} />);
        const links = screen.getAllByRole("link");
        const repoLink = links.find(
            (link) =>
                link.getAttribute("href") ===
                "https://github.com/jane/my-project",
        );
        expect(repoLink).toBeInTheDocument();
        expect(repoLink).toHaveAttribute("target", "_blank");
    });

    it("shows empty state when no repos", () => {
        render(<DashboardContent repos={[]} />);
        expect(screen.getByText("No repositories found.")).toBeInTheDocument();
    });
});
