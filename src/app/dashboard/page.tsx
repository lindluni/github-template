import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { fetchUserRepos, getGitHubAccessToken } from "@/lib/github";
import { DashboardContent } from "./dashboard-content";

export default async function DashboardPage() {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (!session) {
        redirect("/");
    }

    const accessToken = getGitHubAccessToken(session.user.id);
    const repos = accessToken ? await fetchUserRepos(accessToken) : [];

    return <DashboardContent repos={repos} />;
}
