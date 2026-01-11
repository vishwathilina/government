import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Paths that don't require employee authentication
const employeePublicPaths = ['/login', '/forgot-password', '/reset-password', '/auth', '/customer', '/'];

// Paths that should redirect authenticated employees to dashboard
const employeeAuthPaths = ['/login'];

/**
 * Middleware for protecting both customer and employee routes
 * 
 * This middleware:
 * 1. Checks if customer is authenticated for /customer/* routes
 * 2. Checks if employee is authenticated for /dashboard/* and other protected routes
 * 3. Redirects to appropriate login page if not authenticated
 */
export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // ===== CUSTOMER AUTHENTICATION =====
    // Check if this is a customer route
    if (pathname.startsWith('/customer')) {
        // Exclude login and public pages
        const publicCustomerPages = [
            '/auth/customer-login',
            '/customer/register',
            '/customer/forgot-password',
            '/customer/reset-password',
        ];

        // Allow access to public pages
        if (publicCustomerPages.some(page => pathname.startsWith(page))) {
            return NextResponse.next();
        }

        // Check for customer token in cookies (set by client-side)
        const customerToken = request.cookies.get('customerToken')?.value;

        // If no token, redirect to login
        if (!customerToken) {
            const loginUrl = new URL('/auth/customer-login', request.url);
            loginUrl.searchParams.set('redirect', pathname);
            return NextResponse.redirect(loginUrl);
        }

        // Token exists, allow access
        return NextResponse.next();
    }

    // ===== EMPLOYEE AUTHENTICATION =====
    const employeeToken = request.cookies.get('auth_token')?.value;

    // Check if the path is public for employees
    const isEmployeePublicPath = employeePublicPaths.some(
        (path) => pathname === path || pathname.startsWith(path + '/')
    );

    // Check if the path is an auth path (login, etc.)
    const isEmployeeAuthPath = employeeAuthPaths.some(
        (path) => pathname === path || pathname.startsWith(path + '/')
    );

    // If employee is authenticated and tries to access auth pages, redirect to dashboard
    if (employeeToken && isEmployeeAuthPath) {
        return NextResponse.redirect(new URL('/dashboard', request.url));
    }

    // If employee is not authenticated and tries to access protected pages, redirect to login
    if (!employeeToken && !isEmployeePublicPath) {
        const loginUrl = new URL('/login', request.url);
        loginUrl.searchParams.set('redirect', pathname);
        return NextResponse.redirect(loginUrl);
    }

    return NextResponse.next();
}

/**
 * Configure which routes this middleware applies to
 */
export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - api (API routes)
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         * - public files (images, etc.)
         */
        '/((?!api|_next/static|_next/image|favicon.ico|.*\\.png$|.*\\.jpg$|.*\\.svg$).*)',
    ],
};
