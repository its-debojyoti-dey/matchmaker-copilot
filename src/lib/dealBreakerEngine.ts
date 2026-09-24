import { ClientProfile, CandidateProfile, RuleCheck, AuditResult } from "../types";

/**
 * Domain-Driven Match Rule Interface.
 * Follows the Open-Closed Principle (SOLID): rules are discrete,
 * composable objects that can be tested in isolation and extended
 * without mutating core engine orchestration.
 */
export interface MatchRule {
  readonly id: string;
  readonly name: string;
  readonly ruleType: "HARD_DEAL_BREAKER" | "SOFT_PREFERENCE";
  evaluate(client: ClientProfile, candidate: CandidateProfile): RuleCheck | null;
}

// 1. Smoking Rule Check
export const smokingRule: MatchRule = {
  id: "rule-smoking",
  name: "Smoking Habit (Deal-Breaker)",
  ruleType: "HARD_DEAL_BREAKER",
  evaluate(client, candidate) {
    if (client.dealBreakers.smoking !== "NON_SMOKER") return null;

    const candSmoking = candidate.habits.smoking;
    const isViolation = candSmoking !== "NON_SMOKER";

    return {
      id: this.id,
      name: this.name,
      ruleType: this.ruleType,
      status: isViolation ? "HARD_FAIL" : "PASS",
      clientRequirement: "Strict Non-Smoker",
      candidateValue: candSmoking === "OCCASIONAL" ? "Occasional / Social Smoker" : candSmoking === "REGULAR" ? "Regular Smoker" : "Non-Smoker",
      message: isViolation
        ? "CRITICAL: Client has strict non-smoking deal-breaker. Candidate smokes. Dispatching this profile directly violates client preference."
        : "Aligned: Both agree on non-smoking lifestyle.",
    };
  },
};

// 2. Family Plans Rule Check
export const childrenRule: MatchRule = {
  id: "rule-children",
  name: "Family Plans (Deal-Breaker)",
  ruleType: "HARD_DEAL_BREAKER",
  evaluate(client, candidate) {
    if (client.dealBreakers.children !== "MUST_WANT_CHILDREN") return null;

    const candChildren = candidate.habits.children;
    if (candChildren === "DOES_NOT_WANT") {
      return {
        id: this.id,
        name: this.name,
        ruleType: this.ruleType,
        status: "HARD_FAIL",
        clientRequirement: "Must want children in future",
        candidateValue: "Decided on child-free life",
        message: "CRITICAL: Irreconcilable family timeline. Client wants children; candidate does not.",
      };
    }

    if (candChildren === "OPEN_TO_DISCUSS") {
      return {
        id: this.id,
        name: this.name,
        ruleType: this.ruleType,
        status: "WARNING",
        clientRequirement: "Must want children",
        candidateValue: "Open to discussing",
        message: "Notice: Candidate is open to discussion rather than firmly committed. Requires matchmaker alignment.",
      };
    }

    return {
      id: this.id,
      name: this.name,
      ruleType: this.ruleType,
      status: "PASS",
      clientRequirement: "Wants children",
      candidateValue: "Wants children",
      message: "Aligned: Long-term family vision matches.",
    };
  },
};

// 3. Age Bracket Boundary Rule Check
export const ageRangeRule: MatchRule = {
  id: "rule-age",
  name: "Age Bracket (Deal-Breaker)",
  ruleType: "HARD_DEAL_BREAKER",
  evaluate(client, candidate) {
    const [minAge, maxAge] = client.dealBreakers.ageRange;
    const isOutOfBounds = candidate.age < minAge || candidate.age > maxAge;

    return {
      id: this.id,
      name: this.name,
      ruleType: this.ruleType,
      status: isOutOfBounds ? "HARD_FAIL" : "PASS",
      clientRequirement: `${minAge} – ${maxAge} years`,
      candidateValue: `${candidate.age} years old`,
      message: isOutOfBounds
        ? `CRITICAL: Candidate age (${candidate.age}) falls outside client's hard age range [${minAge}-${maxAge}].`
        : `Aligned: Age falls cleanly within stated [${minAge}-${maxAge}] range.`,
    };
  },
};

// 4. Geographic Location Rule Check
export const locationRule: MatchRule = {
  id: "rule-city",
  name: "Location / City (Deal-Breaker)",
  ruleType: "HARD_DEAL_BREAKER",
  evaluate(client, candidate) {
    const allowed = client.dealBreakers.allowedCities;
    if (!allowed || allowed.length === 0) return null;

    const isMatch = allowed.includes(candidate.city);

    return {
      id: this.id,
      name: this.name,
      ruleType: this.ruleType,
      status: isMatch ? "PASS" : "HARD_FAIL",
      clientRequirement: allowed.join(", "),
      candidateValue: candidate.city,
      message: isMatch
        ? `Aligned: Both in ${candidate.city}. Zero relocation friction.`
        : `CRITICAL: Candidate is located in ${candidate.city}. Client specified: ${allowed.join(", ")}.`,
    };
  },
};

// 5. Dietary Compatibility Rule Check
export const dietRule: MatchRule = {
  id: "rule-diet",
  name: "Dietary Preference",
  ruleType: "HARD_DEAL_BREAKER",
  evaluate(client, candidate) {
    if (!client.dealBreakers.mustBeVegetarian) return null;

    const candDiet = candidate.habits.diet;
    const isVeg = candDiet === "VEGETARIAN" || candDiet === "VEGAN";

    return {
      id: this.id,
      name: this.name,
      ruleType: this.ruleType,
      status: isVeg ? "PASS" : "HARD_FAIL",
      clientRequirement: "Strict Vegetarian / Vegan",
      candidateValue: candDiet.replace("_", " "),
      message: isVeg
        ? "Aligned: Dietary practices compatible."
        : "CRITICAL: Client has strict vegetarian requirement. Candidate is non-vegetarian.",
    };
  },
};

// 6. Alcohol Consumption Rule Check
export const alcoholRule: MatchRule = {
  id: "rule-drinking",
  name: "Alcohol Habit",
  ruleType: "HARD_DEAL_BREAKER",
  evaluate(client, candidate) {
    if (client.dealBreakers.drinking !== "NON_DRINKER") return null;

    const candDrinking = candidate.habits.drinking;
    if (candDrinking === "NON_DRINKER") {
      return {
        id: this.id,
        name: this.name,
        ruleType: this.ruleType,
        status: "PASS",
        clientRequirement: "Non-Drinker",
        candidateValue: "Non-Drinker",
        message: "Aligned: Both avoid alcohol.",
      };
    }

    const isRegular = candDrinking === "REGULAR";
    return {
      id: this.id,
      name: this.name,
      ruleType: this.ruleType,
      status: isRegular ? "HARD_FAIL" : "WARNING",
      clientRequirement: "Non-Drinker",
      candidateValue: isRegular ? "Regular Drinker" : "Occasional Drinker",
      message: isRegular
        ? "CRITICAL: Client strictly avoids alcohol; candidate drinks regularly."
        : "Notice: Client avoids alcohol, candidate drinks occasionally on social occasions. Worth mentioning in pitch.",
    };
  },
};

/**
 * Standard rule registry used across the matchmaking pipeline.
 */
export const STANDARD_MATCH_RULES: readonly MatchRule[] = [
  smokingRule,
  childrenRule,
  ageRangeRule,
  locationRule,
  dietRule,
  alcoholRule,
];

/**
 * Executes the complete pre-flight audit for a client-candidate pair.
 * Injects rules pipeline with default fallback for maximum testability.
 */
export function auditMatch(
  client: ClientProfile,
  candidate: CandidateProfile,
  rules: readonly MatchRule[] = STANDARD_MATCH_RULES
): AuditResult {
  const checks: RuleCheck[] = [];

  for (const rule of rules) {
    const result = rule.evaluate(client, candidate);
    if (result) {
      checks.push(result);
    }
  }

  const hardFailsCount = checks.filter((c) => c.status === "HARD_FAIL").length;
  const warningsCount = checks.filter((c) => c.status === "WARNING").length;
  const overallStatus = hardFailsCount > 0 ? "BLOCKED" : "APPROVED";

  // Shared interests & scoring
  const sharedInterests = client.softPreferences.interests.filter((i) =>
    candidate.interests.some(
      (ci) => ci.toLowerCase().includes(i.toLowerCase()) || i.toLowerCase().includes(ci.toLowerCase())
    )
  );

  let compatibilityScore = 80;
  if (hardFailsCount > 0) {
    compatibilityScore = Math.max(15, 60 - hardFailsCount * 25);
  } else {
    compatibilityScore += Math.min(20, sharedInterests.length * 6);
    if (warningsCount > 0) compatibilityScore -= warningsCount * 8;
  }

  // Pitch or Intervention Rationale
  let pitchBlurb = "";
  if (overallStatus === "BLOCKED") {
    const failedCategories = checks
      .filter((c) => c.status === "HARD_FAIL")
      .map((c) => c.name.split(" ")[0])
      .join(", ");
    pitchBlurb = `DISPATCH BLOCKED: This profile cannot be shared with ${client.name} because it breaches explicit deal-breakers (${failedCategories}). Review candidate options or re-confirm preferences with client before proceeding.`;
  } else {
    const interestHighlight =
      sharedInterests.slice(0, 2).join(" and ") || "mindful living and career ambition";
    pitchBlurb = `Hi ${client.name.split(" ")[0]}, I'm excited to share ${candidate.name}'s profile with you. He is a ${candidate.profession} at ${candidate.company} in ${candidate.city}. What stood out to me is how naturally your shared interests in ${interestHighlight} complement each other. His friends describe him as grounded and deeply thoughtful—I think you two would have a genuinely engaging first conversation.`;
  }

  return {
    overallStatus,
    hardFailsCount,
    warningsCount,
    checks,
    compatibilityScore,
    pitchBlurb,
  };
}
