"use client";

import { ThemeToggle } from "@/components/theme-toggle";
import { UserMenu } from "@/components/user-menu";
import { authClient } from "@/lib/auth-client";

export function Header() {
    const { data: session } = authClient.useSession();

    return (
        <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container mx-auto flex h-14 items-center justify-between px-4">
                <div className="flex items-center gap-2 font-semibold">
                    <span>GitHub Template</span>
                </div>
                <div className="flex items-center gap-2">
                    <ThemeToggle />
                    {session?.user && <UserMenu user={session.user} />}
                </div>
            </div>
        </header>
    );
}
