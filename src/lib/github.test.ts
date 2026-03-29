import { describe, expect, it, vi } from "vitest";

const { mockGet, mockClose, mockPrepare } = vi.hoisted(() => {
    const mockGet = vi.fn();
    const mockClose = vi.fn();
    const mockPrepare = vi.fn(() => ({ get: mockGet }));
    return { mockGet, mockClose, mockPrepare };
});

vi.mock("better-sqlite3", () => ({
    // biome-ignore lint/complexity/useArrowFunction: Regular function required for `new` constructor mock
    default: vi.fn(function () {
        return {
            prepare: mockPrepare,
            close: mockClose,
        };
    }),
}));

import Database from "better-sqlite3";
import { fetchUserRepos, getGitHubAccessToken } from "@/lib/github";

describe("getGitHubAccessToken", () => {
    it("returns the access token when found", () => {
        mockGet.mockReturnValueOnce({ accessToken: "ghp_test123" });

        const token = getGitHubAccessToken("user-1");

        expect(token).toBe("ghp_test123");
        expect(Database).toHaveBeenCalledWith("sqlite.db", { readonly: true });
        expect(mockClose).toHaveBeenCalled();
    });

    it("returns null when no account found", () => {
        mockGet.mockReturnValueOnce(undefined);

        const token = getGitHubAccessToken("user-2");

        expect(token).toBeNull();
    });

    it("returns null when database error occurs", () => {
        vi.mocked(Database).mockImplementationOnce(() => {
            throw new Error("SQLITE_CANTOPEN");
        });

        const token = getGitHubAccessToken("user-3");

        expect(token).toBeNull();
    });
});

describe("fetchUserRepos", () => {
    it("fetches repos from GitHub API", async () => {
        const mockRepos = [
            { id: 1, name: "repo1" },
            { id: 2, name: "repo2" },
        ];

        global.fetch = vi.fn().mockResolvedValueOnce({
            ok: true,
            json: () => Promise.resolve(mockRepos),
        });

        const repos = await fetchUserRepos("ghp_test123");

        expect(repos).toEqual(mockRepos);
        expect(global.fetch).toHaveBeenCalledWith(
            "https://api.github.com/user/repos?type=owner&sort=updated&per_page=100",
            {
                headers: {
                    Authorization: "Bearer ghp_test123",
                    Accept: "application/vnd.github.v3+json",
                },
            },
        );
    });

    it("returns empty array on API error", async () => {
        global.fetch = vi.fn().mockResolvedValueOnce({
            ok: false,
            status: 401,
            statusText: "Unauthorized",
        });

        const repos = await fetchUserRepos("bad_token");

        expect(repos).toEqual([]);
    });
});
