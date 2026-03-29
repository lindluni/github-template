import Database from "better-sqlite3";

export interface GitHubRepo {
    id: number;
    name: string;
    full_name: string;
    description: string | null;
    html_url: string;
    language: string | null;
    stargazers_count: number;
    forks_count: number;
    updated_at: string;
    visibility: string;
    fork: boolean;
    private: boolean;
}

export function getGitHubAccessToken(userId: string): string | null {
    try {
        const db = new Database("sqlite.db", { readonly: true });
        try {
            const row = db
                .prepare(
                    "SELECT accessToken FROM account WHERE userId = ? AND providerId = 'github'",
                )
                .get(userId) as { accessToken: string } | undefined;
            return row?.accessToken ?? null;
        } finally {
            db.close();
        }
    } catch {
        return null;
    }
}

export async function fetchUserRepos(
    accessToken: string,
): Promise<GitHubRepo[]> {
    const response = await fetch(
        "https://api.github.com/user/repos?type=owner&sort=updated&per_page=100",
        {
            headers: {
                Authorization: `Bearer ${accessToken}`,
                Accept: "application/vnd.github.v3+json",
            },
        },
    );

    if (!response.ok) {
        console.error(
            `GitHub API error: ${response.status} ${response.statusText}`,
        );
        return [];
    }

    return response.json();
}
