/**
 * Spline scene URLs from env. Set in .env.local to enable 3D backgrounds.
 * Use Export → Code Export in Spline to get scene.splinecode URLs.
 */
export const SPLINE_HERO_URL =
  typeof process.env.NEXT_PUBLIC_SPLINE_HERO_URL === 'string'
    ? process.env.NEXT_PUBLIC_SPLINE_HERO_URL
    : '';

export const SPLINE_PAGES_URL =
  typeof process.env.NEXT_PUBLIC_SPLINE_PAGES_URL === 'string'
    ? process.env.NEXT_PUBLIC_SPLINE_PAGES_URL
    : '';
