# Cloth Store — Design System

Extracted from the Figma file: **Cloth Store | Fashion Store | E-commerce UI Kit (Community)**

## Files

| File | Purpose |
|------|---------|
| `tokens.json` | Raw design tokens (colors, typography, spacing) — machine-readable |
| `variables.css` | CSS custom properties for all tokens |
| `typography.css` | Typography utility classes with full font stack |
| `components.css` | Component-level styles (nav, hero, cards, cart, checkout, footer) |

## Color Palette

| Token | Hex | Usage |
|-------|-----|-------|
| `--color-black` | `#000000` | Headlines, primary text |
| `--color-dark` | `#121212` | Footer background, dark sections |
| `--color-charcoal` | `#272727` | Secondary headings |
| `--color-cream` | `#eae8d9` | Warm section backgrounds |
| `--color-cream-light` | `#ebe7db` | Hero / card backgrounds |
| `--color-neutral-50` | `#f5f5f5` | Light backgrounds |
| `--color-neutral-200` | `#d9d9d9` | Borders, dividers |
| `--color-neutral-500` | `#8a8a8a` | Captions, secondary text |
| `--color-accent-red` | `#e51515` | Sale badges, errors |
| `--color-accent-navy` | `#000d8a` | Blue accent |
| `--color-white` | `#ffffff` | Backgrounds, text on dark |

## Typography

**Primary typeface:** Beatrice (Sharp Type) — commercial font, requires license.

| Variant | Usage |
|---------|-------|
| Beatrice Display Trial | Large logo/branding text |
| Beatrice Headline Trial | Display headings on typography page |
| Beatrice Deck Trial | Body copy, navigation, UI text |
| Beatrice Trial | Captions, descriptions, form labels |
| Inter | Utility text, copyright, footer |

**Type Scale:** 9px → 10px → 11px → 12px → 13px → 14px → 16px → 20px → 32px → 48px → 128px → 200px

## Design Characteristics

- **Aesthetic:** Minimalist, high-fashion editorial
- **Border radius:** None (0px) — sharp edges throughout
- **Shadows:** None — flat design
- **Layout:** Desktop at 1280px, mobile at 393px (iPhone 14/15 Pro)
- **Spacing:** 4px base unit, scale: 4 / 8 / 12 / 16 / 20 / 24 / 32 / 40 / 48 / 64 / 80

## Pages in Figma

| Page | Content |
|------|---------|
| Home (hero) | Hero section with season tag, collection title, featured product |
| Home (full) | Full homepage with footer, product sections |
| Products (list) | Product grid with sidebar filters (size, availability) |
| Product detail | Single product view with size selector, description |
| Checkout | Multi-step form (contact, shipping, payment) |
| Cart / Shopping bag | Cart sidebar with item list, totals |
| Mobile variants | iPhone mockups for key pages |
