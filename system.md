# Meadow design system

Meadow is a calm, light-only React design system. Frosted glass over a softly colored backdrop, fully rounded shapes, quiet gradients, springy motion, and a hand-made layer so nothing feels machine-stamped. It is meant for every kind of app: wellness, money, productivity, home, creative tools, dashboards.

## Installation notes for the connected project
1. Import everything from the design system barrel (`src/design-system/<slug>`), never from the files inside it.
2. Wrap the app root once, in this order:
   ```tsx
   <MeadowProvider vibe="personal">   {/* or "clean" */}
     <ToastProvider>
       <App />
     </ToastProvider>
   </MeadowProvider>
   ```
   MeadowProvider sets `data-theme` on `<html>`, adds the glass backdrop to `<body>`, mounts the icon filters and wires sound and haptics. Do not set colors on `html` or `body` yourself.
3. The styles (`src/styles/index.css`) are imported by the barrel. Fonts (Fraunces and Figtree) load from Google Fonts in that stylesheet.
4. Merge `tailwind.config.ts` `theme.extend` into the project's Tailwind config if the project uses Tailwind, so classes such as `bg-glass`, `text-ink-soft`, `rounded-lg`, `shadow-glass`, `font-display` and `bg-action` exist. All values are CSS variables, so both vibes work.
5. If the project has shadcn/ui, do not use its Button, Card, Input, Switch, Tabs, Dialog or Sheet where Meadow has a component. Use Meadow's.

## Two vibes (pick one per app, never mix)
- **personal**: warm and hand-made. Hand-drawn icons with pastel off-print fills, scalloped hero card edge, organic blob behind the big number, faint paper grain, sand scribble underline. Best for lifestyle, wellness, home and personal tools.
- **clean**: airy, near-white, muted teal-blue accent, plain geometric icons, no flourishes. Best for finance, productivity, dashboards and work tools.
Both use identical components and tokens; only values and flourishes change. Switch with `MeadowProvider vibe` or `useMeadow().setVibe`.

## Building screens
- Root every page in `<Screen>`; use `<Screen.Grid>` for the responsive card grid (one column on phones, two from 600px, three from 1024px, max width 1120px).
- Put content in `GlassCard`; one idea per card, one `StatCard` as the hero of a dashboard. Group rows in `List` with `ListRow`.
- One filled `Button variant="primary"` per view. Secondary actions use `glass`, quiet ones `ghost`, destructive ones `danger` with a `ConfirmDialog`.
- Navigation: `TabBar` (3 to 5 items) floating at the bottom on phones; `TabBar side` as a sidebar on tablet and desktop. `TopBar` for titles. `Tabs` or `Segmented` switch views of the same content.
- Secondary content opens in a `Sheet` on phones and a `Sheet variant="dialog"` or `Drawer` on larger screens. Never open a sheet from a sheet.
- Forms: one column, `TextField` with a visible label, errors with an icon and a fix-it sentence, primary button at the bottom.
- Every screen handles loading (`Skeleton`), empty (`EmptyState`), error (`Banner kind="danger"` with a Retry), offline (`Banner kind="warning"`) and success (`useToast`).
- Status is never color alone: `Chip` and `Banner` always include an icon and words.
- Copy: sentence case, calm, short, no exclamation marks, verb-first buttons ("Save routine"), past tense for confirmations ("Routine saved").

## Component choice
| Need | Use |
| --- | --- |
| A main action | `Button` (primary), `Fab` for the one create action |
| Icon-only action | `IconButton` (always pass `label`) |
| On/off setting that applies instantly | `Toggle` |
| Yes/no choice in a form | `Checkbox`; one of a few: `Radio`; one of many: `Select` |
| Pick a value in a range | `Slider`; small whole numbers: `Stepper` |
| Text input | `TextField`, `TextArea`, `SearchField` |
| Switch between 2 to 4 views | `Segmented`; sibling views of a screen: `Tabs` |
| List of items | `List` + `ListRow` |
| Big number with context | `StatCard` + `Sparkline` |
| Bars | `BarChart` (one series, highlight one value) |
| Temporary content | `Sheet`, `Drawer`, `ConfirmDialog`, `MenuButton` |
| Feedback | `useToast`, `Banner`, `Progress`, `Chip`, `Badge` |
| Messaging | `Chat`, `ChatBubble`, `TypingIndicator` |
| Table (tablet and desktop) | `Table`; on phones use `ListRow` |

## Icons
Use `<Icon name="bell" />` (73 icons, outline, 1.75px, colored by `currentColor`). Inside `List` and `TabBar` the tints are chosen automatically: natural color first (leaf, check-circle, shield = mint; moon, wifi, globe, image = sky; sun, bulb, bolt, star, gift, tag, bell, wallet = sand; heart, thermometer = blush), otherwise the next of aqua, mint, sky, sand; neighbours never share a tint. For other groups use `iconTints(names)` and pass `tint`. Spot illustrations: `<Art name="sprout" />` for empty states and onboarding. Do not use lucide-react or emoji where a Meadow icon exists.

## Tokens (CSS variables in `src/styles/tokens.css`)
Color: `--canvas`, `--ink`, `--ink-soft`, `--ink-muted`, `--action`, `--action-end`, `--glass`, `--glass-strong`, `--glass-sheet`, `--line`, `--line-strong`, `--focus`, status pairs `--success`/`--success-bg`, `--warning`/`--warning-bg`, `--danger`/`--danger-bg`; decorative only: `--leaf-300`, `--lagoon-300`, `--sand-400`. Gradients: `--gradient-action`, `--gradient-aqua`, `--backdrop-meadow`. Spacing `--space-1..12` (4, 8, 12, 16, 20, 24, 32, 40, 48). Radius `--radius-sm` 12, `-md` 16, `-lg` 22, `-xl` 28, `-pill` 999. Shadow `--shadow-glass|float|sheet|button|knob`. Motion `--dur-fast` 120ms, `--dur-base` 240ms, `--dur-enter` 360ms, `--dur-slow` 420ms; `--ease-soft`, `--ease-spring`. Type: `--font-display` (Fraunces, numbers and titles), `--font-sans` (Figtree).
Never write raw hex colors, one-off radii or shadows in app code; use tokens or the components.

## Motion and feedback
Press scales to 0.97; on pointer devices things grow slightly on hover; toggles and sliding pills spring; sheets rise from below while the screen behind softens; lists fade and rise one after another (`className="m-stagger"` on the container). Honor reduced motion and reduced transparency (built in). Sound is off by default and only after a user gesture (`MeadowProvider sound`); haptics follow the system setting; feedback is never the only signal.

## Accessibility
Text contrast 4.5:1 in both vibes (audited), visible focus ring on everything interactive, touch targets 44px or more, real HTML elements, labels on every field and icon button, `aria-pressed`, `aria-checked`, `aria-selected`, `aria-current` where components need them (already built in).

## Do not
Square corners, flat white pages with gray borders, pure black text, purple-blue gradients, emoji as decoration, more than one filled primary button per view, mixing the two vibes, custom buttons or cards where a Meadow component exists, raw hex colors.
