import type { NextRequest } from "next/server";
import { describe, expect, it, vi } from "vitest";
import { config, proxy } from "@/proxy";

vi.mock("better-auth/cookies", () => ({
    getSessionCookie: vi.fn(),
}));

import { getSessionCookie } from "better-auth/cookies";

const mockGetSessionCookie = vi.mocked(getSessionCookie);

function makeRequest(url: string) {
    return new Request(url) as unknown as NextRequest;
}

describe("proxy", () => {
    it("redirects to / when no session cookie exists", async () => {
        mockGetSessionCookie.mockReturnValue(null);

        const request = makeRequest("http://localhost:3000/dashboard");
        const response = await proxy(request);

        expect(response.status).toBe(307);
        expect(new URL(response.headers.get("location")!).pathname).toBe("/");
    });

    it("allows request through when session cookie exists", async () => {
        mockGetSessionCookie.mockReturnValue(
            "session-token-value" as unknown as ReturnType<
                typeof getSessionCookie
            >,
        );

        const request = makeRequest("http://localhost:3000/dashboard");
        const response = await proxy(request);

        expect(response.headers.get("location")).toBeNull();
    });

    it("matches /dashboard routes", () => {
        expect(config.matcher).toContain("/dashboard/:path*");
    });
});
