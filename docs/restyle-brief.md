# Component restyling brief

Read `docs/foundation.md` and `src/routes/layout.css` first. Every component in `src/lib/components/ui/` is ours to edit; keep each component's public API (props, slots, data-slot attributes, exports) unless the brief says to add something. The shadcn-svelte skill rules still apply (groups, titles, data-icon, no space-y, cn()).

## Shared rules

- **Tokens only.** No raw palette shades, no hex, no arbitrary colours. Use `bg-background / card / popover / muted / secondary / accent / primary / signal / field / face-*`, `text-foreground / muted-foreground`, `border-border`, status tokens `destructive / success / warning / info`.
- **Radius by role.** `rounded-md` for inline controls (buttons, inputs, badges, kbd, toggles), `rounded-lg` for cards, menus and popovers, `rounded-xl` for dialogs and sheets. `rounded-full` only for things that are circles: avatars, radio buttons, the switch thumb and track, spinner, the ring-and-dot control, slider thumb.
- **Hairlines, not rings.** Replace `ring-foreground/10`, `ring-1` and double borders with a single `border border-border`. No blurred shadows anywhere. Floating layers use `shadow-float`; the `block` variants use `shadow-face-sm` (controls) or `shadow-face` (cards).
- **Focus.** Replace every `focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-3` (and `aria-invalid:ring-*`) with `focus-visible:focus-halo` and, for invalid, `aria-invalid:border-destructive`. Keep `outline-none` only where `focus-halo` is applied in its place.
- **Hover.** Darken by mixing toward the foreground, never with opacity: `hover:bg-[color-mix(in_oklch,var(--primary),var(--foreground)_8%)]` for filled surfaces, `hover:bg-accent` for ghost surfaces.
- **Press.** `active:translate-y-px` on buttons stays. Block variants: `active:translate-y-0.5 active:shadow-none`.
- **Motion.** `transition-[color,background-color,border-color,box-shadow,transform,opacity] duration-(--dur-1) ease-out`. Overlays enter with `data-open:animate-in data-open:fade-in-0 data-open:slide-in-from-bottom-2 duration-(--dur-3) ease-enter` and leave with `data-closed:animate-out data-closed:fade-out-0 data-closed:slide-out-to-bottom-1 ease-exit`. Things slide; nothing zooms (remove `zoom-in-95` / `zoom-out-95`). Sheets slide from their edge over `--dur-3` on `ease-move`.
- **Type inside components.** Cabin (default `font-sans`), `text-sm`, weight 400, sentence case. Tracked display caps (`type-label`) are used only in: Badge, table header cells, Kbd, menu and select group labels, Field legend, Tabs triggers in the `line` variant. Everything else stays sentence-case Cabin. Never bold body text; emphasis is weight 500.
- **Icons.** Stroke is set globally to 1.5. Keep the `[&_svg:not([class*='size-'])]:size-4` sizing. No icon inside a tinted circle.
- **Dark mode.** Do not add `dark:` colour overrides; the tokens change by mode. Remove existing `dark:bg-input/30`-style overrides where the token already covers it, and check every state in dark mode visually.
- **No new dependencies.** Do not edit `src/routes/layout.css`; if you need a token, write the proposal into your final report instead.

## Signature pieces (make these feel like one system)

- **Ring-and-dot** is the primary control motif: Radio (hairline ring, filled primary dot when checked), Slider thumb (ring with a dot), Spinner (a hairline ring with one dot travelling around it, built from an SVG circle with `stroke-dasharray`, not the lucide loader), Switch (track is a pill of `bg-input`, checked `bg-primary`; the thumb is a circle of `bg-background`, no shadow).
- **Checkbox** is a square tile: hairline border, checked = `bg-primary text-primary-foreground` with the check icon; indeterminate = a short hairline.
- **Buttons.** Variants: `default` (primary fill), `secondary`, `outline` (hairline, transparent), `ghost`, `link`, `destructive` (filled destructive, paper text; not the pale tint), plus a new `block` variant (`bg-face-top text-foreground border border-border shadow-face-sm`, pressed removes the offset). Sizes as nova, plus a new size `icon-round` (`size-8 rounded-full`) used for ghost icon buttons in app chrome.
- **Badge.** Rectangular, `rounded-sm`, `type-label` at 11px, padding 2px 6px. Variants: `default` (primary), `secondary`, `outline`, `destructive`, `signal`, `success`, `warning`.
- **Card.** `bg-card border border-border rounded-lg`, no ring, no shadow. Add `variant="block"` (`shadow-face`). Card title in Cabin 500 at 15px, description muted.
- **Tabs.** Default `variant="line"`: list has a bottom hairline, trigger text muted, active trigger `text-foreground` with a 2px `bg-primary` underline that is a pseudo-element (`after:`) so it can animate. Second variant `segment`: list `bg-muted rounded-md p-0.5`, active trigger `bg-card shadow-face-sm`.
- **Inputs.** Hairline border, `bg-card`, `h-8`, `rounded-md`, placeholder muted. Focus = `focus-halo`. Invalid = `border-destructive`. Input group addons share the hairline.
- **Menus, Select, Command, Popover, Hover card.** `bg-popover border border-border rounded-lg shadow-float p-1`. Items `rounded-sm h-8`, highlighted = `bg-accent`. Group labels `type-label text-muted-foreground`. Separators hairline.
- **Dialog / Alert dialog.** Overlay `bg-foreground/30` in light and `bg-background/70` in dark (use the tokens; this is the one allowed `dark:` override), no blur. Content `bg-popover border border-border rounded-xl shadow-face-lg`. Enters by sliding up 8px and fading over `--dur-3` on `ease-enter`.
- **Sheet / Drawer.** Panel `bg-card border-border` with a hairline on the inner edge, no shadow; Drawer handle is a 32x2 hairline.
- **Tooltip.** `bg-foreground text-background rounded-md px-2 py-1 text-xs`, no arrow, enters with fade only (`--dur-2`).
- **Alert.** Hairline card with a 2px left bar in the status colour (this is the one place a coloured edge is allowed); icon in the status colour; variants default / destructive / success / warning / info.
- **Progress.** Track `bg-muted h-1.5 rounded-full`, indicator `bg-primary`, motion `ease-move`. Indeterminate: a 30% segment sliding back and forth.
- **Skeleton.** `bg-muted rounded-md` with a slow opacity breath (1.8s, ease-in-out) instead of pulse.
- **Empty.** Centred stack; the default media slot shows three concentric hairline rings (SVG) in `text-border`.
- **Sidebar.** Tokens from `--sidebar-*`. Active menu item: `text-foreground` plus a 6px `bg-primary` dot (`before:` pseudo) at its left; hover `bg-sidebar-accent`. Group labels `type-label`.
- **Table.** Hairline rows, header `type-label text-muted-foreground h-9`, cells `py-2.5`, numerals `tabular-nums`, hover row `bg-muted/60`. Caption muted.
- **Kbd.** `bg-face-top border border-border shadow-face-sm rounded-sm font-sans text-xs min-w-5 px-1`.
- **Separator.** 1px `bg-border`.
- **Accordion.** Hairline between items, trigger Cabin 500, chevron rotates on `ease-move` over `--dur-2`, content slides with the existing accordion keyframes.
- **Sonner.** Toasts styled like a Card block variant with the status colour as a left bar.
- **Chart.** Colours from `--chart-1..5`, hairline grid, tooltip like Popover.
- **Avatar.** Circle with a hairline border; fallback `bg-muted type-label`.
- **Calendar / Range calendar.** Day cells `rounded-md`, selected `bg-primary text-primary-foreground`, range middle `bg-accent`, today = a 4px dot under the number in `bg-primary` (`after:` pseudo), not a ring.
- **Code block.** `bg-muted border border-border rounded-lg`, mono 13px, header hairline, copy button ghost `icon-round`.
- **Message / bubble / attachment / questionnaire / trace / marker / message-scroller.** Restyle to the same tokens: bubbles are `rounded-lg` cards, user bubbles `bg-primary text-primary-foreground`; no gradients; markers use `signal`.

## Verification (required)

Build a lab page for your group at `src/routes/lab/<group>/+page.svelte` that renders every component you own in every variant, size and state (default, hover is live, focus-visible via Tab, disabled, invalid, open overlays with a button to open them, checked/unchecked). Use real content (names of fonts, palette names, cities, dates), not "Item 1". Open it in the Browser pane against a running `npm run dev` server, create your own tab with `tabs_create` and pass that `tabId` to every browser call so you never disturb other agents' tabs. Check light mode, then add `class="dark"` to `<html>` via `javascript_tool` (`document.documentElement.classList.add('dark')`) and check dark mode; also try `document.documentElement.dataset.theme = 'ember'` and `'dusk'` to confirm nothing hard-codes a hue. Take screenshots, zoom into controls, fix what looks off. Read console errors. Run `npx @sveltejs/mcp svelte-autofixer <file>` on each component you touched and `npm run check` at the end; fix all errors in your files. Do not commit.

Final report: list every component changed with one line each, new variants/props added, token proposals, anything you could not resolve, and the lab route path.
