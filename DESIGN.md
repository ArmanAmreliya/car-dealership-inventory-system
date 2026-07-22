# DealerFlow Landing Page Design System

> **Document status:** Production-ready design specification  
> **Product:** DealerFlow — Enterprise AI-Powered Dealership Management Platform  
> **Scope:** Public marketing landing page (pre-authentication)  
> **Stack:** React, TypeScript, Vite, TailwindCSS, Framer Motion  
> **Last updated:** July 22, 2026

This document is the single source of truth for implementing the DealerFlow landing page. Engineers should be able to build every section, component, animation, and responsive breakpoint without additional design clarification.

**Reference material:** Layout and UX patterns were studied from a competitor dealership SaaS site and eleven reference screenshots. All branding, copy, graphics, and HTML are original to DealerFlow. Reference images are cited as **Reference Image 01–11** only.

---

## 1. Vision

### Product Vision

DealerFlow is an enterprise-grade, AI-powered dealership management platform that unifies inventory, sales, purchases, analytics, and automation into one intelligent workspace. The landing page must communicate that DealerFlow is not a legacy DMS bolt-on—it is a modern operating system for dealerships that reduces manual work, surfaces actionable insights, and scales from single-rooftop independents to multi-location groups.

### Audience

| Segment | Needs | Landing page message |
|---------|-------|----------------------|
| **Dealership owners / GMs** | ROI, efficiency, compliance, growth | "Reduce operating costs and sell faster with one platform." |
| **Sales managers** | Lead flow, deal velocity, team visibility | "Close deals with AI-assisted workflows and real-time inventory." |
| **Inventory / ops managers** | Stock accuracy, reorder signals, syndication | "Know what you have, what you need, and what's moving." |
| **IT / technical evaluators** | Security, integrations, API, uptime | "Enterprise-ready architecture with JWT auth and documented API." |
| **Early adopters** | Innovation, AI differentiation | "Automation that learns from your dealership data." |

### Business Goals

1. **Convert trials:** Drive sign-ups to `/register` and demo requests.
2. **Establish credibility:** Enterprise SaaS aesthetic, social proof, metrics, testimonials.
3. **Educate:** Explain core modules (vehicles, inventory, purchases, analytics, AI) without overwhelming.
4. **Support SEO:** Keyword-rich but original content for dealership management software.
5. **Reduce sales friction:** Clear pricing, FAQ, and multiple CTAs without aggressive pop-ups.

### Branding Goals

- Position DealerFlow as **premium, intelligent, and trustworthy**—not cheap or cluttered.
- Differentiate through **AI-native** language and visual cues (subtle gradients, insight badges, automation indicators).
- Maintain visual continuity with the authenticated app (Inter font, slate neutrals, blue primary) while elevating marketing polish.
- Never mimic competitor teal/cyan palettes or mascot-style logos.

### Emotional Feeling

Visitors should feel:

- **Confident** — "This team knows dealerships."
- **Relieved** — "Finally, one system instead of five tabs."
- **Inspired** — "AI could actually save my team hours."
- **Safe** — Clean layout, readable type, accessible interactions signal professionalism.

---

## 2. Design Philosophy

### Core Principles

| Principle | Definition | Landing page application |
|-----------|------------|--------------------------|
| **Enterprise SaaS** | Credible B2B software aesthetic | Structured grids, dashboard mockups, restrained decoration |
| **Premium** | Generous whitespace, refined typography | Wide section padding, limited color accents |
| **Clean** | No visual noise | One primary action per viewport region |
| **Modern** | Contemporary layout patterns | Split hero, floating cards, subtle motion |
| **Minimal** | Show only what supports conversion | No auto-playing audio; video is opt-in |
| **Spacious** | Breathing room between elements | 96–128px vertical section gaps on desktop |
| **Trustworthy** | Proof over hype | Stats, logos, testimonials, FAQ |
| **Scalable** | Token-driven, component-based | All values map to design tokens in Section 18 |

### Design Tenets

1. **Show the product, don't just describe it.** Every major feature section pairs copy with an original DealerFlow dashboard mockup (Section 11).
2. **Progressive disclosure.** Navbar megamenu and FAQ accordions reveal depth without initial overload.
3. **Consistent CTA hierarchy.** Primary = trial/sign-up; secondary = demo/learn more; tertiary = text links.
4. **Motion with purpose.** Animations guide attention (hero entrance, stat counters, mockup float)—never distract.
5. **Mobile-first resilience.** All sections stack gracefully; touch targets ≥ 44×44px.

---

## 3. Inspiration Analysis

Each reference screenshot was analyzed for layout, spacing, hierarchy, and interaction patterns. **DealerFlow must not reproduce any copyrighted assets, copy, or exact visual designs.**

---

### Reference Image 01 — Hero with Features Megamenu

**Purpose:** Above-the-fold conversion zone with deep navigation into product areas via a multi-column dropdown.

| Dimension | Observation |
|-----------|-------------|
| **Layout** | Full-width navbar; 50/50 hero split (copy left, media right); megamenu anchored to "Features" |
| **Spacing** | Large hero vertical padding (~120px); megamenu internal padding ~32px; 24px between menu columns |
| **Alignment** | Logo left; nav center-right; CTAs far right; hero copy left-aligned |
| **Visual hierarchy** | H1 dominates; rotating keyword in headline; video player as secondary anchor |
| **Typography** | Extra-bold H1 (~56–64px); medium gray body (~18px) |
| **Colors** | White background; blue + teal CTAs (DealerFlow replaces with navy + emerald) |
| **CTA placement** | Dual hero buttons + repeated nav CTAs |
| **Interactions** | Hover-open megamenu; video play overlay |
| **Responsive** | Megamenu becomes mobile drawer; hero stacks text above media |

**Strengths:** Immediate value prop; megamenu acts as mini-sitemap; dual conversion paths (demo vs trial).

**Weaknesses:** Hover-only megamenu excludes keyboard users if poorly implemented; rotating headline can cause layout shift without fixed width.

**DealerFlow adaptation:**
- Hero headline: **"[Enterprise | Independent | Multi-location] dealership platform"** with cross-fade rotation (4s interval, `prefers-reduced-motion` fallback: static "Enterprise").
- Megamenu categories: **Operations**, **Sales & CRM**, **Intelligence (AI)**, **Platform**—each with 4–5 original links.
- Replace video with **interactive dashboard preview** (CSS/React mockup) showing AI insight cards.
- Use DealerFlow palette: Deep Navy `#0F172A`, Electric Emerald `#10B981`, Primary Blue `#2563EB`.

---

### Reference Image 02 — Sales & Invoicing Feature Showcase

**Purpose:** Prove deal-management capability via split layout (copy + product mockup).

| Dimension | Observation |
|-----------|-------------|
| **Layout** | ~40/60 split; marketing column left; deal-builder UI right |
| **Spacing** | 80–96px section padding; 24px between feature bullet rows |
| **Alignment** | Left-aligned copy; mockup centered in right column with drop shadow |
| **Visual hierarchy** | Overline → H2 → 3 icon bullets → stacked CTAs → mockup |
| **Typography** | Small caps overline (12px, letter-spacing 0.08em); H2 ~40px bold |
| **Colors** | Light gray section bg `#F8FAFC`; white mockup card; blue primary CTA |
| **CTA placement** | Two full-width stacked buttons below feature list |
| **Interactions** | Mockup appears static; hover on primary CTA |
| **Responsive** | Copy above mockup on mobile; buttons full width |

**Strengths:** Visual proof builds trust; workflow tabs in mockup communicate process clarity.

**Weaknesses:** Dense mockup may be illegible on small screens without simplified mobile variant.

**DealerFlow adaptation:**
- Map to **Purchase Workflow** section with mockup showing: customer card, vehicle selection, finance summary sidebar, **AI Price Suggestion** widget.
- Overline: `PURCHASE WORKFLOW`
- Headline: **"Streamline every deal from inquiry to delivery"**

---

### Reference Image 03 — Website / Vehicle Search Showcase

**Purpose:** Demonstrate customer-facing inventory discovery (filter sidebar + vehicle grid).

| Dimension | Observation |
|-----------|-------------|
| **Layout** | Mockup left (~55%); copy right (~45%) — reversed split |
| **Spacing** | Wide gutter between columns (~64px) |
| **Alignment** | Vehicle cards in 3-column grid inside mockup |
| **Visual hierarchy** | Mockup draws eye first (left); headline secondary on right |
| **Typography** | Feature bullets with thin stroke icons |
| **Colors** | Navy mockup header; gold/tan action buttons inside mockup (DealerFlow: use emerald accents) |
| **CTA placement** | Stacked buttons at bottom of copy column |
| **Interactions** | Filter sidebar implies interactivity |
| **Responsive** | Mockup scales down; filters collapse to icon on mobile preview |

**Strengths:** Shows information density handled well via card grid and icon spec rows.

**Weaknesses:** Could feel like a different product (website vs DMS) if not tied to DealerFlow narrative.

**DealerFlow adaptation:**
- Reframe as **Vehicle Management** section.
- Mockup: DealerFlow admin **Vehicle Search** with filters (Make, Model, Price range, Availability) and 6 vehicle cards showing VIN, price, stock badge.
- Headline: **"Manage your entire vehicle catalog in one place"**

---

### Reference Image 04 — Hero (Simplified)

**Purpose:** Clean hero with headline, subcopy, dual CTAs, and large media container.

| Dimension | Observation |
|-----------|-------------|
| **Layout** | 45/55 hero split; subtle background blob behind media |
| **Spacing** | ~100px top/bottom hero padding |
| **Alignment** | Strict left alignment for text column |
| **Visual hierarchy** | H1 → subhead → CTAs → tertiary "View Features" link |
| **Typography** | Keyword highlight with colored underline on rotating word |
| **Colors** | White bg; light blue organic shape at 5–8% opacity |
| **CTA placement** | Side-by-side buttons on desktop |
| **Interactions** | "View Features" smooth-scrolls to first feature section |
| **Responsive** | Buttons stack; blob hidden on mobile |

**Strengths:** Clarity in 2 seconds; balanced text/visual weight.

**Weaknesses:** Generic without social proof above fold.

**DealerFlow adaptation:**
- Add **social proof pill** above H1: "Trusted by 500+ dealership professionals" (placeholder until real data).
- Background: subtle radial gradient `#EEF2FF → #FFFFFF` behind mockup (not blob copy).
- Tertiary link scrolls to `#features`.

---

### Reference Image 05 — CRM / Leads & Communications

**Purpose:** Three-pane communication hub mockup with marketing copy.

| Dimension | Observation |
|-----------|-------------|
| **Layout** | Mockup left (7 cols); copy right (4 cols) |
| **Spacing** | Three-pane mockup with 16px internal gutters |
| **Alignment** | Lead list | thread | detail sidebar |
| **Visual hierarchy** | Chat thread center; colored status badges |
| **Typography** | Overline + H2 + 3 feature rows |
| **Colors** | Status badges: replied (navy), awaiting (light blue) |
| **CTA placement** | Full-width stacked buttons in copy column |
| **Interactions** | Channel selector dropdown in mockup footer |
| **Responsive** | Single-pane simplified mockup on mobile |

**Strengths:** Industry-standard three-pane pattern instantly readable.

**Weaknesses:** Communication features may be roadmap items—label clearly if "Coming Soon" or use conceptual mockup.

**DealerFlow adaptation:**
- Place in **Automation** section or future CRM teaser.
- Right panel shows **AI Suggested Next Actions** and **Deal Probability: 78%** instead of generic tags.
- Headline: **"Automate follow-ups and never miss a lead"**

---

### Reference Image 06 — Online Checkout & Deal Builder

**Purpose:** Transactional checkout mockup with review/summary layout.

| Dimension | Observation |
|-----------|-------------|
| **Layout** | Copy left; browser-frame mockup right with main form + vehicle sidebar |
| **Spacing** | Section dividers inside mockup; 12px row padding |
| **Alignment** | Label left, `[Edit]` links right within rows |
| **Visual hierarchy** | Vehicle image in sidebar; **Total Due** emphasized |
| **Typography** | Serif or heavy sans for "Review & Complete" (DealerFlow: stick to Inter bold) |
| **Colors** | Navy header bar in mockup; white content cards |
| **CTA placement** | Marketing CTAs left; `Contact Us` inside mockup sidebar |
| **Interactions** | Editable row pattern suggests collaborative deal building |
| **Responsive** | Sidebar stacks below form in mockup on narrow view |

**Strengths:** Shows end-to-end customer journey; summary sidebar aids comprehension.

**Weaknesses:** E-commerce framing may not match B2B buyer mental model—pair with dealer-facing benefits.

**DealerFlow adaptation:**
- Use for **Purchase Workflow** alternate mockup or subsection.
- DealerFlow-branded checkout: **"Review & Complete Purchase"** with fleet buyer example.
- Highlight **staff collaboration** and **AI finance pre-qualification** in bullet copy.

---

### Reference Image 07 — Multi-Device / Mobile Apps

**Purpose:** Cross-platform availability with phone mockup and floating notifications.

| Dimension | Observation |
|-----------|-------------|
| **Layout** | Copy + app store badges left; phone mockup right with overlapping notification cards |
| **Spacing** | Notification bubbles offset ~24px from phone edge (z-depth) |
| **Alignment** | Vertically centered phone relative to text block |
| **Visual hierarchy** | Floating notifications demonstrate real-time events |
| **Typography** | H2 + 3 icon bullets |
| **Colors** | Teal notification icons (DealerFlow: emerald) |
| **CTA placement** | App store badges as secondary CTAs |
| **Interactions** | Notifications imply push alerts |
| **Responsive** | Phone centered below copy; badges wrap |

**Strengths:** Proves mobility without showing full desktop UI again.

**Weaknesses:** App store badges misleading if web-only—DealerFlow should use **"Works in any browser"** + PWA install badge until native apps exist.

**DealerFlow adaptation:**
- Section: **Platform Access** (subsection within Automation or standalone before Testimonials).
- Mockup shows mobile dashboard with **Inventory Status**, **AI Deal Analysis** cards.
- Floating notifications: "Vehicle **VIN-4821** reserved" and "Low stock alert: **3 units**".

---

### Reference Image 08 — Stock Management Feature Showcase

**Purpose:** Vehicle detail admin UI with sidebar navigation inside mockup.

| Dimension | Observation |
|-----------|-------------|
| **Layout** | Copy left; mockup right with left sidebar nav |
| **Spacing** | Card-based form sections with 24px padding |
| **Alignment** | Breadcrumbs above content; active nav indicator (blue vertical bar) |
| **Visual hierarchy** | Yellow license plate graphic + "For Sale" badge |
| **Typography** | Form labels 14px medium; values 14px regular |
| **Colors** | White cards on `#F1F5F9` mockup background |
| **CTA placement** | Dual marketing buttons below feature list |
| **Interactions** | Sidebar tab states |
| **Responsive** | Sidebar collapses to horizontal tabs in mobile mockup variant |

**Strengths:** Demonstrates deep vehicle record management.

**Weaknesses:** Form-heavy mockup can feel intimidating—balance with benefit-oriented copy.

**DealerFlow adaptation:**
- Primary section: **Inventory**.
- Mockup: DealerFlow **Vehicle Detail** page matching existing app patterns (VIN, Make, Model, Year, Price, Stock Quantity, Availability badge).
- Bullets: fast entry, competitive pricing insights, one-click syndication (future).

---

### Reference Image 09 — Footer

**Purpose:** Comprehensive site directory, contact, and SEO link hub.

| Dimension | Observation |
|-----------|-------------|
| **Layout** | 4-column grid: Brand/contact | Software | Features (2 sub-columns) | Company |
| **Spacing** | 64px top padding; 32px column gap |
| **Alignment** | All columns left-aligned |
| **Visual hierarchy** | Large phone number in accent blue; logo top-left |
| **Typography** | Column headings bold 16px; links 14px regular gray |
| **Colors** | Off-white background `#FAFAFA`; charcoal text |
| **CTA placement** | Phone number as primary footer CTA |
| **Interactions** | Social icons hover darken |
| **Responsive** | 2×2 grid tablet; accordion columns mobile |

**Strengths:** SEO-rich feature links; clear support path.

**Weaknesses:** Very long link lists can overwhelm mobile users.

**DealerFlow adaptation:**
- Columns: **DealerFlow** (brand + support email) | **Product** | **Features** | **Company**
- Support: `support@dealerflow.io` (placeholder) instead of competitor phone.
- Social: LinkedIn, X, GitHub (if open-source components)—original icons only.
- Copyright: `© 2026 DealerFlow. All rights reserved.`

---

### Reference Image 10 — FAQ Accordion

**Purpose:** SEO-friendly objection handling near page bottom.

| Dimension | Observation |
|-----------|-------------|
| **Layout** | Centered narrow column (~720px max); 9+ accordion rows |
| **Spacing** | 24px vertical padding per row; 1px divider lines |
| **Alignment** | Question left; expand icon right |
| **Visual hierarchy** | Centered H2; questions equal weight |
| **Typography** | H2 ~32px; questions 16–18px |
| **Colors** | Plus icon in brand blue |
| **CTA placement** | None in section—conversion happens after reading |
| **Interactions** | Click/tap expands answer; icon rotates 45° to × |
| **Responsive** | Full width with 16px horizontal padding on mobile |

**Strengths:** Clean, scannable, excellent for long-tail SEO.

**Weaknesses:** Walls of text in answers hurt mobile UX—keep answers concise.

**DealerFlow adaptation:**
- Title: **"DealerFlow Platform Questions"**
- 8–10 original questions focused on AI, multi-location, inventory, security, migration, pricing.
- Framer Motion height animation; full ARIA accordion pattern (Section 14).

---

### Reference Image 11 — Scrape.do Playground Dashboard (SaaS App UI Reference)

**Purpose:** Technical configuration UI—sidebar nav, card grid, toggles, code preview. Included as **application UI pattern reference**, not landing layout.

| Dimension | Observation |
|-----------|-------------|
| **Layout** | Fixed left sidebar + flexible main; main split into primary + config column |
| **Spacing** | 8–12px radius cards; 24px card padding |
| **Alignment** | Strict grid alignment |
| **Visual hierarchy** | Primary action button bottom-right of config area |
| **Typography** | Section headings bold; labels 13px |
| **Colors** | Light gray page bg; white cards; blue active nav |
| **Interactions** | Toggle switches; tab pills for language samples |
| **Responsive** | Sidebar collapses to drawer |

**Strengths:** Handles complex density via card grouping and familiar patterns.

**Weaknesses:** Developer-focused—not appropriate for landing page aesthetic verbatim.

**DealerFlow adaptation:**
- Apply **card-based modular layout** to all dashboard mockups on landing page.
- Use **toggle aesthetic** in Automation section for AI feature switches (visual only in mockup).
- Sidebar nav pattern aligns with existing DealerFlow app `Sidebar.tsx` for visual continuity.

---

## 4. Information Architecture

### Page Flow (Top to Bottom)

```
┌─────────────────────────────────────────────────────────────┐
│  Skip Link → Navbar (sticky)                                │
├─────────────────────────────────────────────────────────────┤
│  1. Hero                                                    │
│  2. Trusted By (logo bar)                                   │
│  3. Statistics                                              │
│  4. Vehicle Management                                      │
│  5. Inventory                                               │
│  6. Purchase Workflow                                       │
│  7. Analytics                                               │
│  8. AI Features                                             │
│  9. Automation                                              │
│ 10. Testimonials                                            │
│ 11. Pricing                                                 │
│ 12. FAQ                                                     │
│ 13. Final CTA Band                                          │
│ 14. Footer                                                  │
└─────────────────────────────────────────────────────────────┘
```

### Section Rationale

| # | Section | ID | Why it exists |
|---|---------|-----|---------------|
| — | **Navbar** | — | Persistent navigation, conversion paths, feature discovery via megamenu |
| 1 | **Hero** | `#top` | Immediate value proposition; primary conversion |
| 2 | **Trusted By** | `#trusted` | Social proof reduces perceived risk |
| 3 | **Statistics** | `#stats` | Quantified impact (vehicles managed, uptime, time saved) |
| 4 | **Vehicle Management** | `#vehicles` | Core module—catalog CRUD, search, filters |
| 5 | **Inventory** | `#inventory` | Stock levels, availability, alerts—operational heart |
| 6 | **Purchase Workflow** | `#purchases` | Revenue path—how deals close in DealerFlow |
| 7 | **Analytics** | `#analytics` | Data-driven decision making for GMs |
| 8 | **AI Features** | `#ai` | Primary differentiator—predictive insights, automation |
| 9 | **Automation** | `#automation` | Workflow efficiency, notifications, integrations |
| 10 | **Testimonials** | `#testimonials` | Human proof from dealership roles |
| 11 | **Pricing** | `#pricing` | Transparent plans reduce sales cycle friction |
| 12 | **FAQ** | `#faq` | Objection handling + SEO |
| 13 | **Final CTA** | `#get-started` | Last conversion opportunity before footer |
| 14 | **Footer** | — | Legal, navigation, contact, SEO links |

### Navbar Structure

```
Logo | Features ▼ | Pricing | FAQ | Docs |     [Log In] [Start Free Trial]
         │
         └── Megamenu (desktop hover + click, mobile drawer)
               ├── Operations: Vehicle Management, Inventory, Purchases
               ├── Intelligence: AI Insights, Predictive Stock, Smart Pricing
               ├── Analytics: Dashboard, Reports, Trends
               └── Platform: Security, API, Integrations, Mobile Access
```

**Routes:**
- Log In → `/login`
- Start Free Trial → `/register`
- Watch Demo → `#hero-demo` (scroll) or modal (Phase 2)
- Docs → `/api/docs` (Swagger) or future docs site

---

## 5. Wireframes

### 5.1 Desktop (≥1280px)

#### Navbar
```
┌──────────────────────────────────────────────────────────────────────────┐
│ [Logo DealerFlow]   Features▾  Pricing  FAQ  Docs     [Login] [Trial]   │
└──────────────────────────────────────────────────────────────────────────┘
```

#### Hero
```
┌──────────────────────────────────────────────────────────────────────────┐
│  ┌─────────────────────────────┐  ┌──────────────────────────────────┐  │
│  │ ● Trusted by 500+ dealers   │  │                                  │  │
│  │                             │  │     [ Dashboard Preview Mockup ] │  │
│  │  Enterprise | dealership    │  │     [ AI Insight Cards floating] │  │
│  │  platform                   │  │                                  │  │
│  │                             │  │                                  │  │
│  │  Subheadline copy...        │  │                                  │  │
│  │                             │  │                                  │  │
│  │ [Watch Demo] [Free Trial]   │  │                                  │  │
│  │  View Features →            │  │                                  │  │
│  └─────────────────────────────┘  └──────────────────────────────────┘  │
└──────────────────────────────────────────────────────────────────────────┘
```

#### Trusted By
```
┌──────────────────────────────────────────────────────────────────────────┐
│           We partner with dealerships nationwide                         │
│   [Logo] [Logo] [Logo] [Logo] [Logo] [Logo]   (grayscale, 6–8 placeholders)│
└──────────────────────────────────────────────────────────────────────────┘
```

#### Statistics
```
┌──────────────────────────────────────────────────────────────────────────┐
│  ┌────────────┐ ┌────────────┐ ┌────────────┐ ┌────────────┐            │
│  │  50,000+   │ │   99.9%    │ │   40%      │ │   24/7     │            │
│  │  Vehicles  │ │  Uptime    │ │ Time Saved │ │  Support   │            │
│  │  managed   │ │  SLA       │ │  on ops    │ │  access    │            │
│  └────────────┘ └────────────┘ └────────────┘ └────────────┘            │
└──────────────────────────────────────────────────────────────────────────┘
```

#### Feature Section (Template — Vehicle Management, Inventory, etc.)
```
┌──────────────────────────────────────────────────────────────────────────┐
│  ┌──────────────────────────┐    ┌────────────────────────────────────┐  │
│  │ OVERLINE                 │    │                                    │  │
│  │ Headline                 │    │   [ Section-specific Dashboard     │  │
│  │                          │    │     Mockup Component ]             │  │
│  │ ○ Benefit one            │    │                                    │  │
│  │ ○ Benefit two            │    │                                    │  │
│  │ ○ Benefit three          │    │                                    │  │
│  │                          │    │                                    │  │
│  │ [Learn More]             │    │                                    │  │
│  │ [Start Free Trial]       │    │                                    │  │
│  └──────────────────────────┘    └────────────────────────────────────┘  │
└──────────────────────────────────────────────────────────────────────────┘
```
*Alternate sections flip mockup left / copy right (zigzag pattern).*

#### AI Features (Centered variant)
```
┌──────────────────────────────────────────────────────────────────────────┐
│                    ARTIFICIAL INTELLIGENCE                               │
│              AI that understands your dealership                         │
│         Subcopy about predictive inventory and pricing...                │
│  ┌──────────────┐ ┌──────────────┐ ┌──────────────┐ ┌──────────────┐   │
│  │ Smart Stock  │ │ Price Engine │ │ Lead Score   │ │ Auto Reports │   │
│  │   [icon]     │ │   [icon]     │ │   [icon]     │ │   [icon]     │   │
│  └──────────────┘ └──────────────┘ └──────────────┘ └──────────────┘   │
│              [ Explore AI Features ]                                     │
└──────────────────────────────────────────────────────────────────────────┘
```

#### Testimonials
```
┌──────────────────────────────────────────────────────────────────────────┐
│                   Loved by dealership teams                              │
│  ┌─────────────────┐ ┌─────────────────┐ ┌─────────────────┐          │
│  │ "Quote..."      │ │ "Quote..."      │ │ "Quote..."      │          │
│  │ ○ Name          │ │ ○ Name          │ │ ○ Name          │          │
│  │   Role, Dealer  │ │   Role, Dealer  │ │   Role, Dealer  │          │
│  └─────────────────┘ └─────────────────┘ └─────────────────┘          │
│                    ● ○ ○   (carousel dots)                               │
└──────────────────────────────────────────────────────────────────────────┘
```

#### Pricing
```
┌──────────────────────────────────────────────────────────────────────────┐
│                         Simple, transparent pricing                      │
│              Start free. Scale as your dealership grows.                 │
│  ┌─────────────────┐ ┌─────────────────┐ ┌─────────────────┐          │
│  │ Starter         │ │ Professional ★  │ │ Enterprise      │          │
│  │ $0/mo           │ │ $149/mo         │ │ Custom          │          │
│  │ • feature       │ │ • feature       │ │ • feature       │          │
│  │ [Start Free]    │ │ [Start Trial]   │ │ [Contact Sales] │          │
│  └─────────────────┘ └─────────────────┘ └─────────────────┘          │
└──────────────────────────────────────────────────────────────────────────┘
```

#### FAQ
```
┌──────────────────────────────────────────────────────────────────────────┐
│              DealerFlow Platform Questions                               │
│  ─────────────────────────────────────────────────────────────────────   │
│  What is DealerFlow?                                              [+]    │
│  ─────────────────────────────────────────────────────────────────────   │
│  How does AI inventory prediction work?                           [+]    │
│  ─────────────────────────────────────────────────────────────────────   │
│  ... (6–8 more)                                                          │
└──────────────────────────────────────────────────────────────────────────┘
```

#### Final CTA
```
┌──────────────────────────────────────────────────────────────────────────┐
│ ░░░░░░░░░░░░░░░░░  Dark navy gradient background  ░░░░░░░░░░░░░░░░░░░░░  │
│         Ready to modernize your dealership?                              │
│         Start your free trial today — no credit card required.           │
│              [Start Free Trial]    [Schedule Demo]                     │
└──────────────────────────────────────────────────────────────────────────┘
```

#### Footer
```
┌──────────────────────────────────────────────────────────────────────────┐
│ [Logo]              Product           Features          Company          │
│ Description         • Pricing         • Vehicles        • About          │
│ support@...         • Demo            • Inventory       • Blog           │
│ [social icons]      • Login           • AI              • Contact        │
│ ───────────────────────────────────────────────────────────────────────  │
│              © 2026 DealerFlow  |  Privacy  |  Terms  |  Status          │
└──────────────────────────────────────────────────────────────────────────┘
```

---

### 5.2 Tablet (768px – 1023px)

```
Navbar: Logo | [☰ Menu drawer]                    [Trial]

Hero: Single column
┌──────────────────────┐
│ Trusted pill         │
│ Headline             │
│ Subcopy              │
│ [Demo] [Trial]       │
│ [Mockup full width]  │
└──────────────────────┘

Feature sections: Stack copy above mockup (always copy first)

Stats: 2×2 grid

AI cards: 2×2 grid

Testimonials: 1 visible + swipe

Pricing: 3 cards horizontal scroll OR stacked with "Popular" highlighted

FAQ: Full width with 24px margins

Footer: 2×2 column grid
```

---

### 5.3 Mobile (<768px)

```
Navbar: 56px height | Logo center-left | ☰ right

Hero:
┌─────────────────┐
│ Pill            │
│ H1 (36px)       │
│ Subcopy         │
│ [Trial full w]  │
│ [Demo full w]   │
│ Mockup 100% w   │
└─────────────────┘

Trusted By: Horizontal scroll marquee (passive) or 2 visible logos

Stats: 1 column, 4 stacked cards

Features: Copy → Mockup → CTAs (full width buttons, 48px height)

AI: 1 column cards

Testimonials: Single card carousel

Pricing: Stacked cards, Professional first (reorder for conversion)

FAQ: Full bleed dividers

CTA band: Stacked buttons

Footer: Accordion sections (Product, Features, Company)
```

---

### 5.4 Very Small Mobile (<375px)

- Reduce H1 to 32px
- Section horizontal padding: 16px (from 24px)
- Hide mockup fine details—show simplified `MockupMobile` variant
- Megamenu full-screen overlay
- Stats values scale to 28px

---

## 6. Grid System

### Containers

| Token | Value | Usage |
|-------|-------|-------|
| `container-max` | `1280px` | Default content wrapper |
| `container-wide` | `1440px` | Hero, feature mockup sections |
| `container-narrow` | `720px` | FAQ, centered headings |
| `container-text` | `640px` | Long-form subcopy |

```text
Desktop:  max-width + horizontal padding 24px (md: 32px, lg: 48px)
Tablet:   padding 24px
Mobile:   padding 16px
```

### Column Grid

- **12-column grid** with `24px` gutter (desktop)
- Feature split sections: **5 cols copy / 7 cols mockup** (or reversed)
- Hero: **6 / 6** split on `lg+`

### Breakpoints

| Name | Min width | Max width | Columns |
|------|-----------|-----------|---------|
| `xs` | 0 | 374px | 4 (implicit) |
| `sm` | 375px | 639px | 4 |
| `md` | 640px | 767px | 8 |
| `lg` | 768px | 1023px | 12 |
| `xl` | 1024px | 1279px | 12 |
| `2xl` | 1280px | — | 12 |

### Section Spacing

| Breakpoint | Vertical padding (top + bottom each) |
|------------|--------------------------------------|
| Mobile | `64px` (py-16) |
| Tablet | `80px` (py-20) |
| Desktop | `96px` (py-24) |
| Hero desktop | `120px` top, `80px` bottom |

### Margins

- Between heading and subcopy: `16px`
- Between subcopy and content: `32px`
- Between feature bullet items: `24px`
- Between stacked buttons: `12px`

---

## 7. Typography

### Font Family

```text
Primary: Inter, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif
Monospace (code in mockups): 'JetBrains Mono', 'Fira Code', ui-monospace, monospace
```

Inter is already configured in `globals.css`—load via `@fontsource/inter` or Google Fonts with `display=swap`.

### Type Scale

| Token | Element | Size (desktop) | Size (mobile) | Weight | Line height | Letter spacing |
|-------|---------|----------------|---------------|--------|-------------|----------------|
| `display` | Hero H1 | 56px / 3.5rem | 36px / 2.25rem | 800 | 1.1 | -0.02em |
| `h1` | Page titles | 48px | 32px | 700 | 1.15 | -0.02em |
| `h2` | Section titles | 40px | 28px | 700 | 1.2 | -0.015em |
| `h3` | Card titles | 24px | 20px | 600 | 1.3 | -0.01em |
| `h4` | Subsection | 20px | 18px | 600 | 1.35 | 0 |
| `body-lg` | Hero subcopy | 20px | 18px | 400 | 1.6 | 0 |
| `body` | Paragraphs | 16px | 16px | 400 | 1.6 | 0 |
| `body-sm` | Secondary | 14px | 14px | 400 | 1.5 | 0 |
| `overline` | Section labels | 12px | 11px | 600 | 1.4 | 0.08em |
| `caption` | Meta, legal | 12px | 12px | 400 | 1.4 | 0.01em |
| `button-lg` | Hero CTAs | 16px | 16px | 600 | 1 | 0.01em |
| `button` | Standard CTAs | 14px | 14px | 600 | 1 | 0.01em |
| `stat` | Stat numbers | 48px | 36px | 700 | 1 | -0.02em |

### Heading Hierarchy (Semantic HTML)

```html
<h1> — Once per page (Hero)
<h2> — Section titles (Features, Pricing, FAQ)
<h3> — Card titles, FAQ questions (use button inside for accordion)
<h4> — Footer column headings, mockup subheadings
```

### Responsive Scaling

- Use `clamp()` for fluid hero typography: `clamp(2.25rem, 5vw, 3.5rem)`
- Overline always uppercase via CSS `text-transform: uppercase`
- Max line length for body: `65ch`

---

## 8. Color System

DealerFlow extends existing app tokens with marketing-specific accents. All combinations must meet WCAG AA contrast (Section 14).

### Brand Palette

| Token | Light Mode | Dark Mode | Usage |
|-------|------------|-----------|-------|
| `primary-50` | `#EFF6FF` | `#1E3A5F` | Tinted backgrounds |
| `primary-100` | `#DBEAFE` | `#1E40AF` | Hover backgrounds |
| `primary-500` | `#3B82F6` | `#60A5FA` | Links, icons |
| `primary-600` | `#2563EB` | `#3B82F6` | Primary buttons, focus rings |
| `primary-700` | `#1D4ED8` | `#2563EB` | Button hover |
| `secondary-500` | `#6366F1` | `#818CF8` | Secondary charts, badges |
| `accent-500` | `#10B981` | `#34D399` | AI highlights, success CTAs |
| `accent-600` | `#059669` | `#10B981` | Accent button hover |

### Neutrals

| Token | Light | Dark |
|-------|-------|------|
| `neutral-50` | `#F8FAFC` | `#0F172A` |
| `neutral-100` | `#F1F5F9` | `#1E293B` |
| `neutral-200` | `#E2E8F0` | `#334155` |
| `neutral-400` | `#94A3B8` | `#64748B` |
| `neutral-500` | `#64748B` | `#94A3B8` |
| `neutral-700` | `#334155` | `#CBD5E1` |
| `neutral-900` | `#0F172A` | `#F8FAFC` |

### Semantic Colors

| Token | HEX | Usage |
|-------|-----|-------|
| `success` | `#22C55E` | Positive trends, available stock |
| `warning` | `#F59E0B` | Low stock, caution badges |
| `error` | `#EF4444` | Errors, out of stock |
| `info` | `#0EA5E9` | Informational callouts |

### Backgrounds

| Context | Light | Dark |
|---------|-------|-------|
| Page default | `#FFFFFF` | `#0F172A` |
| Alternate section | `#F8FAFC` | `#1E293B` |
| CTA band | `linear-gradient(135deg, #0F172A 0%, #1E3A5F 100%)` | same |
| Mockup canvas | `#F1F5F9` | `#334155` |
| Card surface | `#FFFFFF` | `#1E293B` |

### Text Colors

| Role | Light | Dark |
|------|-------|------|
| Primary text | `#0F172A` | `#F1F5F9` |
| Secondary text | `#64748B` | `#94A3B8` |
| Inverse (on dark CTA) | `#FFFFFF` | `#FFFFFF` |
| Link | `#2563EB` | `#60A5FA` |
| Link hover | `#1D4ED8` | `#93C5FD` |

### AI Feature Accent Gradient (Decorative Only)

```text
linear-gradient(135deg, #6366F1 0%, #10B981 100%)
```
Use at ≤15% opacity for backgrounds, or as 2px top border on AI cards.

---

## 9. Spacing System

### Base Unit

**4px grid** — all spacing values are multiples of 4.

### Scale

| Token | Value | Usage |
|-------|-------|-------|
| `space-1` | 4px | Tight icon gaps |
| `space-2` | 8px | Inline elements |
| `space-3` | 12px | Button icon gap, stacked buttons |
| `space-4` | 16px | Card padding (mobile), heading margin |
| `space-5` | 20px | — |
| `space-6` | 24px | Feature list gaps, grid gutter mobile |
| `space-8` | 32px | Card padding (desktop), section sub-gaps |
| `space-10` | 40px | — |
| `space-12` | 48px | Container horizontal padding (desktop) |
| `space-16` | 64px | Section padding mobile |
| `space-20` | 80px | Section padding tablet |
| `space-24` | 96px | Section padding desktop |
| `space-32` | 128px | Hero top padding |

### Component Spacing

| Component | Padding | Gap |
|-----------|---------|-----|
| Navbar | `0 48px` (h: 64px) | nav items `32px` |
| Button lg | `16px 32px` | icon `8px` |
| Button md | `12px 24px` | icon `8px` |
| Feature card | `24px` | — |
| Stat card | `24px` | — |
| Testimonial card | `32px` | — |
| FAQ row | `20px 0` | — |
| Footer | `64px 48px 32px` | columns `48px` |

### Section Spacing Rules

1. Alternate `#FFFFFF` and `#F8FAFC` backgrounds between feature sections for rhythm.
2. No two adjacent sections share identical background without a visual divider.
3. Final CTA band breaks rhythm with dark gradient.

---

## 10. Components

---

### 10.1 Navbar

**Purpose:** Global navigation, brand presence, persistent conversion access.

**Layout:**
- Height: `64px` (desktop), `56px` (mobile)
- Sticky top, `z-index: 50`
- Background: `white/80` backdrop-blur on scroll (glass effect)
- Border bottom: `1px solid neutral-200` after scroll threshold (8px)

**Variants:**
- `transparent` — at page top over hero (white text → switches on scroll)
- `solid` — scrolled state (white bg, dark text)

**Structure:**
```
[Logo] [NavLinks + Megamenu] [Actions: Login + Trial]
```

**Megamenu:**
- Trigger: "Features" with chevron
- Panel: full-width dropdown, max-width container, 4 columns
- Open: hover (desktop) + click toggle; `focus-within` for keyboard
- Close: Escape, click outside, tab out
- Animation: fade + translateY(8px → 0), 200ms

**States:**
- Default, hover, active link (primary-600 + 2px bottom border)
- Mobile drawer open (overlay + slide from right)

**Accessibility:**
- `<nav aria-label="Main">`
- Megamenu: `aria-expanded`, `aria-haspopup="true"`
- Mobile menu: focus trap, return focus to toggle on close
- Skip link targets `#main-content`

**Responsive:**
- `< lg`: hamburger replaces nav links; megamenu becomes nested accordion in drawer

**Animations:**
- Scroll: background transition 200ms
- Megamenu: Framer Motion `AnimatePresence`

---

### 10.2 Hero

**Purpose:** Primary conversion and product positioning.

**Layout:** Two-column `lg:grid-cols-2`, gap `48px`, min-height `calc(100vh - 64px)` optional (min 600px).

**Content order:**
1. Social proof pill
2. H1 with rotating keyword span
3. Body-lg subcopy (max 2 sentences)
4. Button group (Demo + Trial)
5. Tertiary scroll link

**Variants:**
- `default` — mockup preview right
- `video` — Phase 2 optional demo video with play button (never autoplay)

**States:** N/A (static content)

**Accessibility:**
- Rotating text: `aria-live="polite"` on span, or static fallback for reduced motion
- Mockup decorative: `aria-hidden="true"` with descriptive `alt=""` on meaningful images only

**Responsive:** Stack; mockup below copy; buttons full-width mobile

**Animations:**
- Stagger fade-up: pill → h1 → subcopy → buttons (100ms delay each)
- Mockup: subtle float loop (translateY ±6px, 4s ease-in-out)
- Rotating keyword: crossfade 400ms

---

### 10.3 Buttons

**Purpose:** All interactive calls to action.

| Variant | Background | Text | Border | Usage |
|---------|------------|------|--------|-------|
| `primary` | primary-600 | white | none | Main conversion |
| `secondary` | accent-500 | white | none | Secondary conversion |
| `outline` | transparent | primary-600 | 1px primary-600 | Tertiary actions |
| `ghost` | transparent | neutral-700 | none | Nav links styled as buttons |
| `inverse` | white | primary-700 | none | On dark CTA band |

**Sizes:**

| Size | Height | Padding | Font |
|------|--------|---------|------|
| `lg` | 48px | 16px 32px | button-lg |
| `md` | 44px | 12px 24px | button |
| `sm` | 36px | 8px 16px | body-sm, weight 600 |

**States:**
- Hover: darken 1 step, subtle shadow
- Active: scale(0.98)
- Focus: 2px ring primary-500 offset 2px
- Disabled: opacity 0.5, no pointer
- Loading: spinner replaces label, `aria-busy="true"`

**Accessibility:** `<button>` or `<a role="button">` with descriptive text (no "Click here")

**Responsive:** Full width in mobile hero and feature sections

**Animations:** `whileTap={{ scale: 0.98 }}` via Framer Motion

---

### 10.4 Cards

**Purpose:** Stats, features, testimonials, pricing tiers.

**Base styles:**
- Background: white (or dark surface)
- Border: `1px solid neutral-200`
- Radius: `12px` (see tokens)
- Shadow: `elevation-1` default, `elevation-2` on hover

**Variants:**
- `stat` — icon top-right, large number, label, description
- `feature` — icon top, title, body (AI section grid)
- `testimonial` — quote, avatar, name, role
- `pricing` — tier name, price, feature list, CTA; `popular` variant with primary border + badge

**States:** hover lift (`translateY -4px`, shadow increase)

**Accessibility:** Semantic headings inside cards; pricing features as `<ul>`

**Responsive:** Grid columns adjust per section

**Animations:** Scroll-triggered fade-up stagger

---

### 10.5 Stats

**Purpose:** Quantified credibility row.

**Layout:** 4-column grid desktop; animated count-up numbers.

**Content (placeholder — replace with verified metrics):**
- 50,000+ Vehicles Managed
- 99.9% Platform Uptime
- 40% Avg. Time Saved
- 24/7 Expert Support

**Accessibility:** Numbers in `<strong>`; full context in visible labels (not number alone)

**Animations:** Count from 0 to target over 2s when 30% in viewport; respect reduced motion (show final value)

---

### 10.6 Dashboard Mockups

**Purpose:** Visual product proof in feature sections.

**Wrapper:**
- Outer: `rounded-xl shadow-2xl border border-neutral-200 overflow-hidden`
- Optional browser chrome bar (3 dots) for marketing polish
- Background canvas: neutral-100

**Rules:**
- All mockups are **original SVG/React illustrations**—never competitor screenshots
- Match authenticated app visual language (Sidebar, Header, card styles)
- Include subtle **AI badge** where relevant (purple/emerald dot + "AI" label)

**Responsive:**
- Desktop: full detail
- Tablet: 90% scale
- Mobile: `MockupSimplified` variant hiding sidebar/text below 12px

**Animations:** Scroll reveal slide-in from mockup side (left or right based on column)

---

### 10.7 Feature Cards (AI Section)

**Purpose:** Highlight AI capabilities in scannable grid.

**Layout:** 4 columns desktop, 2 tablet, 1 mobile

**Each card:**
- Gradient top border (2px)
- Icon in rounded square (primary-50 bg)
- Title (h3)
- 2-line description

**Items:**
1. Smart Stock Forecasting
2. Dynamic Pricing Engine
3. Lead Scoring & Prioritization
4. Automated Reporting

---

### 10.8 Testimonials

**Purpose:** Social proof from dealership personas.

**Layout:** 3 cards desktop; carousel mobile/tablet

**Card content:**
- 5-star row (SVG stars, accent color)
- Blockquote (max 180 chars)
- Avatar (48px circle, initials fallback)
- Name + role + dealership type

**Accessibility:** Carousel with `aria-roledescription="carousel"`, prev/next buttons, pause on hover

**Animations:** Slide transition 300ms ease

---

### 10.9 FAQ

**Purpose:** Answer objections; SEO content.

**Layout:** Narrow container, accordion list

**Item structure:**
```
<button aria-expanded="false" aria-controls="faq-1">
  Question text                    [+ icon]
</button>
<div id="faq-1" hidden>Answer text</div>
```

**Behavior:**
- Single or multi-expand (recommend **multi-expand** for SEO crawlability—all answers in DOM)
- Icon rotates 45° when open
- Answer animates height via Framer Motion

**Sample questions (original copy):**
1. What is DealerFlow?
2. How does DealerFlow's AI predict inventory needs?
3. Can I manage multiple dealership locations?
4. Is my data secure?
5. Does DealerFlow integrate with my existing tools?
6. How long does setup take?
7. What support is included?
8. Can I import existing vehicle stock?

---

### 10.10 Footer

**Purpose:** Secondary navigation, legal, contact.

**Layout:** 4 columns → 2 → accordion

**Content columns:** Defined in Section 4

**Bottom bar:** Copyright + policy links, centered, caption size

**Accessibility:** `<footer>` landmark; heading elements for columns

**Responsive:** Accordion on mobile with `aria-expanded` per column

---

## 11. Dashboard Mockups

All mockups are **original DealerFlow compositions** built as React components with static demo data. They must visually align with the authenticated app (`DashboardLayout`, `StatsCards`, `InventoryTable`, etc.) but use fictional data.

---

### 11.1 Vehicle Table Mockup

**Used in:** Vehicle Management section

**Structure:**
- Top bar: DealerFlow logo, search input, "Add Vehicle" button
- Filter chips: Make, Model, Year, Availability, Price Range
- Table columns: Thumbnail, Make/Model, Year, VIN (truncated), Price, Stock, Status badge, Actions
- 5–6 rows with varied data
- Pagination footer

**Visual details:**
- Status badges: Available (green), Low Stock (amber), Sold (gray)
- Row hover: neutral-50 background
- Thumbnail: generic car silhouette SVG (original asset)

---

### 11.2 Inventory Dashboard Mockup

**Used in:** Inventory section

**Structure:**
- 4 KPI cards (mirror `StatsCards`): Total Vehicles, Available, Low/Out of Stock, Availability Rate
- Donut chart: stock distribution (reuse chart styling from `InventoryCharts`)
- Low inventory alert list (3 items with "Reorder" ghost buttons)

**AI element:** Small card "AI Reorder Suggestion: 2024 SUV models trending +18% in your region"

---

### 11.3 Analytics Mockup

**Used in:** Analytics section

**Structure:**
- Header: "Sales Analytics" + date range selector
- Line chart: Monthly revenue trend (6 months)
- Bar chart: Sales by vehicle category
- Side panel: Top performing models list

**Colors:** primary-500 line, secondary-500 bars, neutral grid lines

---

### 11.4 Purchase Flow Mockup

**Used in:** Purchase Workflow section

**Structure:**
- Tab bar: Deal | Finance | Confirm | Complete
- Left: Customer info card, Vehicle selection card, Payment method
- Right sidebar: Order summary, line items, **Total Due** bold
- AI widget: "Suggested discount: 3% based on inventory age"

---

### 11.5 Reports Mockup

**Used in:** Analytics subsection or Automation

**Structure:**
- Report list left: Sales Summary, Inventory Aging, Purchase History
- Preview right: PDF-style preview with DealerFlow header, date, table of figures

---

### 11.6 Charts

**Shared chart styling:**
- Grid: neutral-200 dashed
- Tooltip: white card, shadow, 12px radius
- No chart library required for landing—CSS/SVG static charts acceptable for v1
- Phase 2: Recharts for animated chart draw on scroll

---

### 11.7 Notifications

**Used in:** Automation section (floating elements)

**Structure:**
- Rounded notification cards, light lavender-gray bg `#F5F3FF`
- Icon: emerald car or document
- Text pattern: "**Entity** has been **action** by **User**"
- Examples:
  - "Vehicle **VIN-9284** marked available"
  - "Purchase **#1042** completed by **Alex Rivera**"
  - "AI Alert: Restock **SUV inventory** within 14 days"

**Placement:** Overlap phone/device mockup with z-index layering

---

### 11.8 Calendar

**Used in:** Automation mockup (optional mini widget)

**Structure:**
- Month view snippet with 3 highlighted appointment dots
- Labels: Test drive, Delivery, Service follow-up

---

### 11.9 Customer Management Mockup

**Used in:** Automation or Purchase Workflow

**Structure:**
- Three-pane: customer list | conversation thread | detail panel
- Detail panel fields: Email, Phone, Vehicles of Interest, Tags
- AI panel: "Deal Probability: 82%" progress bar, "Suggested next action: Send finance pre-approval"

---

### Mockup Data Guidelines

- Use fictional names, VINs, prices
- Currency: `$` with US formatting by default (i18n Phase 2)
- Never use real dealership trademarks in mockups
- Keep text readable at mockup display size (min 11px inside mockups)

---

## 12. Motion Design

### Global Principles

- Duration: 150ms (micro), 200ms (standard), 300ms (emphasis), 600ms (hero)
- Easing: `cubic-bezier(0.4, 0, 0.2, 1)` default; spring for playful elements `{ stiffness: 300, damping: 30 }`
- **`prefers-reduced-motion: reduce`:** Disable float loops, count-up, parallax; instant opacity fades only

### Page Load

1. Navbar fades in (opacity 0→1, 200ms)
2. Hero staggers children (Section 10.2)
3. Below-fold sections: no load animation (scroll triggered only)

### Scroll Animations

Use `whileInView` with `viewport={{ once: true, margin: "-80px" }}`:

| Element | Animation |
|---------|-----------|
| Section headings | fade up 24px, 400ms |
| Feature copy | fade up, 400ms |
| Mockups | fade + slide from side 40px, 500ms |
| Stat numbers | count up 2000ms |
| AI cards | stagger 100ms each |
| Testimonials | fade in 300ms |

### Hover Effects

| Element | Effect |
|---------|--------|
| Buttons | darken + scale 0.98 tap |
| Cards | translateY -4px, shadow elevation-2 |
| Nav links | color transition + underline grow |
| Mockups | subtle scale 1.01 (desktop only) |
| Footer links | color primary-600 |

### Counters

- Library: custom hook or `react-countup`
- Trigger: Intersection Observer at 30% visibility
- Format: preserve suffix (`+`, `%`)

### Navbar

- Scroll > 8px: add background blur + border (200ms)
- Megamenu: AnimatePresence height/opacity

### Loading States

- Landing page is static—minimal loading
- If demo video added: skeleton rectangle with shimmer in mockup area
- Button loading spinner: 16px, 1.5px stroke

### Framer Motion Recommendations

```text
Import selectively: motion, AnimatePresence, useReducedMotion
Wrap sections in <motion.section>
Use useReducedMotion() to branch animations
Avoid animating layout-affecting properties on mobile (width, height) — prefer transform/opacity
Lazy-load framer-motion via dynamic import if bundle size critical (unlikely for landing)
```

---

## 13. Responsive Strategy

### Desktop (≥1280px)

- Full megamenu, 6/6 hero, zigzag features, 4-col stats, 3-col testimonials, 3-col pricing
- Mockups at full fidelity
- Hover interactions enabled

### Laptop (1024px – 1279px)

- Slightly reduced container padding (32px)
- Hero H1 clamp to 48px
- Feature grid 5/7 split maintained
- Stats 4-col may shrink gap

### Tablet (768px – 1023px)

- Navbar → drawer
- All feature sections stack: copy first, mockup second
- Stats 2×2
- AI cards 2×2
- Testimonials carousel (1–2 visible)
- Pricing horizontal scroll with snap points OR stack

### Mobile (375px – 767px)

- Hero H1 36px, full-width CTAs
- Trusted logos: marquee scroll
- Mockups simplified
- FAQ full width
- Footer accordion

### Very Small Mobile (<375px)

- 16px horizontal padding
- H1 32px
- Hide tertiary links in hero
- Reduce section padding to 48px

### Touch Targets

- Minimum 44×44px for all interactive elements
- 8px minimum spacing between adjacent touch targets

---

## 14. Accessibility

### WCAG AA Compliance Target

- **Perceivable:** Text contrast ≥ 4.5:1 (body), ≥ 3:1 (large text, UI components)
- **Operable:** Full keyboard navigation; no keyboard traps except modals/drawers with escape
- **Understandable:** Consistent navigation; clear error states on forms (register CTA links)
- **Robust:** Semantic HTML; ARIA only when necessary

### Keyboard Navigation

| Area | Keys |
|------|------|
| Navbar | Tab through links; Enter/Space activate |
| Megamenu | Enter open; Arrow keys navigate items; Escape close |
| Mobile drawer | Focus trap; Escape close |
| FAQ | Enter/Space toggle; optional Arrow between headers |
| Carousel | Arrow buttons; Tab to controls |
| Skip link | First tab stop → `#main-content` |

### Screen Readers

- Landmarks: `header`, `nav`, `main`, `footer`
- Megamenu: announce "Features submenu"
- Mockups: `aria-hidden="true"` on decorative containers
- Stats: full labels read with values
- Rotating hero word: `aria-live="polite"` or static alternative

### ARIA Patterns

- Accordion: [WAI-ARIA Accordion Pattern](https://www.w3.org/WAI/ARIA/apg/patterns/accordion/)
- Disclosure (megamenu): button + region
- Carousel: roledescription + slide labels

### Contrast Verification

| Pair | Ratio | Pass |
|------|-------|------|
| neutral-900 on white | 15.8:1 | AA ✓ |
| primary-600 on white | 4.6:1 | AA ✓ |
| white on primary-600 | 4.6:1 | AA ✓ |
| neutral-500 on white | 4.6:1 | AA ✓ |
| white on navy CTA band | 15.8:1 | AA ✓ |

### Focus

- Reuse global `:focus-visible` from `globals.css`
- Never remove focus outlines
- Focus order matches visual order

---

## 15. SEO

### Meta Tags (index.html / react-helmet-async)

```text
<title>DealerFlow | AI-Powered Dealership Management Platform</title>
<meta name="description" content="DealerFlow helps dealerships manage vehicles, inventory, purchases, and analytics with AI-powered automation. Start your free trial today." />
<meta name="keywords" content="dealership management software, inventory management, automotive SaaS, AI dealership platform" />
<link rel="canonical" href="https://dealerflow.io/" />
```

### Open Graph

```text
og:type = website
og:title = DealerFlow | AI-Powered Dealership Management
og:description = (same as meta description)
og:url = https://dealerflow.io/
og:image = https://dealerflow.io/og-image.png (1200×630, original branded asset)
og:site_name = DealerFlow
```

### Twitter Card

```text
twitter:card = summary_large_image
twitter:title = (same as OG)
twitter:description = (shortened to 200 chars)
twitter:image = (same OG image)
```

### JSON-LD

Include `SoftwareApplication` + `Organization` schema:

```json
{
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "name": "DealerFlow",
  "applicationCategory": "BusinessApplication",
  "operatingSystem": "Web",
  "offers": {
    "@type": "Offer",
    "price": "0",
    "priceCurrency": "USD",
    "description": "Free starter tier"
  },
  "description": "AI-powered dealership management platform for inventory, sales, and analytics."
}
```

### Performance & Semantic HTML

- Single `<h1>` in hero
- Logical heading order (no skipped levels)
- `<section aria-labelledby="...">` for major sections
- Lazy load below-fold images
- Preconnect to font CDN

---

## 16. Performance

### Lazy Loading

- Below-fold mockup components: `React.lazy()` + `Suspense` with skeleton
- Images: `loading="lazy"`, explicit `width`/`height`
- Framer Motion: import only used features

### Image Optimization

- Format: WebP with PNG fallback for OG
- Hero mockup: SVG preferred (infinite scale, small bundle)
- Logo: SVG
- Testimonial avatars: 96×96 WebP

### Component Splitting

```text
landing/
  LandingPage.tsx          (shell)
  sections/                (lazy each)
  mockups/                 (lazy each)
  components/              (shared, eager: Navbar, Footer)
```

### Route Splitting

- Landing at `/` (public)
- App routes unchanged (`/dashboard`, etc.)
- Vite manual chunk: `framer-motion`, `landing-sections`

### Animation Performance

- Animate `transform` and `opacity` only
- `will-change: transform` sparingly on floating mockups
- Disable float animation on mobile

### Lighthouse Goals

| Metric | Target |
|--------|--------|
| Performance | ≥ 90 |
| Accessibility | ≥ 95 |
| Best Practices | ≥ 95 |
| SEO | ≥ 95 |
| LCP | < 2.5s |
| CLS | < 0.1 |
| INP | < 200ms |

---

## 17. Asset Strategy

### Icons

- **Source:** Heroicons (outline, 1.75 stroke)—already used in app Sidebar
- **Do not use:** Competitor icons, mascot illustrations
- **Custom:** DealerFlow logo SVG (create original wordmark + abstract mark suggesting flow/data)
- **AI badges:** 16px sparkle or chip icon in accent gradient

### Illustrations

- **Dashboard mockups:** Built in React + Tailwind (not raster images)
- **Empty marketing illustrations:** Optional geometric abstract shapes (original SVG, navy + emerald)
- **No stock photos** of competitor products

### Dashboard Graphics

- All Section 11 mockups as components in `frontend/src/features/landing/mockups/`
- Reuse chart color tokens from dashboard utils where applicable

### Charts

- v1: Static SVG paths
- v2: Recharts with reduced data points for landing

### Images

| Asset | Dimensions | Location |
|-------|------------|----------|
| OG image | 1200×630 | `public/og-image.png` |
| Logo | SVG | `public/logo.svg` |
| Favicon | 32×32, 180×180 | `public/favicon.ico`, `apple-touch-icon.png` |
| Trusted by logos | ~160×48 grayscale | `public/logos/partner-*.svg` (placeholder) |
| App store badges | standard | `public/badges/` (only if applicable) |

### Where to Create Custom Assets

1. **Logo & brand mark** — Design tool (Figma) → export SVG
2. **OG image** — Figma template with headline + mockup thumbnail
3. **Mockup components** — React in codebase (engineers)
4. **Partner logos** — Replace placeholders when real partnerships exist

---

## 18. Design Tokens

Centralize in `frontend/src/features/landing/tokens/` (implementation phase) as TypeScript constants mirroring this spec.

### Buttons

```text
btn-radius-sm: 6px
btn-radius-md: 8px
btn-radius-lg: 10px
btn-radius-full: 9999px (pills only)
```

### Radius

| Token | Value | Usage |
|-------|-------|-------|
| `radius-sm` | 4px | Inputs in mockups |
| `radius-md` | 8px | Buttons, badges |
| `radius-lg` | 12px | Cards |
| `radius-xl` | 16px | Mockup wrapper |
| `radius-2xl` | 24px | Hero media container |

### Elevation (Box Shadow)

| Token | Value |
|-------|-------|
| `elevation-0` | none |
| `elevation-1` | `0 1px 3px rgba(15,23,42,0.08)` |
| `elevation-2` | `0 4px 12px rgba(15,23,42,0.10)` |
| `elevation-3` | `0 12px 32px rgba(15,23,42,0.12)` |
| `elevation-mockup` | `0 24px 48px rgba(15,23,42,0.15)` |

### Border

```text
border-default: 1px solid #E2E8F0
border-strong: 1px solid #CBD5E1
border-focus: 2px solid #2563EB
```

### Animation Durations

```text
duration-fast: 150ms
duration-base: 200ms
duration-slow: 300ms
duration-hero: 600ms
duration-count: 2000ms
```

### Opacity

```text
opacity-disabled: 0.5
opacity-muted: 0.7
opacity-backdrop: 0.8
opacity-gradient-decor: 0.15
```

---

## 19. Implementation Roadmap

### Milestone 0 — Foundation

**Files:**
- `frontend/src/features/landing/tokens/index.ts`
- `frontend/src/features/landing/types/index.ts`
- `frontend/src/styles/landing.css` (optional section utilities)

**Components:** None (tokens only)

**Dependencies:** None new

**Expected result:** Design tokens available for all landing components

---

### Milestone 1 — Shell & Navigation

**Files:**
- `frontend/src/pages/LandingPage.tsx`
- `frontend/src/features/landing/components/Navbar.tsx`
- `frontend/src/features/landing/components/MegaMenu.tsx`
- `frontend/src/features/landing/components/MobileNav.tsx`
- `frontend/src/features/landing/components/Footer.tsx`
- `frontend/src/layouts/LandingLayout.tsx`
- Update `frontend/src/routes/AppRoutes.tsx` — `/` → LandingPage, move dashboard to `/dashboard`

**Components:** Navbar, MegaMenu, MobileNav, Footer, LandingLayout

**Dependencies:** `framer-motion`, `react-router-dom`

**Expected result:** Navigable landing shell with sticky navbar, megamenu, footer; placeholder main area

---

### Milestone 2 — Hero & Trust

**Files:**
- `frontend/src/features/landing/sections/HeroSection.tsx`
- `frontend/src/features/landing/sections/TrustedBySection.tsx`
- `frontend/src/features/landing/components/HeroMockupPreview.tsx`
- `frontend/src/features/landing/components/RotatingText.tsx`
- `frontend/src/features/landing/components/SocialProofPill.tsx`

**Components:** Hero, TrustedBy, RotatingText, HeroMockupPreview

**Dependencies:** `framer-motion`

**Expected result:** Complete above-the-fold with animations and CTAs linking to `/register` and demo anchor

---

### Milestone 3 — Statistics

**Files:**
- `frontend/src/features/landing/sections/StatsSection.tsx`
- `frontend/src/features/landing/components/StatCard.tsx`
- `frontend/src/features/landing/hooks/useCountUp.ts`

**Components:** StatsSection, StatCard

**Dependencies:** None (or `react-countup` optional)

**Expected result:** Animated stat row on scroll

---

### Milestone 4 — Feature Sections (Batch 1)

**Files:**
- `frontend/src/features/landing/sections/FeatureSection.tsx` (reusable)
- `frontend/src/features/landing/sections/VehicleManagementSection.tsx`
- `frontend/src/features/landing/sections/InventorySection.tsx`
- `frontend/src/features/landing/mockups/VehicleTableMockup.tsx`
- `frontend/src/features/landing/mockups/InventoryDashboardMockup.tsx`

**Components:** FeatureSection template, 2 sections, 2 mockups

**Dependencies:** None

**Expected result:** Two zigzag feature blocks with original mockups

---

### Milestone 5 — Feature Sections (Batch 2)

**Files:**
- `sections/PurchaseWorkflowSection.tsx`
- `sections/AnalyticsSection.tsx`
- `mockups/PurchaseFlowMockup.tsx`
- `mockups/AnalyticsMockup.tsx`

**Expected result:** Purchase + Analytics sections complete

---

### Milestone 6 — AI & Automation

**Files:**
- `sections/AIFeaturesSection.tsx`
- `sections/AutomationSection.tsx`
- `components/FeatureCard.tsx`
- `mockups/NotificationsMockup.tsx`
- `mockups/CustomerManagementMockup.tsx`

**Expected result:** AI grid + automation with device/notifications visual

---

### Milestone 7 — Social Proof & Pricing

**Files:**
- `sections/TestimonialsSection.tsx`
- `sections/PricingSection.tsx`
- `components/TestimonialCard.tsx`
- `components/PricingCard.tsx`
- `components/Carousel.tsx`

**Expected result:** Testimonial carousel + 3-tier pricing

---

### Milestone 8 — FAQ, CTA, Polish

**Files:**
- `sections/FAQSection.tsx`
- `sections/FinalCTASection.tsx`
- `components/Accordion.tsx`
- `components/Button.tsx` (landing variants)

**Expected result:** Full page complete

---

### Milestone 9 — SEO, A11y, Performance

**Files:**
- `frontend/index.html` meta updates
- `frontend/src/features/landing/components/SeoHead.tsx`
- `public/og-image.png`, `public/logo.svg`

**Dependencies:** `react-helmet-async` (optional)

**Expected result:** Lighthouse targets met; JSON-LD injected

---

### Milestone 10 — QA & Launch

**Activities:**
- Cross-browser test (Chrome, Firefox, Safari, Edge)
- Mobile device testing
- axe DevTools audit
- Verify all routes and CTAs

**Expected result:** Production-ready landing page

---

## 20. Engineering Rules

### Reusable Components

1. **One `FeatureSection` template** — props: overline, title, bullets, ctas, mockup, reversed
2. **One `Button` component** — variants via props, not duplicate JSX
3. **One `Accordion`** — used by FAQ and mobile footer
4. **Mockup wrapper** — shared chrome, padding, shadow

### No Duplicated Code

- Extract shared animation variants to `landing/animations/variants.ts`
- Centralize tokens (Section 18)
- Section content in `landing/content/sections.ts` (data-driven copy)

### TypeScript Strict

- All props typed with interfaces exported from `landing/types`
- No `any`; use `React.ReactNode` for slots
- Strict null checks on optional CTA links

### Accessibility

- Every milestone includes keyboard test
- Accordion and megamenu must pass axe before merge

### Responsive

- Mobile-first Tailwind classes
- Test at 320, 375, 768, 1024, 1280, 1440 widths

### SEO

- Semantic sections with IDs matching navbar anchor links
- No content rendered only via JS without SSR fallback for critical text (Vite prerender optional Phase 2)

### Performance

- Lazy load sections 4+ 
- No external render-blocking scripts
- Optimize SVG mockups

### Production-Ready

- Error boundary around lazy sections
- Fallback skeletons for lazy mockups
- Environment-based analytics hook placeholder (no PII)

---

## 21. Definition of Done

### Design

- [ ] All 14 landing sections implemented per wireframes
- [ ] Colors match Section 8 tokens
- [ ] Typography matches Section 7 scale
- [ ] Spacing follows 4px system
- [ ] Original DealerFlow branding throughout (no competitor assets)
- [ ] All 11 reference patterns adapted (not copied)

### Frontend

- [ ] `LandingPage` routed at `/`
- [ ] All components from Section 10 built
- [ ] All mockups from Section 11 built as React components
- [ ] Content externalized to data files for maintainability
- [ ] Dark mode supported (optional Phase 2 — light mode required v1)
- [ ] Links to `/login`, `/register` functional

### Performance

- [ ] Lighthouse Performance ≥ 90
- [ ] LCP < 2.5s on 4G simulated
- [ ] CLS < 0.1
- [ ] Lazy loading for below-fold sections
- [ ] No render-blocking resources

### Accessibility

- [ ] Lighthouse Accessibility ≥ 95
- [ ] axe DevTools 0 critical violations
- [ ] Full keyboard navigation verified
- [ ] Skip link functional
- [ ] FAQ accordion ARIA compliant
- [ ] Reduced motion respected

### SEO

- [ ] Title, description, canonical set
- [ ] OG + Twitter tags present
- [ ] JSON-LD valid (Google Rich Results Test)
- [ ] Single H1; logical heading hierarchy
- [ ] Section IDs for anchor navigation

### Responsiveness

- [ ] Tested at xs, sm, md, lg, xl, 2xl breakpoints
- [ ] Touch targets ≥ 44px on mobile
- [ ] No horizontal scroll at 320px width
- [ ] Mobile nav drawer functional

### Animations

- [ ] Hero stagger on load
- [ ] Scroll reveals on sections
- [ ] Stat counters animate once
- [ ] `prefers-reduced-motion` disables non-essential motion
- [ ] No animation jank (60fps transforms)

### Code Quality

- [ ] TypeScript strict — no errors
- [ ] ESLint passes
- [ ] No duplicated section markup (template pattern)
- [ ] Components documented with JSDoc headers (match existing codebase style)
- [ ] PR reviewed against this DESIGN.md

---

## Appendix A — Landing Copy Map (Original Content)

| Section | Overline | Headline |
|---------|----------|----------|
| Hero | — | "[Rotating] dealership platform" |
| Vehicle Management | VEHICLE MANAGEMENT | Manage your entire vehicle catalog in one place |
| Inventory | INVENTORY CONTROL | Never lose sight of stock levels |
| Purchase Workflow | PURCHASE WORKFLOW | Streamline every deal from inquiry to delivery |
| Analytics | ANALYTICS & REPORTS | Turn dealership data into decisions |
| AI Features | ARTIFICIAL INTELLIGENCE | AI that understands your dealership |
| Automation | AUTOMATION | Automate repetitive work across your rooftop |
| Testimonials | — | Trusted by forward-thinking dealerships |
| Pricing | — | Simple, transparent pricing |
| FAQ | — | DealerFlow Platform Questions |
| Final CTA | — | Ready to modernize your dealership? |

---

## Appendix B — Navbar Anchor Map

| Nav Item | Target |
|----------|--------|
| Features (megamenu items) | `#vehicles`, `#inventory`, `#purchases`, `#analytics`, `#ai`, `#automation` |
| Pricing | `#pricing` |
| FAQ | `#faq` |
| Docs | `/api/docs` (external tab) |
| Log In | `/login` |
| Start Free Trial | `/register` |

---

## Appendix C — File Tree (Target)

```text
frontend/src/features/landing/
├── animations/
│   └── variants.ts
├── components/
│   ├── Accordion.tsx
│   ├── Button.tsx
│   ├── Carousel.tsx
│   ├── FeatureCard.tsx
│   ├── MegaMenu.tsx
│   ├── MobileNav.tsx
│   ├── Navbar.tsx
│   ├── PricingCard.tsx
│   ├── RotatingText.tsx
│   ├── SeoHead.tsx
│   ├── SocialProofPill.tsx
│   ├── StatCard.tsx
│   └── TestimonialCard.tsx
├── content/
│   └── sections.ts
├── hooks/
│   └── useCountUp.ts
├── mockups/
│   ├── AnalyticsMockup.tsx
│   ├── CustomerManagementMockup.tsx
│   ├── InventoryDashboardMockup.tsx
│   ├── MockupFrame.tsx
│   ├── NotificationsMockup.tsx
│   ├── PurchaseFlowMockup.tsx
│   └── VehicleTableMockup.tsx
├── sections/
│   ├── AIFeaturesSection.tsx
│   ├── AnalyticsSection.tsx
│   ├── AutomationSection.tsx
│   ├── FAQSection.tsx
│   ├── FinalCTASection.tsx
│   ├── HeroSection.tsx
│   ├── InventorySection.tsx
│   ├── PricingSection.tsx
│   ├── PurchaseWorkflowSection.tsx
│   ├── StatsSection.tsx
│   ├── TestimonialsSection.tsx
│   ├── TrustedBySection.tsx
│   └── VehicleManagementSection.tsx
├── tokens/
│   └── index.ts
└── types/
    └── index.ts
```

---

*End of DESIGN.md*
