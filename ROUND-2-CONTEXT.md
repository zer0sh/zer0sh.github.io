# ROUND-2-CONTEXT: Locked Direction J (Whispered Monolith Dispatch)

## Locked Design Authority
- **Status:** Explicitly Locked by Human
- **Source Direction:** `round-2/J.html`
- **Subject:** Steven Muñoz (`zer0sh`) — Site Reliability Engineer & Systems
- **Philosophy:** "Resilience is engineered, not hoped for. Operating systems, cloud-native platforms, and developer tooling built for predictability, telemetry, and automated recovery."

---

## 1. Color System (Flat Letterform Roles on Canvas)
- **Canvas Ground:** `#07080b` (Deep nocturnal coal black)
- **Ghost Ambient Text:** `#131722` (Ultra-low contrast architectural watermark)
- **Primary Text:** `#ffffff` (Pure optical white — headers, titles, high-priority reading copy)
- **Secondary / Telemetry Text:** `#10b981` (Acid Emerald — active system status, subheadings, operational domains, metric values)
- **Tertiary / Subdued Text:** `#64748b` (Dusk Slate — tech stacks, supporting narrative, secondary metadata)
- **Accent / Alert Text:** `#ef4444` (Signal Vermilion — section kickers, incident tags, CVE advisories)

---

## 2. Typographic Constitution
- **Display & Reading Stack:** `-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif`
  - Main Heading (`h1`): `font-weight: 800; letter-spacing: -0.04em; line-height: 0.95;`
  - Ghost Kicker: `font-weight: 900; letter-spacing: -0.06em; line-height: 0.85; text-transform: uppercase;`
  - Section Headings: `font-weight: 800; letter-spacing: -0.03em; line-height: 1.05;`
  - Doctrine / Philosophy: `font-weight: 400; font-size: clamp(1.2rem, 2.3vw, 1.65rem); line-height: 1.4;`
- **Telemetry & Technical Stack:** `ui-monospace, Menlo, Monaco, Consolas, "Liberation Mono", monospace`
  - Status Strips & Badges: `font-size: 0.75rem; letter-spacing: 0.2em; text-transform: uppercase; color: #10b981;`
  - Section Kickers: `font-size: 0.75rem; letter-spacing: 0.3em; text-transform: uppercase; color: #ef4444;`
  - Tech Stacks: `font-size: 0.78rem; letter-spacing: 0.05em; color: #64748b;`

---

## 3. Spatial & Structural Rhythm
- **Canvas Padding:** `6rem 8vw 12rem 8vw` (Max width `1250px`, centered)
- **Inter-Section Gaps:** `8rem` to `11rem`
- **Project Grid:** Asymmetric 2-column layout (`20rem 1fr` on desktop, fluid 1-column on mobile)
- **Article / Dispatch Grid:** Fluid 3-column auto-fit (`minmax(18rem, 1fr)`)
- **Footer:** 4-column minimal metadata grid with white value tokens

---

## 4. Invariants (Must Not Be Normalized)
1. No generic rounded cards with drop shadows or gradient borders.
2. Form and hierarchy emerge purely from scale contrast, typography, color roles, and whitespace.
3. Dark nocturnal palette `#07080b` with Emerald `#10b981` and Vermilion `#ef4444` as functional telemetry cues.
4. Curated 5 SRE projects: `k3s-lab`, `sunim-tui`, `zer0sh-site-health-monitor`, `gh-runner-selfhosted-docker`, `dotfiles`.
