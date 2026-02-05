import { defineRouting } from 'next-intl/routing';
import { createNavigation } from 'next-intl/navigation';

export const routing = defineRouting({
    // A list of all locales that are supported
    locales: ['en', 'es'],

    // Used when no locale matches
    defaultLocale: 'en',

    // The `pathnames` object holds the mapping from the 
    // default (untranslated) pathnames to the localized ones.
    pathnames: {
        '/': '/',
        '/dashboard': {
            en: '/home',
            es: '/inicio'
        },
        '/numerology': {
            en: '/numerology',
            es: '/numerologia'
        },
        '/tarot': {
            en: '/tarot',
            es: '/tarot'
        },
        '/astrology': {
            en: '/astrology',
            es: '/astrologia'
        },
        '/missions': {
            en: '/missions',
            es: '/misiones'
        },
        '/historial': {
            en: '/history',
            es: '/historial'
        },
        '/purchase': {
            en: '/purchase',
            es: '/comprar'
        },
        '/login': '/login',
        '/dashboard/profile': '/dashboard/profile',
        '/dashboard/profile/reset-password': '/dashboard/profile/reset-password'
    }
});

// Lightweight wrappers around Next.js' navigation APIs
// that will consider the routing configuration
export type Locale = (typeof routing.locales)[number];
export const { Link, redirect, usePathname, useRouter } =
    createNavigation(routing);
