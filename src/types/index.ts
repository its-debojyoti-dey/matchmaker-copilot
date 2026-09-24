export type SmokingPreference = "NON_SMOKER" | "OCCASIONAL" | "REGULAR" | "ANY";
export type DrinkingPreference = "NON_DRINKER" | "OCCASIONAL" | "REGULAR" | "ANY";
export type ChildrenPreference = "WANTS_CHILDREN" | "DOES_NOT_WANT" | "OPEN_TO_DISCUSS" | "HAS_CHILDREN";
export type DietPreference = "VEGETARIAN" | "VEGAN" | "NON_VEGETARIAN" | "EGGETARIAN" | "ANY";

export interface ClientProfile {
  id: string;
  name: string;
  age: number;
  city: string;
  profession: string;
  education: string;
  avatarUrl: string;
  dealBreakers: {
    smoking: "NON_SMOKER" | "NO_REGULAR"; // strict deal-breaker
    drinking: "NON_DRINKER" | "NO_REGULAR" | "ANY";
    children: "MUST_WANT_CHILDREN" | "MUST_NOT_WANT" | "OPEN";
    ageRange: [number, number];
    allowedCities: string[];
    dietPreference: DietPreference;
    mustBeVegetarian: boolean;
  };
  softPreferences: {
    heightPreference?: string;
    interests: string[];
    communicationStyle: string;
  };
  bioSummary: string;
  assignedMatchmaker: "Matchmaker A" | "Matchmaker B";
}

export interface CandidateProfile {
  id: string;
  name: string;
  age: number;
  city: string;
  profession: string;
  company: string;
  education: string;
  avatarUrl: string;
  habits: {
    smoking: "NON_SMOKER" | "OCCASIONAL" | "REGULAR";
    drinking: "NON_DRINKER" | "OCCASIONAL" | "REGULAR";
    children: "WANTS_CHILDREN" | "DOES_NOT_WANT" | "OPEN_TO_DISCUSS";
    diet: DietPreference;
  };
  interests: string[];
  bio: string;
  valuesPitch: string;
}

export interface RuleCheck {
  id: string;
  name: string;
  ruleType: "HARD_DEAL_BREAKER" | "SOFT_PREFERENCE";
  status: "PASS" | "HARD_FAIL" | "WARNING";
  clientRequirement: string;
  candidateValue: string;
  message: string;
}

export interface AuditResult {
  overallStatus: "APPROVED" | "BLOCKED";
  hardFailsCount: number;
  warningsCount: number;
  checks: RuleCheck[];
  compatibilityScore: number; // 0 - 100
  pitchBlurb: string;
}

export type RejectionCategory = 
  | "DEAL_BREAKER_MISSED"
  | "REVEALED_PREFERENCE"
  | "LIFESTYLE_MISMATCH"
  | "AESTHETIC_VIBE"
  | "COMMUNICATION_TIMING";

export interface RejectionAnalysis {
  category: RejectionCategory;
  categoryLabel: string;
  isOperationalError: boolean;
  confidence: number;
  extractedReason: string;
  clientStatedPreferenceVsReality: string;
  recommendedAction: string;
  impactOnClientProfile: string;
}
