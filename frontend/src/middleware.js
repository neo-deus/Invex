import { NextRequest, NextResponse } from "next/server";

export async function middleware(request) {
    const path = request.nextUrl.pathname;
    const publicPaths = ['/login', '/signup', '/verifyemail','/passwordreset'];
    const token = request.cookies.get("token");

    if (publicPaths.includes(path) && token) {
        // Redirect logged-in users away from public pages like login or signup to the home page
        return NextResponse.redirect(new URL('/', request.nextUrl));
    }

    if (!publicPaths.includes(path) && !token) {
        // If the user is not logged in and is trying to access a protected route, redirect to login
        return NextResponse.redirect(new URL('/login', request.nextUrl));
    }

    // Continue with the response chain normally if none of the conditions are met
    return NextResponse.next();
}

export const config = {
    matcher: [
        '/',
        '/profile',
        '/login',
        '/signup',
        '/verifyemail'
    ]
};
