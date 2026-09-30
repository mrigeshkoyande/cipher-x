# CIPHER-X — UI/UX Design System & Product Design Specification 🎨

> **Product:** CIPHER-X  
> **Classification:** AI-Powered Multi-Vendor Network Security Compliance Auditor  
> **Design Philosophy:** Editorial-grade cybersecurity operations. Calm, deep-surface aesthetics with precision typography, deliberate telemetry accents, and zero visual clutter.

---

## 📑 Table of Contents

1. [Visual Philosophy & Aesthetic Direction](#1-visual-philosophy--aesthetic-direction)
2. [Brand Identity & Official Application Logo](#2-brand-identity--official-application-logo)
3. [Cinematic 8-Second Startup Experience](#3-cinematic-8-second-startup-experience)
4. [Design System Tokens (CSS Architecture)](#4-design-system-tokens-css-architecture)
   - [Color Palette & Surfaces](#41-color-palette--surfaces)
   - [Typography Hierarchy](#42-typography-hierarchy)
   - [Borders, Radii & Elevations](#43-borders-radii--elevations)
5. [Core Layout Architecture](#5-core-layout-architecture)
   - [AppShell Framework](#51-appshell-framework)
   - [Navigation Sidebar](#52-navigation-sidebar)
   - [Operational Topbar](#53-operational-topbar)
6. [Component Pattern Library](#6-component-pattern-library)
   - [Executive Metric Cards](#61-executive-metric-cards)
   - [Severity Badges & Compliance Scorecards](#62-severity-badges--compliance-scorecards)
   - [Code & CLI Evidence Viewer](#63-code--cli-evidence-viewer)
   - [Interactive Security Topology Graph Canvas](#64-interactive-security-topology-graph-canvas)
7. [Screen-by-Screen Interaction Specifications](#7-screen-by-screen-interaction-specifications)
8. [Responsive Breakpoints & Performance Budgets](#8-responsive-breakpoints--performance-budgets)

---

## 1. Visual Philosophy & Aesthetic Direction

Conventional cybersecurity tools suffer from two extremes:
1. **The Cluttered Enterprise Portal**: Monolithic tables, harsh blues, high visual fatigue, and uninspired enterprise gray boxes.
2. **The Overstyled "Hacker" Theme**: Unreadable neon greens, gratuitous scanlines, and particle effects that impair readability.

**CIPHER-X establishes an editorial, high-trust operational language:**
- **Calm, Deep Near-Black Surfaces**: Subtle charcoal and deep forest green undertones (`#0c0f0d`, `#111613`) soothe eye strain during multi-hour audit sessions.
- **Warm Sage & Amber Accents**: Instead of harsh blues, CIPHER-X utilizes muted cyber-amber (`#f59e0b`), emerald green (`#10b981`), and warm sage text for effortless scanning.
- **Restrained Visual Weight**: Micro-animations are purposeful (telemetry indicators, progress bars, radar scans) rather than decorative.
- **Strict Information Hierarchy**: Large numerical metrics anchored with tiny, high-contrast monospace subtitles.

---

## 2. Brand Identity & Official Application Logo

The official CIPHER-X logo represents a hardened security shield fused with cryptographic node matrices and circuit traces.

```
       ▲
     /   \       [ CIPHER-X OFFICIAL EMBLEM ]
    / / \ \      - Symbolizes hardened cryptographic defense
   | |   | |     - Interconnected nodes represent network topology
   |  \ /  |     - Outer shield represents compliance boundaries
    \  |  /
      ▼
```

### 2.1 Logo Integration Matrix

| Location | Dimensions | Asset Source | Visual Treatment |
| :--- | :--- | :--- | :--- |
| **Browser Favicon** | 32×32 px | `/favicon.png` | Crisp pixel density, transparent backdrop |
| **Sidebar Brand Header** | 34×34 px | `/app-logo.png` | Subtle amber border, 8px radius, hover glow |
| **Login Hero Card** | 72×72 px | `/app-logo.png` | 14px radius, double cyber-ring with radial backdrop |
| **Cinematic Launch Splash** | Centered Overlay | `/app-logo.png` | Synchronized fade with startup video |

---

## 3. Cinematic 8-Second Startup Experience

Upon initial page load, CIPHER-X executes an 8-second cinematic boot sequence defined in `LaunchSplashScreen.tsx`.

### 3.1 State Machine & Timeline

```
T = 0.0s          T = 2.0s          T = 4.5s          T = 7.2s        T = 8.0s
───┬─────────────────┬─────────────────┬─────────────────┬───────────────┬───────►
   │                 │                 │                 │               │
   ▼                 ▼                 ▼                 ▼               ▼
[ Video Starts ]  [ Telemetry 1 ]   [ Telemetry 2 ]   [ Telemetry 3 ] [ Fade-Out ]
(Muted Autoplay)  "INITIALIZING     "LOADING MULTI-   "SYSTEM READY"  (800ms)
Countdown: 00:08s  KERNEL..."        VENDOR AST..."    Scorecard Synced Into App
```

### 3.2 Telemetry Stream Sequence
The splash screen streams real-time synthetic boot milestones:
1. `T = 0s`: `INITIALIZING CIPHER-X SECURE KERNEL v1.0.0...`
2. `T = 2s`: `LOADING MULTI-VENDOR AST PARSERS (CISCO, JUNIPER, FORTINET, PALO ALTO)...`
3. `T = 4s`: `SYNCHRONIZING CIS BENCHMARKS & NIST 800-53 RULE LIBRARIES...`
4. `T = 6s`: `RESTORING TOPOLOGY GRAPH MATRIX & CRYPTOGRAPHIC EVIDENCE ENGINE...`
5. `T = 7.2s`: `SYSTEM OPERATIONAL — LAUNCHING CIPHER-X AUDIT WORKSPACE`

### 3.3 Audio Policy & User Control
- **Autoplay Compliance**: Browsers block unmuted video autoplay without prior user interaction. The video starts muted by default.
- **Audio Toggle**: An interactive glassmorphism button allows users to toggle audio on/off dynamically.
- **Skip Intro**: A high-visibility **"Skip Intro"** button allows immediate bypass for rapid development cycles.
- **On-Demand Replay**: The header navigation (`Topbar.tsx`) includes a `Film` icon button to replay the sequence at any time.

---

## 4. Design System Tokens (CSS Architecture)

Located in `frontend/src/index.css`:

### 4.1 Color Palette & Surfaces

```css
:root {
  /* Surfaces */
  --cx-bg: #0c0f0d;              /* Application background */
  --cx-surface: #111613;         /* Card & panel surfaces */
  --cx-surface-2: #18201b;       /* Elevated dialogs & hover states */
  --cx-surface-3: #1f2a24;       /* Monospace code surfaces */
  --cx-border: #232f27;          /* Default structural borders */
  --cx-border-subtle: #19231d;   /* Secondary dividing lines */

  /* Typography */
  --cx-text: #e8ede9;            /* Primary high-contrast text */
  --cx-muted: #839788;           /* Secondary label text */
  --cx-dim: #4f6354;             /* Inactive hints & placeholders */

  /* Cyber & Severity Accents */
  --cx-accent: #f59e0b;          /* Cyber amber (primary brand) */
  --cx-accent-glow: rgba(245, 158, 11, 0.15);
  --cx-success: #10b981;         /* Compliance PASS */
  --cx-warning: #eab308;         /* Compliance MEDIUM / LOW */
  --cx-danger: #ef4444;          /* Compliance CRITICAL / HIGH */
  --cx-info: #3b82f6;            /* System informational */
}
```

### 4.2 Typography Hierarchy
- **Primary Body Font**: System UI font stack (`system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif`).
- **Telemetry & Code Font**: `ui-monospace, 'SF Mono', 'Cascadia Code', 'Fira Code', Menlo, Consolas, monospace`.
- **Title Hierarchy**:
  - `page-title`: `22px / font-weight: 700 / letter-spacing: -0.02em`
  - `card-title`: `15px / font-weight: 600 / letter-spacing: -0.01em`
  - `metric-value`: `32px / font-weight: 800 / tabular-nums`
  - `telemetry-label`: `11px / font-weight: 600 / uppercase / letter-spacing: 0.08em`

### 4.3 Borders, Radii & Elevations
- **Border Radius**:
  - `sm`: `6px` (Badges, tags, filter buttons)
  - `md`: `10px` (Cards, panels, modal windows)
  - `lg`: `16px` (Hero containers, login forms)
- **Shadows**:
  - `card-shadow`: `0 4px 20px -2px rgba(0, 0, 0, 0.5)`
  - `glow-amber`: `0 0 16px rgba(245, 158, 11, 0.25)`
  - `glow-red`: `0 0 16px rgba(239, 68, 68, 0.25)`

---

## 5. Core Layout Architecture

```
┌────────────────────────────────────────────────────────────────────────┐
│                              TOPBAR                                    │
│ [Search Bar]               [Replay Intro] [Tenant Badge] [User Profile]│
├───────────────┬────────────────────────────────────────────────────────┤
│    SIDEBAR    │                     PAGE CONTENT                       │
│               │                                                        │
│ [Logo] CIPHER │  ┌──────────────┐ ┌──────────────┐ ┌──────────────┐    │
│               │  │ Metric Card  │ │ Metric Card  │ │ Metric Card  │    │
│ - Dashboard   │  └──────────────┘ └──────────────┘ └──────────────┘    │
│ - Devices     │                                                        │
│ - Configs     │  ┌────────────────────────────────────────────────┐    │
│ - Compliance  │  │                                                │    │
│ - Findings    │  │        Interactive DataTable / Graph View      │    │
│ - Training    │  │                                                │    │
│ - Graph       │  └────────────────────────────────────────────────┘    │
│ - Simulator   │                                                        │
└───────────────┴────────────────────────────────────────────────────────┘
```

### 5.1 AppShell Framework
- **Flexbox Root Grid**: Sticky 260px Sidebar on desktop with fluid content area.
- **Seamless Scroll Area**: Custom minimalist scrollbar styling matching surface palettes.

### 5.2 Navigation Sidebar
- Organized into 4 logical groups:
  1. **Core Operations**: Dashboard, Devices, Configurations, Compliance, Findings.
  2. **Intelligence & AI**: Training Studio, Security Graph, Analyst Query, What-If Simulation.
  3. **Governance**: Configuration Drift, Reports, Audit Trail.
  4. **System**: Platform Settings.

### 5.3 Operational Topbar
- **Global Context Search**: Fast lookup across devices, findings, and CVE IDs.
- **Tenant Scope Indicator**: Displays active enterprise organization.
- **Replay Intro Button**: Allows triggering the 8-second cinematic boot sequence on demand.

---

## 6. Component Pattern Library

### 6.1 Executive Metric Cards
- Features large, tabular-num digits for instant legibility.
- Subtitle reveals change trend ($\Delta$ vs. previous audit cycle).
- Micro-chart or sparkline rendering.

### 6.2 Severity Badges & Compliance Scorecards
- **CRITICAL**: Red background pill with neon dot indicator (`#ef4444`).
- **HIGH**: Orange background pill (`#f97316`).
- **MEDIUM**: Yellow background pill (`#eab308`).
- **LOW**: Cyan/Blue background pill (`#06b6d4`).
- **PASS**: Emerald green pill (`#10b981`).

### 6.3 Code & CLI Evidence Viewer
- Two-column view:
  - Left column: 1-indexed line numbers with finding highlight gutter.
  - Right column: Monospace configuration text with syntax highlighting.
- Exact line ranges involved in violations are highlighted with a glowing amber/red backdrop.

### 6.4 Interactive Security Topology Graph Canvas
- Powered by `@xyflow/react`.
- Smooth panning, zooming, and node drag-and-drop.
- Custom node components for Firewalls, Core Routers, Edge Switches, and VLANs.

---

## 7. Screen-by-Screen Interaction Specifications

1. **DashboardPage**: Real-time compliance radar, overall posture score (0-100%), device risk distribution, top failing controls.
2. **DevicesPage**: Inventory filterable by vendor (`Cisco`, `Juniper`, `Fortinet`, `Palo Alto`), OS version, IP address, and status.
3. **ConfigurationsPage**: Configuration repository with ingestion timestamps, parsing status, and raw byte sizes.
4. **ConfigurationUploadPage**: Drag-and-drop upload zone supporting `.txt`, `.cfg`, `.conf`, `.set` files with automatic vendor fingerprinting.
5. **ConfigurationDetailPage**: Full-text interactive viewer with line highlighting and cross-referenced finding annotations.
6. **CompliancePage**: Multi-framework matrix (CIS, NIST, PCI-DSS, ISO 27001) with drill-down into specific controls.
7. **FindingsPage**: Master audit defect list with multi-faceted filtering (Severity, Status, Device, Control ID).
8. **FindingDetailPage**: In-depth defect forensics, AI explanation, line evidence, and one-click remediation script generator.
9. **TrainingPage**: Human-in-the-loop active learning studio for unrecognized CLI syntax.
10. **SecurityGraphPage**: Interactive topology graph visualizing device interconnects, subnets, and blast radius.
11. **QueryPage**: Natural language analyst search interface with cited source evidence.
12. **SimulationPage**: What-If change sandbox for pre-deployment compliance validation.
13. **DriftPage**: Side-by-side AST and lexical diffing between configuration versions.
14. **ReportsPage**: Executive PDF export suite with compliance summaries and evidence tables.
15. **AuditPage**: Tamper-evident log of all user actions, rule modifications, and simulation runs.
16. **LoginPage**: High-security authentication screen showcasing official brand shield.

---

## 8. Responsive Breakpoints & Performance Budgets

- **Breakpoints**:
  - Mobile: `< 768px` (Sidebar collapses into an overlay drawer).
  - Tablet: `768px - 1024px` (Metric cards switch to 2-column grid).
  - Desktop: `1024px - 1440px` (Standard 4-column layout).
  - Ultra-Wide: `> 1440px` (Max container constraints to maintain optimal reading lengths).
- **Performance Budgets**:
  - First Contentful Paint (FCP): `< 800ms`.
  - Time to Interactive (TTI): `< 1.2s`.
  - Zero layout shift (CLS: `0.0`).
  - Bundle size: Code-split by route using Vite dynamic imports.

---

**CIPHER-X Design System.** Clarity in defense. Precision in execution.
