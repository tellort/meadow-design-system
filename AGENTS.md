# Meadow in this project

This project uses the Meadow design system (React + TypeScript), in `src/meadow/` (copied from the Meadow repository). Read `src/meadow/system.md` before building any UI and follow it.

- Vibe for this app: **clean** (airy, near-white, muted teal-blue, plain geometric icons). Never mix vibes.
- Wrap the app root: `<MeadowProvider vibe="clean"><ToastProvider><App /></ToastProvider></MeadowProvider>`, and import `src/meadow/styles/index.css` once.
- Build ALL UI with Meadow components imported from `src/meadow` (barrel `index.ts`): Screen, GlassCard, StatCard, List/ListRow, Button, IconButton, Toggle, Segmented, Tabs, TabBar, Sheet, ConfirmDialog, MenuButton, Banner, Chip, EmptyState, TextField, Skeleton, useToast, Icon, and so on.
- Do not write your own buttons, cards, inputs, menus or color values. Use tokens (CSS variables) only; no raw hex, no one-off radii or shadows. Do not use shadcn/ui, lucide-react or emoji where Meadow has an equivalent.
- One filled primary Button per view. Every screen handles loading (Skeleton), empty (EmptyState), error (Banner danger with Retry), offline (Banner warning) and success (toast). Sentence-case, calm copy, no exclamation marks.
- Mobile first; check 390 px width. No internal scrolling regions for content that scrolls with the page. Menus use MenuButton.
- Never edit `src/meadow/` inside an app. The design system has one source: https://github.com/tellort/meadow-design-system. If a component, token or icon is missing or needs a change, change it in a separate clone of that repository, never in the app copy:
  1. Clone it next to the app (for example `../meadow-design-system`) and create a branch `agent/<short-topic>`.
  2. Make the change there. Keep the API backward compatible, follow `system.md`, and add the change to `CHANGELOG.md` under a new version (patch for fixes, minor for new things) and bump `package.json`.
  3. Run `npm install`, `npm run typecheck` and `npm run build` in the clone. Fix errors before continuing.
  4. Commit, push the branch, and open a pull request with `gh pr create` (clear title, short description of what and why). Never push to `main` directly.
  5. Tell the user in the chat what changed and which pull request it is, and ask: "Merge this pull request into the design system?" Merge only after the user clearly says yes in the chat: `gh pr merge <number> --squash --delete-branch`, then `git tag v<version>` on main and `git push --tags` (after `git checkout main && git pull`). If the user says no, leave the pull request open.
  6. Copy the changed files from the clone into the app's `src/meadow/` so the app works now (do this even before the merge, and keep them identical to the pull request).

