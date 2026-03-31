# ShopCursor Workshop — Interactive Presentation Site

An interactive, DD-branded webpage for the 2-day Cursor IDE training workshop. Use it as a live presentation during the workshop, a reference guide, and a progress tracker.

## Quick Start

### Option 1: Open Directly

```bash
open workshop-site/index.html
```

Double-click `index.html` or open it in any modern browser (Chrome, Firefox, Safari, Edge).

### Option 2: Local Server (for live-reload)

```bash
cd workshop-site
npx serve .
```

Then open http://localhost:3000.

## How to Use

### As a Presentation

1. Open the page in your browser
2. Click **"Presentation Mode"** on the cover slide (or the **"Present"** button in the nav bar)
3. Navigate between sections:
   - **Arrow keys** (Up/Down or Left/Right) — Previous/Next section
   - **Spacebar** — Next section
   - **Escape** — Exit presentation mode
   - **On-screen controls** — Arrow buttons in the bottom-right corner
4. Each section fills the full viewport for projector-friendly display
5. Press **Escape** or click the **X** button to return to normal view

### As a Reference Guide

Scroll through the page normally. It covers:

- **Overview** — ShopCursor app architecture, tech stack, quick start commands
- **Day 1** — AI fundamentals, prompt engineering, Cursor IDE features, Agent Mode
- **Day 2** — MCP, Skills, Commands, Subagents, Hooks, Playwright testing, AI governance
- **Ecosystem** — The `.cursor/` directory breakdown with comparison tables
- **API Reference** — All ShopCursor REST endpoints

Use the sticky navigation bar to jump between sections.

### As a Progress Tracker

1. Scroll to the **"Workshop Checklist"** section (or click "Track Progress" on the cover)
2. Check off topics as you cover them during the workshop
3. Each group shows its own completion count (e.g., "3/6")
4. The overall progress bar at the top updates in real time
5. **Progress is saved in your browser** (localStorage) — it persists across refreshes and browser restarts
6. To reset progress: clear your browser's localStorage for this page

## Branding

The site follows **Deloitte Digital "Create Great"** brand guidelines:

- **Collection**: Modern (clean, minimal, geometric)
- **Theme**: Theme 1
- **Typography**: Open Sans (Light for headlines, ExtraBold Italic uppercase for labels, Light/Regular for body)
- **Colors**: DD primary palette (Off-white `#F2F2F2`, Black 70% `#4D4D4D`, Deloitte Green `#046A38`, Green 6 `#86BC25`)
- **Orb motif**: CSS-generated geometric orb on the cover (approximates the Modern collection style)

## Structure

```
workshop-site/
├── index.html    # Single-file interactive webpage (HTML + CSS + JS)
└── README.md     # This file
```

The site is a single self-contained HTML file with no build step and no external dependencies (except Google Fonts for Open Sans). It works offline after the first load.

## Customization

- **Add topics**: Add new `<li class="checklist-item" data-id="unique-id">` elements to the checklist section
- **Edit content**: All workshop content is in the HTML — search for section IDs (`#session1`, `#session3`, etc.)
- **Change theme colors**: Modify the CSS custom properties in the `:root` block at the top of the `<style>` tag
