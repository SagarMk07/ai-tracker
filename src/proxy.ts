import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function proxy(request: NextRequest) {
    console.log("Proxy executing for:", request.nextUrl.pathname);
    let response = NextResponse.next({
        request: {
            headers: request.headers,
        },
    });

    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL || "https://example.supabase.co",
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "dummy-key",
        {
            cookies: {
                get(name: string) {
                    return request.cookies.get(name)?.value;
                },
                set(name: string, value: string, options: CookieOptions) {
                    request.cookies.set({ name, value, ...options });
                    response = NextResponse.next({
                        request: {
                            headers: request.headers,
                        },
                    });
                    response.cookies.set({ name, value, ...options });
                },
                remove(name: string, options: CookieOptions) {
                    request.cookies.set({ name, value: "", ...options });
                    response = NextResponse.next({
                        request: {
                            headers: request.headers,
                        },
                    });
                    response.cookies.set({ name, value: "", ...options });
                },
            },
        }
    );

    try {
        const {
            data: { session },
        } = await supabase.auth.getSession();

        // Protected Routes Logic
        const url = request.nextUrl.clone();

        if (!session && (url.pathname.startsWith("/dashboard") || url.pathname.startsWith("/focus") || url.pathname.startsWith("/settings"))) {
            return NextResponse.redirect(new URL("/login", request.url));
        }

        // Auth Routes Logic (Redirect logged in users away from login)
        if (session && url.pathname === "/login") {
            return NextResponse.redirect(new URL("/dashboard", request.url));
        }

        return response;
    } catch (error) {
        console.error("Middleware PROXY CRASH:", error);
        return response; // Fallback to let the request proceed to the page for better error reporting
    }
}

export const config = {
    matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
