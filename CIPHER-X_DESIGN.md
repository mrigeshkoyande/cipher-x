# CIPHER-X — UI/UX Design System & Product Interface Specification

> **Product:** CIPHER-X  
> **Type:** AI-Driven Multi-Vendor Network Security Compliance Auditor  
> **Design Direction:** Premium security-operations dashboard inspired by the uploaded CyberGuard references, adapted specifically for CIPHER-X and the requirements in the supplied PRD.
>
> **Primary goal:** Make a complex network-security compliance platform feel calm, premium, highly readable, and operationally useful without turning the interface into a generic SOC dashboard.

---

## 1. Design Reference & Interpretation

The uploaded visual references establish the primary visual language for CIPHER-X:

- Editorial-style security dashboard
- Warm off-white / pale sage application shell
- Deep near-black / dark-green operational surfaces
- Thin borders and subtle separators
- Large numerical metrics
- Minimal but expressive orange alerts
- Rounded cards with restrained corner radii
- Dense information presented with generous spacing
- Large circular/radar-style visualization as a visual anchor
- Small typography with strong hierarchy
- Soft muted backgrounds rather than conventional blue cybersecurity UI
- Orange used primarily for risk, alerts, actions, and brand emphasis
- Professional, futuristic, but not overly "sci-fi"
- No excessive gradients, glassmorphism, neon effects, or decorative animations

The CIPHER-X interface should **take inspiration from this visual language, not copy the reference screen literally**.

The supplied PRD requires configuration ingestion, vendor detection, normalization, compliance evaluation, findings/evidence, Training Studio, remediation, PDF reports, drift analysis, security graph, natural-language queries, what-if simulation, and audit history. The design must therefore organize these capabilities into a coherent security platform rather than a single dashboard.

The PRD explicitly recommends a modern security-operations dashboard with:

- Dark/light professional theme
- Clear severity indicators
- Compliance scorecards
- Device cards
- Interactive configuration viewer
- Evidence highlighting
- Training workspace
- Finding drill-down
- Graph visualization
- Drift timeline
- Report preview

fileciteturn1file0L304-L318

---

# 2. CIPHER-X Brand Direction

## 2.1 Brand Personality

CIPHER-X should feel:

- Secure
- Intelligent
- Precise
- Technical
- Trustworthy
- Enterprise-grade
- Calm under pressure
- Evidence-driven
- Human-controlled

Avoid making it feel:

- Like a gaming dashboard
- Like a crypto/Web3 product
- Like a generic AI chat application
- Like a consumer analytics app
- Overly neon
- Overly futuristic
- Overloaded with glowing elements

## 2.2 Brand Message

Primary:

> **CIPHER-X**

Suggested product descriptor:

> **AI-Powered Network Security Compliance Auditor**

Optional short positioning:

> **Understand. Audit. Secure.**

Alternative:

> **Universal Security Intelligence for Heterogeneous Networks**

---

# 3. Visual Design System

## 3.1 Core Color Palette

### Application Shell

```text
Background:
#E9EBDD

Secondary Surface:
#E1E4D3

Card Surface:
#F0F1E4

Border:
#D2D5C4

Primary Text:
#111513

Secondary Text:
#687066

Muted Text:
#92988B
```

### Operational Dark Surface

Use for the primary security visualization, configuration analysis workspace, or high-density operational panels.

```text
Dark Background:
#101614

Dark Surface:
#151B18

Dark Surface Elevated:
#1C2420

Dark Border:
#303833

Dark Primary Text:
#F2F4EA

Dark Secondary Text:
#AAB2A8
```

### Brand Accent

```text
CIPHER Orange:
#FF7417

Orange Hover:
#E9650E

Orange Soft:
#FFF0E5
```

### Status Colors

Use status colors consistently and sparingly.

```text
PASS:
#25B981

FAIL:
#E05A61

WARNING:
#F0A13A

REVIEW:
#E8B84A

UNKNOWN:
#8C9390

INFO:
#7A8FA6
```

Do not use status colors as full-card backgrounds. Prefer:

- Small indicator
- Badge
- Progress segment
- Icon
- Border accent
- Tiny chart segment

---

# 4. Typography

Use a modern professional sans-serif.

Preferred:

1. Inter
2. Geist
3. Manrope

Recommended hierarchy:

```text
Page Title:
32–40px / Medium

Section Title:
20–24px / Medium

Card Title:
15–18px / Medium

Body:
14px / Regular

Secondary:
12–13px / Regular

Metadata:
11–12px / Medium

Large Metric:
44–64px / Light or Regular

Monospace:
13–14px
```

For configuration/CLI content use:

```text
JetBrains Mono
```

or:

```text
IBM Plex Mono
```

---

# 5. Layout Principles

## 5.1 Overall Structure

Desktop-first enterprise application:

```text
┌─────────────────────────────────────────────────────────────┐
│ CIPHER-X Logo      Search / Command      User / Alerts      │
├───────────────┬─────────────────────────────────────────────┤
│               │                                             │
│ Sidebar       │ Main Content                                │
│               │                                             │
│ Overview      │ Page Header                                 │
│ Devices       │                                             │
│ Configs       │ Content                                    │
│ Compliance    │                                             │
│ Findings      │                                             │
│ Training      │                                             │
│ Reports       │                                             │
│ Drift         │                                             │
│ Security Map  │                                             │
│ Query         │                                             │
│ Audit         │                                             │
│ Settings      │                                             │
│               │                                             │
└───────────────┴─────────────────────────────────────────────┘
```

### Desktop width

Target:

```text
1440px–1920px
```

Maximum content width:

```text
1600px
```

### Spacing

Use an 8px spacing system:

```text
4px
8px
12px
16px
24px
32px
40px
48px
64px
```

Do not create cramped dashboard cards.

---

# 6. Navigation

## 6.1 Sidebar

The sidebar should be compact and elegant.

Top:

```text
[ CIPHER-X ]
AI Security Compliance
```

Navigation:

```text
OVERVIEW

Overview

ASSETS

Devices
Configurations

SECURITY

Compliance
Findings
Risk Center

INTELLIGENCE

Training Studio
Security Graph
Natural Language Query
What-If Simulation

OPERATIONS

Reports
Drift Analysis
Audit Trail

SYSTEM

Frameworks
Settings
```

Each item:

- Icon
- Label
- Optional notification/count
- Active indicator

### Active state

Use a subtle dark or orange-accented capsule.

Do not make the entire sidebar orange.

---

# 7. Top Navigation

Top bar should contain:

### Left

Breadcrumb:

```text
CIPHER-X / Overview
```

### Center

Global search / command interface:

```text
⌕  Search devices, controls, findings...
```

Shortcut:

```text
⌘ K
```

### Right

```text
[Processing 3] [Alerts 5] [Help] [User Avatar]
```

Optional organization selector:

```text
ACME SECURITY
⌄
```

---

# 8. Dashboard — Overview

This is the primary landing page.

The uploaded references use a large dark visualization as the visual centerpiece. CIPHER-X should adapt this concept into a **Security Posture Map**.

## 8.1 Hero Security Posture Panel

Large dark panel:

```text
┌───────────────────────────────────────────────────────────────┐
│ Security Posture                              Live Analysis ● │
│                                                               │
│ Overall Security Posture                                     │
│                                                               │
│                         82%                                   │
│                  Compliance Coverage                           │
│                                                               │
│            ╭────────────────────────╮                         │
│         ╭──│   SECURITY BASELINE    │──╮                      │
│        │   │                         │   │                     │
│        │   │  142 Devices            │   │                     │
│        │   │  1,284 Controls         │   │                     │
│        │   │  37 Findings            │   │                     │
│        │   ╰────────────────────────╯   │                     │
│         ╰────────────────────────────────╯                    │
│                                                               │
│ Cisco   Fortinet   Juniper   Palo Alto   Cloud   Unknown     │
└───────────────────────────────────────────────────────────────┘
```

### Visualization

Create concentric rings representing:

- Devices
- Security facts
- Controls
- Findings

Nodes can represent:

- Vendor
- Device
- High-risk finding
- Framework

Orange nodes indicate active risks.

Green/teal segments indicate compliant areas.

The visualization should communicate information, not exist only as decoration.

---

# 9. Dashboard Metric Cards

Below the hero:

```text
┌──────────────┐ ┌──────────────┐ ┌──────────────┐ ┌──────────────┐
│ Devices      │ │ Compliance   │ │ Findings     │ │ Unknown      │
│ 142          │ │ 82%          │ │ 37           │ │ 12           │
│ +8 this week │ │ +4.2%        │ │ 5 critical   │ │ Review       │
└──────────────┘ └──────────────┘ └──────────────┘ └──────────────┘
```

Metrics:

1. Total Devices
2. Compliance Coverage
3. Open Findings
4. Unknown Configurations

Optional:

- Configurations processed
- Controls evaluated
- Frameworks active
- Reports generated

---

# 10. Dashboard Lower Grid

Use four primary panels inspired by the reference.

## Sources / Vendors

Show vendor distribution:

```text
VENDOR / DEVICES

Cisco              47
Fortinet            31
Juniper             24
Palo Alto           18
Other               22
```

Use miniature bars.

## Compliance Alerts

```text
CRITICAL     ██████████  05
HIGH         ████████    14
MEDIUM       █████       12
LOW          ██           06
REVIEW       ███          08
```

## Processing / Automation

```text
/01  Completed              128
/02  Processing               7
/03  Review Required          12
/04  Failed                    2
```

## Assets

Compact device list:

```text
● CORE-SW-01       Cisco      C9300
● EDGE-FW-02       Fortinet   FortiGate
● BRANCH-RTR-07    Juniper    MX
● DC-FW-01         Palo Alto  PA-Series
```

---

# 11. Device Management

Route:

```text
/devices
```

Page header:

```text
Devices
142 network assets

[ Import Config ] [ Add Device ]
```

Filters:

```text
Vendor
Device Type
OS
Compliance
Risk
Last Scan
```

Device cards/table:

```text
DEVICE         VENDOR       PLATFORM     STATUS       SCORE
────────────────────────────────────────────────────────────
CORE-SW-01     Cisco        IOS-XE       ● Healthy    94%
EDGE-FW-02     Fortinet     FortiOS       ● Review     71%
DC-FW-01       Palo Alto    PAN-OS        ● Risk       63%
```

Clicking a device opens a detailed device workspace.

---

# 12. Device Detail Page

Header:

```text
← Devices

CORE-SW-01
Cisco Catalyst C9300
IOS-XE 17.x

● Connected     Last analyzed 8 min ago

[ Run Audit ] [ Upload Config ] [ Generate Report ]
```

Tabs:

```text
Overview
Configurations
Compliance
Findings
Evidence
Drift
Remediation
Audit History
```

Overview:

- Compliance score
- Risk distribution
- Current configuration
- Framework coverage
- Recent findings
- Configuration versions

---

# 13. Configuration Ingestion

Route:

```text
/configurations/upload
```

Design a clean upload workspace.

Hero:

```text
Upload Configuration

Analyze network configurations with CIPHER-X

┌─────────────────────────────────────────────────────────┐
│                                                         │
│                 ↑                                       │
│                                                         │
│       Drag & drop configuration files here              │
│                                                         │
│             or [ Browse Files ]                         │
│                                                         │
│       Supports .txt .cfg .conf .json                    │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

Below:

```text
Maximum file size
Configuration hashing
Device association
Automatic vendor detection
Immutable evidence storage
```

For bulk upload:

```text
12 files selected

Cisco-01.cfg          Detecting...
Fortinet-02.conf      Ready
Juniper-03.set        Ready
PaloAlto-04.txt       Processing...
```

---

# 14. Configuration Processing Experience

Do not show a generic spinner.

Use a pipeline:

```text
UPLOAD
  ↓
HASH
  ↓
DEVICE DETECTION
  ↓
PARSING
  ↓
NORMALIZATION
  ↓
AI REVIEW
  ↓
COMPLIANCE
  ↓
FINDINGS
  ↓
REPORT
```

Each stage should have:

- Status
- Duration
- Confidence
- Optional expandable details

Example:

```text
✓ Configuration uploaded
✓ SHA-256 generated
✓ Cisco / IOS-XE detected       98%
✓ 184 security facts extracted
✓ 176 facts normalized
⚠ 8 unknown commands detected
→ Compliance evaluation
```

---

# 15. Configuration Viewer

This is one of the most important screens.

Use a split layout:

```text
┌───────────────────────┬─────────────────────────────────────┐
│ Configuration         │ Normalized Security Model           │
│                       │                                     │
│ 38  ip ssh version 2  │ management.ssh.version              │
│ 39  service password  │ └── value: 2                        │
│ 40  line vty 0 4      │     confidence: 0.99                │
│ 41  transport input   │                                     │
│ 42  telnet            │ authentication.password_policy       │
│                       │ └── minimum_length: 12               │
└───────────────────────┴─────────────────────────────────────┘
```

Clicking a normalized fact should highlight its source lines.

This directly supports the PRD evidence-first model.

---

# 16. Unknown Configuration / AI Analysis

Unknown syntax must be visually obvious.

Example:

```text
⚠ UNKNOWN CONFIGURATION

Vendor:
Unknown / Custom Platform

Confidence:
61%

Unknown commands:
────────────────────────────────────────────

line 84
secure-management protocol-x enable

AI interpretation:
Possible secure management protocol configuration

Suggested mapping:
management.remote_access.protocol

Confidence:
74%

[ Review Mapping ]
[ Reject ]
```

Never visually represent UNKNOWN as PASS.

---

# 17. Training Studio

Route:

```text
/training
```

This is a signature CIPHER-X feature.

Design it as an interactive mapping workspace.

Header:

```text
Training Studio

Teach CIPHER-X how to understand new vendor syntax.

12 mappings require review

[ Pending ] [ Validated ] [ Rejected ]
```

Three-column workspace:

```text
┌──────────────┬─────────────────────┬────────────────────────┐
│ RAW CONFIG   │ AI INTERPRETATION   │ SECURITY MODEL         │
│              │                     │                        │
│ command      │ Suggested meaning   │ Parameter              │
│              │                     │                        │
│              │ Confidence           │ management.ssh...      │
│              │ 87%                 │                        │
│              │                     │ Transformation         │
│              │                     │ parse_boolean           │
└──────────────┴─────────────────────┴────────────────────────┘
```

Bottom actions:

```text
[ Reject ]
[ Save Draft ]
[ Approve Mapping ]
```

Approval should show:

```text
This mapping will be used for future configurations
from this vendor/platform.

[ Confirm & Validate ]
```

---

# 18. Compliance Center

Route:

```text
/compliance
```

Header:

```text
Compliance Center

Frameworks
[CIS] [NIST] [STIG] [ISO] [Custom]

[ Run Audit ]
```

Top score:

```text
82%
Overall Compliance
```

Breakdown:

```text
PASS             842
FAIL              93
WARNING           41
REVIEW             18
UNKNOWN             7
N/A                283
```

Important:

UNKNOWN must have a distinct visual treatment and must never visually resemble PASS.

The PRD explicitly defines PASS, FAIL, WARNING, REVIEW, NOT_APPLICABLE and UNKNOWN as separate compliance states. fileciteturn1file0L151-L160

---

# 19. Framework View

Example:

```text
CIS
──────────────────────────────────────────

Access Control                         91%
Network Services                       76%
Logging                                94%
Authentication                         81%
Cryptography                           72%

[ View Controls ]
```

Control table:

```text
CONTROL      REQUIREMENT              STATUS      DEVICE
SSH-001      SSH version 2             ✓ PASS      132
SSH-002      Telnet disabled           ✕ FAIL       17
LOG-001      Remote logging            ⚠ REVIEW      9
```

---

# 20. Findings / Risk Center

Route:

```text
/findings
```

Design should feel like a professional investigation workspace.

Header:

```text
Findings

37 open findings

[ Critical 5 ] [ High 14 ] [ Medium 12 ] [ Low 6 ]
```

Finding list:

```text
┌───────────────────────────────────────────────────────────┐
│ CRITICAL                                                  │
│ Telnet management access enabled                          │
│                                                           │
│ CORE-SW-01 · Cisco IOS-XE                                │
│ CIS / SSH-002                                             │
│                                                           │
│ Evidence: lines 42–45                                     │
│ Detected 8 min ago                                        │
│                                          [ Investigate → ] │
└───────────────────────────────────────────────────────────┘
```

---

# 21. Finding Detail

This page should be highly evidence-driven.

Layout:

```text
Finding
Telnet management access enabled

CRITICAL

Device
CORE-SW-01

Framework
CIS

Control
SSH-002
```

Then:

### Observed vs Expected

```text
OBSERVED
telnet enabled

EXPECTED
telnet disabled
```

### Evidence

Show actual configuration lines in a dark code panel:

```text
38  line vty 0 4
39   transport input telnet ssh
40   login local
```

Highlight the relevant evidence line.

### Normalized Fact

```text
management.telnet.enabled
false expected
true observed
```

### Remediation

```text
Recommended command:

transport input ssh

Impact:
Existing Telnet sessions may be disconnected.

Verification:
show running-config | section line vty
```

Buttons:

```text
[ Copy Command ]
[ Mark Reviewed ]
[ Generate Report ]
```

Never add a "Fix Automatically" button in the MVP.

The PRD explicitly states that remediation is generated for review and production changes are not automatically executed in the MVP. fileciteturn1file0L180-L190

---

# 22. Remediation Center

Route:

```text
/remediation
```

Group by:

```text
Critical
High
Medium
Low
```

Each remediation card:

```text
Cisco IOS-XE

Finding:
Telnet enabled

Recommended command:

transport input ssh

Risk:
May terminate active Telnet sessions.

Verification:
show running-config | section line vty

[ Copy ]
```

---

# 23. Reports

Route:

```text
/reports
```

Report dashboard:

```text
Reports

[ Generate Report ]

Recent Reports
──────────────────────────────────────────

CORE-SW-01
CIS Compliance Report
Generated 10 min ago
[ Preview ] [ Download ]

EDGE-FW-02
Security Audit
Generated 1 hour ago
[ Preview ] [ Download ]
```

---

# 24. Report Preview

Create a clean document preview.

Sections:

```text
CIPHER-X
Network Security Compliance Report

Device Information
Compliance Summary
Framework Coverage
Critical Findings
Evidence
Remediation
Configuration Hash
Audit Metadata
```

Use the same visual system as the application but make the actual report printable and restrained.

---

# 25. Configuration Drift

Route:

```text
/drift
```

Use a timeline.

```text
Configuration History

v08 ───── v09 ───── v10 ───── v11
       ↑                    ↑
   3 changes             8 changes
```

Change list:

```text
ADDED
management.logging.remote_logging = false

REMOVED
management.ssh.version = 2

CHANGED
session.timeout_seconds
600 → 900
```

Show impact:

```text
2 compliance controls changed
1 new HIGH finding
```

---

# 26. Security Graph

Route:

```text
/security-graph
```

Use an interactive graph representing:

```text
Device
  ↓
Configuration
  ↓
Security Fact
  ↓
Control
  ↓
Finding
  ↓
Risk
  ↓
Remediation
```

Example node types:

- Device
- Vendor
- Configuration
- Security Fact
- Framework
- Control
- Finding
- Risk
- Remediation

Node colors should remain subtle.

Use orange only for risk/finding emphasis.

Clicking a node opens a right-side detail drawer.

---

# 27. Natural Language Query

Route:

```text
/query
```

Create a premium analyst console.

Top:

```text
Ask CIPHER-X

Which devices allow Telnet?
```

Response:

```text
I found 17 devices where Telnet access is enabled.

HIGH RISK

1. CORE-SW-01
   Cisco IOS-XE
   Evidence: lines 38–40

2. BRANCH-RTR-04
   Cisco IOS-XE
   Evidence: lines 61–63

[ View All 17 Devices ]
```

Every answer must link back to evidence.

The PRD requires natural-language responses to cite their underlying evidence. fileciteturn1file0L217-L224

---

# 28. What-If Simulation

Route:

```text
/simulation
```

Use a before/after interface.

```text
WHAT-IF SIMULATION

Current:
management.ssh.version = 1

Change to:
management.ssh.version = 2

[ Simulate ]
```

Result:

```text
BEFORE
Compliance: 71%
Failed Controls: 12

AFTER
Compliance: 76%
Failed Controls: 9

3 controls improved
0 configuration changes applied
```

Clearly label:

> Simulation only — no production configuration was changed.

---

# 29. Audit Trail

Route:

```text
/audit
```

Timeline:

```text
14:32  Configuration uploaded
14:33  Vendor detected: Cisco
14:33  Normalization completed
14:34  3 unknown commands detected
14:38  Mapping created by Admin
14:39  Mapping approved
14:40  Configuration reprocessed
14:41  Compliance report generated
```

Each event should expose:

- User
- Timestamp
- Action
- Object
- Hash / audit reference

---

# 30. Processing States

Every asynchronous process needs clear states.

Use:

```text
Queued
Processing
Completed
Review Required
Failed
```

Example:

```text
● Processing
Normalization engine analyzing 1,284 lines...
```

Never leave users staring at an indefinite spinner.

---

# 31. Empty States

Empty states should be useful, not decorative.

Example:

```text
No findings

Your current configurations have no recorded findings
for the selected filters.

[ Run Compliance Audit ]
```

Training:

```text
No mappings require review.

CIPHER-X has no unknown configuration syntax
waiting for administrator approval.
```

---

# 32. Loading States

Use skeletons for:

- Tables
- Metric cards
- Graphs
- Finding details

For long-running AI processing use the pipeline status instead of skeletons.

---

# 33. Error States

Example:

```text
Configuration analysis failed

CIPHER-X could not complete normalization.

Reason:
Unsupported configuration format

Hash:
a4c9...72e1

[ Retry Analysis ] [ View Raw Configuration ]
```

Never expose stack traces in the UI.

---

# 34. Toast Notifications

Use compact top-right or bottom-right notifications.

Examples:

```text
✓ Configuration uploaded successfully

✓ Mapping approved and saved

✓ Compliance audit completed

⚠ 8 unknown commands require review

✕ Report generation failed
```

---

# 35. Tables

Tables should be clean and enterprise-like.

Rules:

- Avoid heavy borders
- Use horizontal separators
- Use small status indicators
- Keep row height around 52–64px
- Allow sorting
- Allow filtering
- Allow column customization where useful
- Support pagination
- Use sticky table headers for long datasets

---

# 36. Cards

Card rules:

```text
Border radius: 12–16px
Border: 1px
Shadow: extremely subtle
Padding: 20–24px
```

Avoid:

- Huge shadows
- Excessive gradients
- Floating glass cards
- Neon outlines

---

# 37. Icons

Use a consistent icon library.

Recommended:

- Lucide
- Phosphor

Icons should generally be:

```text
16px–20px
```

Use icons for recognition, not decoration.

---

# 38. Buttons

Primary:

```text
[ Run Audit ]
[ Upload Configuration ]
[ Generate Report ]
```

Primary button style:

- Orange background
- Dark text
- Medium weight
- 10–12px radius

Secondary:

```text
[ View ]
[ Preview ]
[ Copy ]
```

Use neutral surface.

Danger:

Use red only when an action is genuinely destructive.

---

# 39. Responsive Design

## Desktop

Full dashboard.

## Tablet

- Collapsible sidebar
- Two-column cards
- Simplified visualization

## Mobile

Prioritize:

1. Alerts
2. Findings
3. Devices
4. Compliance summary
5. Processing status

Complex graph and configuration comparison can become horizontally scrollable or switch to stacked panels.

---

# 40. Accessibility

Required:

- WCAG-conscious contrast
- Keyboard navigation
- Visible focus states
- Semantic HTML
- Screen-reader labels
- Do not communicate status by color alone
- Tooltips for unfamiliar icons
- Accessible code viewer
- Accessible modal dialogs

Example:

Do not use only:

```text
●
```

Use:

```text
● FAIL
```

---

# 41. Animation

Animations should be subtle.

Use:

- 150–250ms transitions
- Smooth card expansion
- Progress animations
- Graph node transitions
- Page fade/slide only when useful

Avoid:

- Constant pulsing
- Excessive parallax
- Large motion
- Animated backgrounds
- Decorative particle systems

For live analysis:

```text
Live ●
```

A tiny pulse is acceptable.

---

# 42. Security Visualization Language

CIPHER-X should visually distinguish:

### Safe

Small green indicator.

### Warning

Amber/orange indicator.

### Risk

Orange/red indicator.

### Unknown

Neutral gray indicator with review icon.

### Processing

Neutral indicator with subtle animation.

### AI Suggested

Use a small sparkle/AI icon, but never make AI suggestions look equivalent to verified evidence.

---

# 43. AI Transparency

Whenever AI is involved, display:

```text
AI Interpretation
Confidence: 87%
```

And:

```text
Evidence
Lines 42–44
```

The UI should make it clear that:

> AI interprets configuration syntax; deterministic compliance rules determine compliance.

This is a core CIPHER-X product principle from the PRD. fileciteturn1file0L23-L30

---

# 44. Evidence-First UX

Every important security decision should have an evidence trail.

Recommended interaction:

```text
Finding
   ↓
Control
   ↓
Normalized Fact
   ↓
Source Configuration
   ↓
Exact Line
```

Clicking "Evidence" should automatically open the configuration viewer at the relevant line.

This is one of the most important UX behaviors in CIPHER-X.

---

# 45. Design for Trust

CIPHER-X should constantly answer four questions:

```text
What happened?
Why did it happen?
What evidence proves it?
What should I do next?
```

For example:

```text
FAIL
Telnet is enabled.

WHY?
Control SSH-002 requires secure remote management.

EVIDENCE
config.txt lines 38–40

WHAT NEXT?
Use the recommended vendor-specific remediation.
```

---

# 46. Dashboard Information Hierarchy

The user should understand the system within 5 seconds.

Priority order:

```text
1. Overall security posture
2. Critical/high-risk findings
3. Devices requiring attention
4. Compliance coverage
5. Unknown/review items
6. Processing activity
7. Historical/drift information
```

Do not show low-priority metadata above critical security information.

---

# 47. Recommended Page Map

```text
/
├── /overview
├── /devices
│   └── /:deviceId
├── /configurations
│   ├── /upload
│   └── /:configurationId
├── /compliance
│   ├── /frameworks
│   └── /:controlId
├── /findings
│   └── /:findingId
├── /training
│   └── /:mappingId
├── /remediation
├── /reports
│   └── /:reportId
├── /drift
├── /security-graph
├── /query
├── /simulation
├── /audit
├── /frameworks
└── /settings
```

---

# 48. Suggested Component System

Create reusable components instead of designing every page independently.

```text
components/
├── layout/
│   ├── AppShell
│   ├── Sidebar
│   ├── Topbar
│   └── Breadcrumbs
│
├── dashboard/
│   ├── SecurityPosture
│   ├── MetricCard
│   ├── VendorDistribution
│   ├── RiskDistribution
│   └── AssetList
│
├── devices/
│   ├── DeviceTable
│   ├── DeviceCard
│   ├── DeviceHeader
│   └── DeviceStatus
│
├── configuration/
│   ├── UploadDropzone
│   ├── ProcessingPipeline
│   ├── ConfigViewer
│   ├── NormalizedFactPanel
│   └── EvidenceHighlight
│
├── compliance/
│   ├── ComplianceScore
│   ├── FrameworkCard
│   ├── ControlTable
│   └── StatusBadge
│
├── findings/
│   ├── FindingCard
│   ├── FindingDetail
│   ├── SeverityBadge
│   └── RemediationPanel
│
├── training/
│   ├── TrainingWorkspace
│   ├── MappingEditor
│   ├── AIInterpretation
│   └── MappingApproval
│
├── graph/
│   ├── SecurityGraph
│   └── GraphDetailsDrawer
│
└── common/
    ├── Button
    ├── Modal
    ├── Drawer
    ├── Tabs
    ├── DataTable
    ├── EmptyState
    ├── Skeleton
    └── Toast
```

---

# 49. Design Tokens

Use centralized tokens.

```css
:root {
  --cx-bg: #E9EBDD;
  --cx-surface: #F0F1E4;
  --cx-surface-2: #E1E4D3;

  --cx-dark: #101614;
  --cx-dark-surface: #151B18;
  --cx-dark-border: #303833;

  --cx-text: #111513;
  --cx-muted: #687066;

  --cx-orange: #FF7417;

  --cx-pass: #25B981;
  --cx-fail: #E05A61;
  --cx-warning: #F0A13A;
  --cx-review: #E8B84A;
  --cx-unknown: #8C9390;

  --cx-radius-sm: 8px;
  --cx-radius-md: 12px;
  --cx-radius-lg: 16px;

  --cx-space-1: 4px;
  --cx-space-2: 8px;
  --cx-space-3: 12px;
  --cx-space-4: 16px;
  --cx-space-5: 24px;
  --cx-space-6: 32px;
  --cx-space-7: 48px;
}
```

---

# 50. Critical UX Rules

## Rule 1 — Never hide evidence

Every compliance finding must allow the user to reach the original configuration evidence.

## Rule 2 — Unknown is not compliant

UNKNOWN must remain visually and logically separate from PASS.

## Rule 3 — AI does not make the final compliance decision

AI suggestions require confidence and evidence.

## Rule 4 — Human approval for learned mappings

New vendor syntax mappings must pass through Training Studio.

## Rule 5 — No automatic production remediation

The MVP only generates remediation recommendations.

## Rule 6 — Preserve configuration integrity

The original uploaded configuration is immutable evidence.

## Rule 7 — Keep security information above decoration

Every visual element should help the user understand security posture, risk, evidence, or action.

These rules are directly aligned with the PRD's product principles and evidence requirements. fileciteturn1file0L23-L30

---

# 51. Final Visual Direction

The final CIPHER-X interface should look like:

```text
Premium enterprise security platform
        +
Editorial dashboard
        +
Dark security operations workspace
        +
Warm neutral application shell
        +
Orange risk/action accent
        +
Evidence-first investigation UX
```

The visual target is **not** a traditional blue cybersecurity dashboard.

It should feel closer to a premium enterprise command center:

- Calm
- Minimal
- Dense where necessary
- Spacious elsewhere
- Strong typography
- Large meaningful metrics
- Dark analytical surfaces
- Warm neutral shell
- Orange security/action accents
- High-quality data visualization
- Clear evidence relationships

---

# 52. Implementation Instruction for Frontend Agent

When implementing this design:

1. First inspect the existing frontend structure.
2. Do not replace working backend/API logic.
3. Do not invent API fields that do not exist.
4. Reuse existing data wherever possible.
5. Create reusable design-system components.
6. Implement responsive layouts.
7. Keep the CIPHER-X color system centralized.
8. Use consistent status semantics across every page.
9. Connect every dashboard metric to real backend data when available.
10. Use realistic loading, empty, error, and processing states.
11. Do not fill the application with hardcoded fake security statistics when real data is available.
12. If a backend endpoint is missing, create a clearly isolated mock state only for UI development and document it.
13. Preserve exact evidence relationships from backend responses.
14. Never show AI-generated interpretations as verified facts without confidence/evidence.
15. Never show UNKNOWN as PASS.
16. Keep the interface visually close to the uploaded reference style while making CIPHER-X's workflows and information architecture unique.

---

# 53. Final Product Experience

A typical analyst journey should feel like:

```text
OPEN CIPHER-X
      ↓
See overall security posture
      ↓
Notice HIGH-RISK finding
      ↓
Open finding
      ↓
See failed control
      ↓
See exact configuration evidence
      ↓
Inspect normalized security fact
      ↓
Read vendor-specific remediation
      ↓
Copy remediation for manual review
      ↓
Generate report
```

For unknown syntax:

```text
UPLOAD CONFIG
      ↓
CIPHER-X detects unknown command
      ↓
AI suggests interpretation
      ↓
Administrator reviews mapping
      ↓
Mapping approved
      ↓
Configuration reprocessed
      ↓
Compliance engine evaluates controls
      ↓
Evidence-backed finding generated
```

This should be the core experience that differentiates CIPHER-X from a generic compliance dashboard.

---

# 54. Definition of Done — UI/UX

The CIPHER-X frontend design is complete when:

- [ ] CIPHER-X branding is used consistently
- [ ] Warm neutral + dark security visual language is implemented
- [ ] Sidebar and top navigation are consistent
- [ ] Overview dashboard is operational
- [ ] Security posture visualization is implemented
- [ ] Device management exists
- [ ] Configuration upload exists
- [ ] Processing pipeline is visible
- [ ] Configuration viewer supports evidence highlighting
- [ ] Universal Security Model is visually understandable
- [ ] Compliance dashboard exists
- [ ] Findings have drill-down pages
- [ ] Evidence is directly accessible
- [ ] Training Studio exists
- [ ] Remediation is clearly separated from automatic execution
- [ ] PDF report preview exists
- [ ] Drift timeline exists
- [ ] Security graph exists
- [ ] Natural-language query interface exists
- [ ] What-if simulation exists
- [ ] Audit trail exists
- [ ] Loading states exist
- [ ] Empty states exist
- [ ] Error states exist
- [ ] Responsive behavior exists
- [ ] Accessibility basics are implemented
- [ ] No excessive decorative UI is used
- [ ] No critical information is represented by color alone
- [ ] Unknown configuration never appears compliant
- [ ] Evidence is traceable from finding back to configuration

---

## CIPHER-X Design Principle

> **Make security complexity understandable without hiding the evidence.**

That principle should guide every screen, component, interaction, and visualization in the application.
