# UI & UX Design Guidelines (Shadcn-like Quality)

This project has a persistent dark-mode custom theme (`#0F1113`, `#171A1D`, `#E53935` accents). The user wants the application to retain this custom theme but possess the **interaction quality and smoothness of Shadcn UI**.

When creating or modifying components in this project, ALWAYS adhere to the following rules:

## 1. Buttons and Interactions
- All buttons MUST have hover and active scale animations.
- Use `transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]`.
- Add focus rings for accessibility and premium feel: `focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[#171A1D] focus:ring-[#E53935]`.
- Primary buttons should have a subtle glow/shadow: `shadow-[0_0_20px_rgba(229,57,53,0.25)]`.

## 2. Inputs, Selects, and Forms
- Focus states must use rings instead of just border colors.
- Use `focus:outline-none focus:border-[#E53935] focus:ring-1 focus:ring-[#E53935] transition-all`.

## 3. Modals and Dialogs
- Never use basic CSS `fade-in` for modals.
- ALWAYS use `framer-motion`'s `<AnimatePresence>` to mount and unmount modals.
- The backdrop should have `backdrop-blur-sm` and fade in/out (`opacity: 0` to `1`).
- The modal box itself MUST use a spring animation (scale up from `0.95` to `1`, and translate Y from `10px` to `0`). Example: `transition={{ type: "spring", duration: 0.4, bounce: 0 }}`.

## 4. Tables and Lists
- When rendering lists or table rows (`<tr>`) that can be filtered or dynamically updated, use `framer-motion`'s `layout` and `AnimatePresence`.
- Wrap the rows in `<AnimatePresence mode="popLayout">` and use `<motion.tr>` with `layout`, `initial={{ opacity: 0, y: 10 }}`, `animate={{ opacity: 1, y: 0 }}`, and `exit={{ opacity: 0, scale: 0.95 }}`.

## 5. Charts (Recharts)
- Set `isAnimationActive={true}`, `animationDuration={1500}`, and `animationEasing="ease-out"` on all chart elements (`<Area>`, `<Bar>`, `<Pie>`, `<Line>`).
- For Line and Area charts, ALWAYS use `type="natural"` instead of `monotone` to ensure perfectly smooth bezier curves.
- Use glowing filters via SVG `<defs>` if appropriate for the data (e.g., trendlines).
- **Color Synchronization**: All charts must strictly follow the System Awan Blue theme. Do not use generic gray/black colors (`#171A1D`, `#25292D`). Use:
  - Backgrounds / Tooltip bg: `#11142B`
  - Tooltip border / Cartesian grids: `#252946`
  - Axis text / Legends: `#858BA8`
  - Primary color (stroke/fill): `#3867FF`
  - Text: `#F5F7FF`

## 6. Layout & Sidebar
- **Sidebar Collapse Behavior**: When the sidebar is closed on desktop, it MUST collapse to `0px` width (`w-0 overflow-hidden`) to allow the main content to take up 100% of the screen.
- To ensure the sidebar can be reopened, a hamburger menu toggle must dynamically appear in the `Header` (`lg:hidden` removed when sidebar is closed).
