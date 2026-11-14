# Meadow in this project

This project uses the Meadow design system (React + TypeScript), in `src/meadow/` (copied from the Meadow repository). Read `src/meadow/system.md` before building any UI and follow it.

- Vibe for this app: **clean** (airy, near-white, muted teal-blue, plain geometric icons). Never mix vibes.
- Wrap the app root: `<MeadowProvider vibe="clean"><ToastProvider><App /></ToastProvider></MeadowProvider>`, and import `src/meadow/styles/index.css` once.
- Build ALL UI with Meadow components imported from `src/meadow` (barrel `index.ts`): Screen, GlassCard, StatCard, List/ListRow, Button, IconButton, Toggle, Segmented, Tabs, TabBar, Sheet, ConfirmDialog, MenuButton, Banner, Chip, EmptyState, TextField, Skeleton, useToast, Icon, and so on.
- Do not write your own buttons, cards, inputs, menus or color values. Use tokens (CSS variables) only; no raw hex, no one-off radii or shadows. Do not use shadcn/ui, lucide-react or emoji where Meadow has an equivalent.
- One filled primary Button per view. Every screen handles loading (Skeleton), empty (EmptyState), error (Banner danger with Retry), offline (Banner warning) and success (toast). Sentence-case, calm copy, no exclamation marks.
- Mobile first; check 390 px width. No internal scrolling regions for content that scrolls with the page. Menus use MenuButton.
- Do not edit files in `src/meadow/`. If something is missing, tell the user so it can be added to the design system.
