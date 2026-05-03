export const colors = {
    // Backgrounds
    bg: {
        base: '#0F0F14',      // deepest background
        surface: '#1E1E2E',   // cards, containers
        border: '#3A3A5C',    // borders, dividers
    },

    // Text
    text: {
        primary: '#EAEAF5',   // main readable text
        secondary: '#6E6E9A', // labels, captions
        muted: '#5A5A8A',     // placeholders, disabled
        inverse: '#1A1A2E',   // text on light backgrounds
    },

    // Brand
    brand: {
        google: '#4285F4',
    },

    // Accent — Lidless Eye & mould theme
    accent: {
        eye: '#C4821A',        // amber glow of the lidless eye
        eyeDark: '#3D2008',    // deep iris
        mould: '#2D5A27',      // dark mould spore body
        mouldLight: '#3D7A35', // spore satellite bumps
    },

    // Neutral
    white: '#FFFFFF',
} as const;

export type Colors = typeof colors;
