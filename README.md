# Meadow design system (React)

A calm, light-only React component library with two vibes (Personal and Clean). Built for Lovable's design system feature, and usable in any Vite + React + TypeScript project.

- `src/index.ts`: the public API (barrel). Import everything from here.
- `src/components/`: Button, IconButton, Fab, Link, Toggle, Checkbox, Radio, Slider, TextField, TextArea, Select, SearchField, Segmented, Tabs, FilterChip, Stepper, GlassCard, StatCard, List, ListRow, Sheet, ConfirmDialog, Menu, MenuButton, Accordion, Drawer, Chip, Badge, Banner, Progress, Skeleton, Spinner, EmptyState, Tooltip, Toast (ToastProvider, useToast), TabBar, TopBar, Breadcrumbs, Pagination, StepIndicator, Avatar, Table, Divider, Chat, ChatBubble, TypingIndicator, Timeline, Sparkline, BarChart, Screen, MeadowProvider.
- `src/icons/`: 73 icons in two styles and 4 spot illustrations (`Icon`, `Art`, `iconTints`).
- `src/styles/tokens.css`: all design tokens as CSS variables (both vibes).
- `src/styles/components.css`: component styles.
- `tailwind.config.ts`: the tokens as a Tailwind `theme.extend`.
- `system.md`: the design rules and usage guide that Lovable reads on every generation.
- `src/pages/Showcase.tsx` and `src/main.tsx`: a demo used to check the library (not part of the API).

Run the demo: `npm install` then `npm run dev`. Type check: `npm run typecheck`.

Version 1.0.0. Checked: types compile, demo renders in both vibes, sheet and toast work, an automated accessibility check found no component issues, and text and border contrast was audited for both vibes. Not yet tested inside Lovable.
