# Matchmaker Copilot (The Date Crew)

A high-leverage product engineering prototype built for **The Date Crew** hiring assessment.

> **Target Problem:** Out of 690 rejections in the 30-day assessment data, **35% (~241 profiles) were rejected for deal-breakers already stated in the client's preferences** (smoking, children, age). In addition, matchmakers spend **2 hours per client per week** searching manually, and Matchmaker B (21%) lags Matchmaker A (44%) by over 2x.

This prototype provides an operational copilot with three modules:
1. **Pre-Flight Match Auditor:** Deterministic gatekeeper that verifies hard constraints (smoking, children, age bounds, city) and blocks profile recommendation emails if explicit deal-breakers are breached.
2. **Rejection Feedback Intelligence Engine:** Ingests raw client rejection emails and extracts structured root causes (`deal_breaker_missed`, `revealed_preference`, `aesthetic_vibe`), distinguishing human error from client evolution.
3. **Funnel Economics & Impact Model:** Models the compounding impact of eliminating preventable rejections on downstream completed meetings (projected +81% lift from 42 to 76 completed dates).

---

## Live Demo & Vercel Deployment

* **Target Deployment:** 1-Click deployable on Vercel.
* **Dual AI Modes:**
  * **Default (Zero-Config):** Built-in high-speed deterministic rules engine + heuristic NLP. Requires **zero API keys** to test immediately.
  * **Optional Live Gemini Mode:** Supply a Gemini API key via the top-right settings modal for live dynamic LLM extractions (supports Gemini 2.0 Flash and 1.5 Flash).

---

## Getting Started Locally

### Prerequisites
* Node.js 18+ (tested on Node v22)
* npm or pnpm

### Installation
```bash
# Clone the repository
git clone https://github.com/debojyoti/matchmaker-copilot.git
cd matchmaker-copilot

# Install dependencies
npm install

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Interactive Test Scenarios for Reviewers

### View 1: Pre-Flight Match Auditor
Select **Priya Sharma** (Strict non-smoker, must want children, age 27–31, Mumbai) and test:
* **Kabir Sen:** Triggers `HARD FAIL` on smoking. Dispatch button is hard-blocked.
* **Arjun Nair:** Triggers `HARD FAIL` on family plans (child-free). Dispatch button is hard-blocked.
* **Vikram Malhotra:** Triggers `HARD FAIL` on age (34 exceeds upper bound 31). Dispatch button is hard-blocked.
* **Aditya Verma:** Passes all hard constraints (100% clean). Unlocks green dispatch button and auto-generates contextual pitch note.

### View 2: Rejection Feedback Intelligence
Click through the 3 preloaded scenarios:
* **Preset 1 (Missed Deal-Breaker):** Highlights client feedback on smoking, classifies as `OPERATIONAL ERROR`, and logs matchmaker accountability.
* **Preset 2 (Revealed Preference):** Discovers unstated travel boundary ("travels 3 weeks a month") and dynamically updates the client's profile with `[Max 20% Travel]`.
* **Preset 3 (Aesthetic / Vibe):** Identifies stiff corporate photos and prompts photo curation improvements.

### View 3: Funnel & Impact Model
Toggle between **Assessment Baseline** and **Post-Auditor Projected** to inspect how eliminating top-of-funnel waste almost doubles completed dates without increasing matchmaker headcount.

---

## Tech Stack
* **Framework:** Next.js 14 App Router
* **Language:** TypeScript (Strict)
* **Styling:** Tailwind CSS
* **Icons:** Lucide React
* **AI & NLP:** Gemini Flash / Deterministic JSON schemas

---

## Author
* **Debojyoti Dey** — [GitHub](https://github.com/debojyoti) • [LinkedIn](https://linkedin.com/in/debojyoti-dey)
