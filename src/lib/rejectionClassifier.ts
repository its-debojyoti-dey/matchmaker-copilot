import { RejectionAnalysis, RejectionCategory } from "../types";

interface FeedbackPattern {
  readonly category: RejectionCategory;
  readonly categoryLabel: string;
  readonly isOperationalError: boolean;
  readonly confidence: number;
  readonly match: (text: string) => boolean;
  readonly extract: (text: string) => {
    extractedReason: string;
    clientStatedPreferenceVsReality: string;
    recommendedAction: string;
    impactOnClientProfile: string;
  };
}

const DEAL_BREAKER_KEYWORDS = [
  "smoke",
  "smoking",
  "cigarette",
  "deal-breaker",
  "dealbreaker",
  "intake",
  "checklist",
  "child-free",
  "non-negotiable",
];

const REVEALED_PREFERENCE_KEYWORDS = [
  "travel",
  "long-distance",
  "distance",
  "weekends",
  "schedule",
  "barely in town",
  "realized",
  "commute",
];

const AESTHETIC_KEYWORDS = [
  "photo",
  "picture",
  "spark",
  "vibe",
  "stiff",
  "chemistry",
  "attraction",
  "headshot",
];

const PATTERNS: readonly FeedbackPattern[] = [
  {
    category: "DEAL_BREAKER_MISSED",
    categoryLabel: "Operational Mistake: Missed Stated Deal-Breaker",
    isOperationalError: true,
    confidence: 0.94,
    match: (text) =>
      DEAL_BREAKER_KEYWORDS.some((kw) => text.includes(kw)) ||
      (text.includes("kid") && text.includes("want")),
    extract: (text) => {
      let detail = "Smoking habit violation";
      if (text.includes("kid") || text.includes("child")) {
        detail = "Family/Children preference violation";
      } else if (text.includes("city") || text.includes("relocat")) {
        detail = "Location/City restriction violation";
      }

      return {
        extractedReason: `Client rejected profile because candidate violates their non-negotiable preference (${detail}).`,
        clientStatedPreferenceVsReality:
          "Client preference was already on file during intake, but matchmaker dispatched the profile without pre-flight validation.",
        recommendedAction:
          "Log warning to operator. Activate pre-flight auditor to prevent future manual dispatch overrides.",
        impactOnClientProfile:
          "Re-confirm client's core deal-breakers. Send an apology note acknowledging their checklist integrity.",
      };
    },
  },
  {
    category: "REVEALED_PREFERENCE",
    categoryLabel: "Revealed Preference: Unstated Lifestyle Constraint",
    isOperationalError: false,
    confidence: 0.91,
    match: (text) => REVEALED_PREFERENCE_KEYWORDS.some((kw) => text.includes(kw)),
    extract: () => ({
      extractedReason:
        "Client discovered an unstated constraint: candidate travels excessively for work (3+ weeks/month) which conflicts with client's newly articulated need for local weekend presence.",
      clientStatedPreferenceVsReality:
        "Client did not list 'frequent traveler' as a deal-breaker during intake, but seeing this candidate triggered an emotional/lifestyle boundary.",
      recommendedAction:
        "Add tag '[Max 20% Travel Willingness]' to client profile. Do not penalize matchmaker.",
      impactOnClientProfile:
        "Client profile updated with new soft filter: 'Prefers partner with low travel commitment'.",
    }),
  },
  {
    category: "AESTHETIC_VIBE",
    categoryLabel: "Aesthetic / Visual Presentation Feedback",
    isOperationalError: false,
    confidence: 0.88,
    match: (text) => AESTHETIC_KEYWORDS.some((kw) => text.includes(kw)),
    extract: () => ({
      extractedReason:
        "Client feels lack of physical/romantic spark based on candidate's current photo selection (perceived as too formal or stiff).",
      clientStatedPreferenceVsReality:
        "Candidate matches all quantitative criteria, but photo curation failed to convey personality and warmth.",
      recommendedAction:
        "Request candidate to provide warm, outdoor, lifestyle photos. Avoid rigid corporate headshots.",
      impactOnClientProfile:
        "Note client's visual preference: responds better to candid lifestyle photos than studio headshots.",
    }),
  },
];

/**
 * Analyzes unstructured feedback text against structured taxonomy strategies.
 */
export function analyzeRejectionFeedback(text: string): RejectionAnalysis {
  const normalized = text.toLowerCase();

  for (const pattern of PATTERNS) {
    if (pattern.match(normalized)) {
      const details = pattern.extract(normalized);
      return {
        category: pattern.category,
        categoryLabel: pattern.categoryLabel,
        isOperationalError: pattern.isOperationalError,
        confidence: pattern.confidence,
        ...details,
      };
    }
  }

  // Graceful degradation fallback
  return {
    category: "LIFESTYLE_MISMATCH",
    categoryLabel: "General Qualitative Mismatch",
    isOperationalError: false,
    confidence: 0.75,
    extractedReason: "Client expressed subjective hesitation regarding communication or values fit.",
    clientStatedPreferenceVsReality: "No direct deal-breaker violation detected; soft preference mismatch.",
    recommendedAction: "Conduct a 5-minute debrief call with client to unpack specific hesitation.",
    impactOnClientProfile: "Refine qualitative prompt notes for next recommendation batch.",
  };
}
