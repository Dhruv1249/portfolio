# Tech Portfolio (Desktop OS Experience)

Interactive portfolio built as a keyboard-first Linux desktop simulation.

## Features

- Tiling window manager style workspace with multiple apps
- Theme profiles, particle backgrounds, and glass transparency effects
- Terminal with custom command system and app launch integration
- Code Editor app (Neovim powered UI)
- File Manager connected to GitHub project trees
- Email app with Contact API route for direct outreach
- Automatic mobile redirect to non-tech portfolio

## Stack

- Next.js 16 (App Router)
- React 19 + TypeScript
- Framer Motion
- MongoDB (feature flags/settings)
- EmailJS Node SDK (`@emailjs/nodejs`)

## Getting Started

```bash
npm install
npm run dev
```

Open http://localhost:3000.

## Environment Variables

Create/update `.env` with:

```env
MONGO_DB_CONNECTION_URI=...
NEXT_PUBLIC_NON_TECH_PORTFOLIO_URL=...
EMAILJS_SERVICE_ID=...
EMAILJS_TEMPLATE_ID=...
EMAILJS_PUBLIC_KEY=...
EMAILJS_PRIVATE_KEY=...
```

## Keyboard Shortcuts

- `Alt + Enter`: Terminal
- `Alt + B`: Browser
- `Alt + F`: File Manager
- `Alt + N`: Code Editor
- `Alt + E`: Email
- `Alt + S`: Settings
- `Alt + Space`: App Launcher
- `Alt + W`: Close focused window
- `Alt + 1-4`: Switch workspace

## Terminal Editor Commands

- `vim`, `nvim`, `neovim` -> opens Code Editor app
- `nano` -> suggests using `nvim`

## Notes

- App-wide config values live in `app/lib/editor-config.json`.
- Mobile users are redirected to the non-tech portfolio URL.
