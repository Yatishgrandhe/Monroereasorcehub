# Design System: Monroe Resource Hub
**Project ID:** monroe-resource-hub-local

## 1. Visual Theme & Atmosphere
The Monroe Resource Hub features a **Premium Dark Aesthetic** with a focus on trust, community, and clarity. The atmosphere is **Sophisticated yet Accessible**, utilizing deep navy backgrounds combined with glassmorphism and subtle gradients to create depth. It feels like a high-end digital concierge for community resources.

- **Mood:** Trustworthy, Modern, Fluid, and Premium.
- **Density:** Spaced out with generous padding (section-padding-sm/md/lg) to allow content to breathe.

## 2. Color Palette & Roles
*   **Deep Midnight Navy (#020617):** Primary background color for the entire application.
*   **Slate Grey (#94A3B8):** Used for secondary text, descriptions, and subtle UI borders.
*   **Pure White (#FFFFFF):** Used for primary headings and high-contrast text.
*   **Primary Indigo/Blue (#4F46E5):** Used for primary buttons and call-to-action accents.
*   **Emerald Green (#10B981):** Accent color for positive outcomes (e.g., Food Assistance category).
*   **Coral Red (#F43F5E):** Accent color for urgent needs (e.g., Housing/Family support).

## 3. Typography Rules
*   **Headings (Fraunces):** A premium serif font used for all H1-H6 headers. It communicates authority and elegance. H1s are exceptionally large and bold (black weight).
*   **Body (Manrope):** A clean, geometric sans-serif font used for all body text, navigation links, and descriptions. It ensures high readability.
*   **Letter Spacing:** Headers have tight letter spacing (-0.05em for H1) to feel "locked in," while body text has standard spacing for reading comfort.

## 4. Component Stylings
*   **Buttons:** 
    *   **Primary:** Pill-shaped or generously rounded (rounded-2xl), often featuring a gradient or solid indigo background with a subtle shadow.
    *   **Secondary/Outline:** Bordered with low-opacity white (white/10), using translucent backgrounds that respond to hover with a soft glow.
*   **Cards/Containers:** 
    *   **Glass Cards:** Utilize `backdrop-blur-xl` and `bg-white/[0.03]` with a thin `white/10` border. Corners are rounded at `24px`.
    *   **Bento Grid:** Information is organized into clean, rounded rectangles with varying sizes, often featuring spotlight effects or hover-induced elevation.
*   **Inputs/Forms:** 
    *   Sleek, dark inputs with `white/10` borders and `white/06` backgrounds. Focus state includes a soft indigo glow.

## 5. Layout Principles
*   **Whitespace:** Extremely generous. Sections are divided by significant vertical space to create a "scrolling journey."
*   **Margins/Gaps:** Consistent usage of `gap-6` for grids and `container-custom` (max-width 7xl) for centered alignment.
*   **Glassmorphism:** Ubiquitous use of translucent layers and backdrop blurs to signify hierarchy without using solid blocking colors.
