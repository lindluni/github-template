"use client";

import { GitFork, Star } from "lucide-react";
import { Header } from "@/components/header";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import type { GitHubRepo } from "@/lib/github";

interface DashboardContentProps {
    repos: GitHubRepo[];
}

export function DashboardContent({ repos }: DashboardContentProps) {
    return (
        <div className="flex min-h-screen flex-col">
            <Header />
            <main className="flex-1 container mx-auto p-6">
                <h1 className="text-3xl font-bold mb-6">Your Repositories</h1>
                {repos.length === 0 ? (
                    <p className="text-muted-foreground">
                        No repositories found.
                    </p>
                ) : (
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {repos.map((repo) => (
                            <a
                                key={repo.id}
                                href={repo.html_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="block"
                            >
                                <Card className="h-full transition-colors hover:bg-muted/50">
                                    <CardHeader>
                                        <div className="flex items-center gap-2">
                                            <CardTitle>{repo.name}</CardTitle>
                                            <span className="text-xs font-normal px-2 py-0.5 rounded-full bg-muted text-muted-foreground">
                                                {repo.visibility}
                                            </span>
                                        </div>
                                        {repo.description && (
                                            <CardDescription className="line-clamp-2">
                                                {repo.description}
                                            </CardDescription>
                                        )}
                                    </CardHeader>
                                    <CardContent>
                                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                            {repo.language && (
                                                <span>{repo.language}</span>
                                            )}
                                            {repo.stargazers_count > 0 && (
                                                <span className="flex items-center gap-1">
                                                    <Star className="h-3.5 w-3.5" />
                                                    {repo.stargazers_count}
                                                </span>
                                            )}
                                            {repo.forks_count > 0 && (
                                                <span className="flex items-center gap-1">
                                                    <GitFork className="h-3.5 w-3.5" />
                                                    {repo.forks_count}
                                                </span>
                                            )}
                                        </div>
                                    </CardContent>
                                </Card>
                            </a>
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
}
