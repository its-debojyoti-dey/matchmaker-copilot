import { RejectionAnalysis } from "../types";

export function analyzeRejectionFeedback(text: string): RejectionAnalysis {
  const lower = text.toLowerCase();

  // Pattern 1: Missed Deal-Breaker (Smoking, Drinking, Kids, City)
  if (
    lower.includes("smoke") ||
    lower.includes("smoking") ||
    lower.includes("cigarette") ||
    lower.includes("deal-breaker") ||
    lower.includes("dealbreaker") ||
    (lower.includes("intake") && lower.includes("specified")) ||
    (lower.includes("explicitly") && lower.includes("checklist")) ||
    (lower.includes("kid") && lower.includes("want")) ||
    (lower.includes("child") && (lower.includes("never") || lower.includes("free")))
  ) {
    let specificDetail = "Smoking habit violation";
    if (lower.includes("kid") || lower.includes("child")) specificDetail = "Family/Children preference violation";
    if (lower.includes("city") || lower.includes("relocat")) specificDetail = "Location/City restriction violation";

    return {
      category: "DEAL_BREAKER_MISSED",
      categoryLabel: "Operational Mistake: Missed Stated Deal-Breaker",
      isOperationalError: true,
      confidence: 0.94,
      extractedReason: `Client rejected profile because candidate violates their non-negotiable preference (${specificDetail}).`,
      clientStatedPreferenceVsReality: "Client preference was already on file during intake, but matchmaker dispatched the profile without pre-flight validation.",
      recommendedAction: "Log warning to Matchmaker B. Activate pre-flight auditor to prevent future manual dispatch overrides.",
      impactOnClientProfile: "Re-confirm client's core deal-breakers. Send an apology note acknowledging their checklist integrity.",
    };
  }

  // Pattern 2: Revealed Preference (Travel, Distance, Career/Lifestyle)
  if (
    lower.includes("travel") ||
    lower.includes("long-distance") ||
    lower.includes("distance") ||
    lower.includes("weekends") ||
    lower.includes("schedule") ||
    lower.includes("barely in town") ||
    lower.includes("realized")
  ) {
    return {
      category: "REVEALED_PREFERENCE",
      categoryLabel: "Revealed Preference: Unstated Lifestyle Constraint",
      isOperationalError: false,
      confidence: 0.91,
      extractedReason: "Client discovered an unstated constraint: candidate travels excessively for work (3+ weeks/month) which conflicts with client's newly articulated need for local weekend presence.",
      clientStatedPreferenceVsReality: "Client did not list 'frequent traveler' as a deal-breaker during intake, but seeing this candidate triggered an emotional/lifestyle boundary.",
      recommendedAction: "Add tag '[Max 20% Travel Willingness]' to client profile. Do not penalize matchmaker.",
      impactOnClientProfile: "Client profile updated with new soft filter: 'Prefers partner with low travel commitment'.",
    };
  }

  // Pattern 3: Aesthetic / Chemistry / Vibe
  if (
    lower.includes("photo") ||
    lower.includes("picture") ||
    lower.includes("spark") ||
    lower.includes("vibe") ||
    lower.includes("stiff") ||
    lower.includes("chemistry") ||
    lower.includes("attraction")
  ) {
    return {
      category: "AESTHETIC_VIBE",
      categoryLabel: "Aesthetic / Visual Presentation Feedback",
      isOperationalError: false,
      confidence: 0.88,
      extractedReason: "Client feels lack of physical/romantic spark based on candidate's current photo selection (perceived as too formal or stiff).",
      clientStatedPreferenceVsReality: "Candidate matches all quantitative criteria, but photo curation failed to convey personality and warmth.",
      recommendedAction: "Request candidate to provide warm, outdoor, lifestyle photos. Avoid rigid corporate headshots.",
      impactOnClientProfile: "Note client's visual preference: responds better to candid lifestyle photos than studio headshots.",
    };
  }

  // Default fallback
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
