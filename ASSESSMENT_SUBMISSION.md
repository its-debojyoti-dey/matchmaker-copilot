# The Date Crew: Product Engineer Assessment
**Candidate:** Debojyoti Dey  
**Role:** Product Engineer  
**Target Repository:** [github.com/debojyoti/date-crew-matchmaker-copilot](https://github.com/debojyoti/date-crew-matchmaker-copilot)  

---

## Part 1: Diagnose the problem

### 1. Three questions to investigate

1. **Why are 35% of shared profiles violating clients' explicit deal-breakers?**  
   Out of 690 rejections, 241 shared profiles (~24% of all dispatches) were dead on arrival. We need to know if this comes from cognitive fatigue, clunky CRM views where deal-breakers sit on separate tabs, or lack of pre-send validation. Fixing this claws back nearly a quarter of all wasted matchmaker effort immediately.

2. **What explains the 2x performance gap between Matchmaker A (44%) and B (21%)?**  
   Matchmaking quality currently lives in individual heads rather than shared systems. Does A write better pitch notes, run an informal pre-screening checklist, or hold fewer clients? If we find the specific workflow differences, we can turn A's habits into standard software guardrails for everyone.

3. **Where do clients' stated preferences diverge from who they actually accept?**  
   The prompt notes that clients often reject a profile early on, only to accept a very similar one later. If we treat every stated preference as an absolute filter, we starve our own pipeline. We need to distinguish true hard stops (smoking, kids) from flexible ideals (height, specific hobbies).

### 2. The biggest problem in the funnel

The drop from **Profiles Shared (1,000) to Profiles Accepted (310)** is our biggest leak. That is a 69% loss right at the start.

*Assumption:* Downstream friction (contact exchange drops, date cancellations) happens partly because clients had lukewarm conviction from day one. Sending candidates who breach stated deal-breakers damages trust immediately. Fixing match quality upstream gives us the biggest return down the line. Every genuinely good recommendation feeds conversations and completed meetings.

### 3. Three metrics to track

1. **Preventable Rejection Rate (PRR):**  
   `PRR = (Rejections due to stated deal-breakers / Total Rejections) * 100`  
   Tracks basic operational discipline. Benchmark: drop from 35% to under 5%.

2. **Profile Acceptance Rate (PAR):**  
   `PAR = (Profiles Accepted / Profiles Shared) * 100`  
   Measures recommendation quality across the team. Benchmark: lift from 31% to over 42%.

3. **Search Time per Match (STpM):**  
   Hours matchmakers spend per client each week hunting for profiles. Currently at 2 hours. Benchmark: cut to under 30 minutes so matchmakers can spend their time talking to clients instead of filtering databases.

*(Part 1 count: ~310 words)*

---

## Part 2: Design a solution

### Problem
Matchmakers spend 2 hours per client each week manually cross-referencing candidate profiles against preference sheets. They miss stated deal-breakers under cognitive load, causing 35% of rejections. On top of that, rejection feedback arrives as free-text emails and disappears into inboxes without improving future searches.

### User
Internal matchmakers (specifically bringing operators like Matchmaker B up to A's standard) and the operations lead.

### Solution: Matchmaker Pre-Flight Auditor & Feedback Engine
A lightweight internal tool built directly into the profile dispatch flow:

1. **Pre-flight deal-breaker check:**  
   When a matchmaker pairs a candidate with a client, the tool runs a deterministic check on hard constraints: smoking, drinking, plans for children, age limits, location, and diet. If any deal-breaker fails, the dispatch button disables and shows a plain warning: *"Blocked: Client specified non-smoker. Candidate smokes socially."* The matchmaker cannot send the email without an explicit reason logged.

2. **Contextual pitch helper:**  
   Once hard constraints clear, an LLM compares the client's qualitative notes with the candidate's bio (values, communication style, shared interests). It drafts a 2-sentence rationale for the matchmaker to edit and paste into the client email.

3. **Structured rejection parser:**  
   When a client replies rejecting a profile, the matchmaker pastes the email text into the tool. The LLM extracts the core reason into set categories (`deal_breaker_missed`, `lifestyle_mismatch`, `aesthetic_preference`). If the rejection was a missed deal-breaker that bypassed the check, it flags an ops alert. If it reveals an unstated preference, it updates the client's profile tag list.

### Data
* **Client profile:** hard deal-breakers (booleans and ranges), soft preferences (free tags), historical accept/reject logs.
* **Candidate profile:** demographic fields, lifestyle tags, written bio.
* **Inbound feedback:** raw rejection text from client emails.

### Technology
* **Frontend:** Retool, Streamlit, or a clean Next.js/Tailwind page with simple green/red pass badges.
* **Backend:** Python (FastAPI) with Pydantic for strict boolean rule validation.
* **AI:** Gemini 1.5 Flash or GPT-4o-mini using JSON mode for structured rejection extraction and drafting pitch notes.
* **Storage:** PostgreSQL (Supabase) or SQLite.

### Success metric
* **Primary:** Preventable Rejection Rate drops from 35% to under 5% in 14 days.
* **Secondary:** Profile Acceptance Rate climbs from 31% to over 40%, and matchmaker search time drops by at least half (saving ~1 hour per client weekly).

*(Part 2 count: ~385 words)*

---

## Part 3: Prototype implementation

### Architecture and features
The prototype demonstrates the core dispatch loop:
1. **Client & candidate selector:** Tests clear matches alongside edge cases (e.g., smoking violations, age boundary mismatches).
2. **Deterministic pre-flight check:** Live pass/fail status table that disables dispatch on deal-breaker failures.
3. **AI pitch generator:** Suggests a short, natural pitch note when all hard filters pass.
4. **Rejection parser:** Accepts free-text rejection emails, tags the root cause, and flags whether it was an operational mistake or a newly revealed preference.

*Code and setup instructions are in the GitHub repository.*

---

## Part 4: One curveball

### Scenario: The metric does not move after two weeks.

#### 1. What to check first
Adoption. Did matchmakers actually run recommendations through the tool, or did they work around it to hit their numbers? Check dispatch logs and total profiles sent.

#### 2. What data to look at
* **Preventable Rejection Rate:** Did PRR drop from 35% to under 5%? If PRR dropped but overall acceptance stayed flat at 31%, our hygiene check worked, but revealed that stated deal-breakers were just polite cover for other objections.
* **Rejection category shift:** Check the new structured rejection data. What replaced deal-breakers? Look for spikes in photo reactions, career expectations, or vague vibe complaints.
* **Matchmaker variance:** Did Matchmaker B improve while Matchmaker A stayed unchanged?

#### 3. Iterate, change, or kill?
**Iterate. Do not kill.**  
Blocking deal-breaker violations is basic hygiene. A curated service cannot send smokers to non-smokers and keep credibility.  
However, change the focus for Sprint 2: pivot from stated filters to revealed preferences. That means analyzing the candidates clients actually accept, tightening photo selection standards, and coaching clients on flexible criteria.

*(Part 4 count: ~180 words)*

---

## AI usage statement

* **Tools used:** Antigravity, Cursor, Claude Code.
* **What I used them for:** Writing boilerplate Pydantic validation models, creating synthetic candidate profiles for edge-case tests, and drafting JSON schemas for rejection parsing.
* **Where I disagreed with the AI:** The AI initially suggested building an end-to-end vector search system using embeddings to rank profiles. I rejected that. The data showed that 35% of rejections came from simple boolean failures like smoking and children. Replacing straightforward validation rules with probabilistic search would have added hallucinations, made failures harder to trace, and overcomplicated what is fundamentally a checklist problem.
