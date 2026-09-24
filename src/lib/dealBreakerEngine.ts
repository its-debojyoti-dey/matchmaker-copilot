import { ClientProfile, CandidateProfile, RuleCheck, AuditResult } from "../types";

export function auditMatch(client: ClientProfile, candidate: CandidateProfile): AuditResult {
  const checks: RuleCheck[] = [];

  // 1. Smoking Rule Check (HARD DEAL-BREAKER)
  const clientSmoking = client.dealBreakers.smoking;
  const candSmoking = candidate.habits.smoking;
  if (clientSmoking === "NON_SMOKER") {
    if (candSmoking !== "NON_SMOKER") {
      checks.push({
        id: "rule-smoking",
        name: "Smoking Habit (Deal-Breaker)",
        ruleType: "HARD_DEAL_BREAKER",
        status: "HARD_FAIL",
        clientRequirement: "Strict Non-Smoker",
        candidateValue: candSmoking === "OCCASIONAL" ? "Occasional / Social Smoker" : "Regular Smoker",
        message: "CRITICAL: Client has strict non-smoking deal-breaker. Candidate smokes. Dispatching this profile directly violates client preference.",
      });
    } else {
      checks.push({
        id: "rule-smoking",
        name: "Smoking Habit",
        ruleType: "HARD_DEAL_BREAKER",
        status: "PASS",
        clientRequirement: "Non-Smoker",
        candidateValue: "Non-Smoker",
        message: "Aligned: Both agree on non-smoking lifestyle.",
      });
    }
  }

  // 2. Children / Family Goals (HARD DEAL-BREAKER)
  const clientChildren = client.dealBreakers.children;
  const candChildren = candidate.habits.children;
  if (clientChildren === "MUST_WANT_CHILDREN") {
    if (candChildren === "DOES_NOT_WANT") {
      checks.push({
        id: "rule-children",
        name: "Family Plans (Deal-Breaker)",
        ruleType: "HARD_DEAL_BREAKER",
        status: "HARD_FAIL",
        clientRequirement: "Must want children in future",
        candidateValue: "Decided on child-free life",
        message: "CRITICAL: Irreconcilable family timeline. Client wants children; candidate does not.",
      });
    } else if (candChildren === "OPEN_TO_DISCUSS") {
      checks.push({
        id: "rule-children",
        name: "Family Plans",
        ruleType: "HARD_DEAL_BREAKER",
        status: "WARNING",
        clientRequirement: "Must want children",
        candidateValue: "Open to discussing",
        message: "Notice: Candidate is open to discussion rather than firmly committed. Requires matchmaker alignment.",
      });
    } else {
      checks.push({
        id: "rule-children",
        name: "Family Plans",
        ruleType: "HARD_DEAL_BREAKER",
        status: "PASS",
        clientRequirement: "Wants children",
        candidateValue: "Wants children",
        message: "Aligned: Long-term family vision matches.",
      });
    }
  }

  // 3. Age Range Check (HARD BOUNDARY)
  const [minAge, maxAge] = client.dealBreakers.ageRange;
  if (candidate.age < minAge || candidate.age > maxAge) {
    checks.push({
      id: "rule-age",
      name: "Age Bracket (Deal-Breaker)",
      ruleType: "HARD_DEAL_BREAKER",
      status: "HARD_FAIL",
      clientRequirement: `${minAge} – ${maxAge} years`,
      candidateValue: `${candidate.age} years old`,
      message: `CRITICAL: Candidate age (${candidate.age}) falls outside client's hard age range [${minAge}-${maxAge}].`,
    });
  } else {
    checks.push({
      id: "rule-age",
      name: "Age Bracket",
      ruleType: "HARD_DEAL_BREAKER",
      status: "PASS",
      clientRequirement: `${minAge} – ${maxAge} years`,
      candidateValue: `${candidate.age} years old`,
      message: `Aligned: Age falls cleanly within stated [${minAge}-${maxAge}] range.`,
    });
  }

  // 4. City / Location Check
  const allowedCities = client.dealBreakers.allowedCities;
  if (allowedCities.length > 0 && !allowedCities.includes(candidate.city)) {
    checks.push({
      id: "rule-city",
      name: "Location / City (Deal-Breaker)",
      ruleType: "HARD_DEAL_BREAKER",
      status: "HARD_FAIL",
      clientRequirement: allowedCities.join(", "),
      candidateValue: candidate.city,
      message: `CRITICAL: Candidate is located in ${candidate.city}. Client specified: ${allowedCities.join(", ")}.`,
    });
  } else {
    checks.push({
      id: "rule-city",
      name: "Location / City",
      ruleType: "HARD_DEAL_BREAKER",
      status: "PASS",
      clientRequirement: allowedCities.join(", "),
      candidateValue: candidate.city,
      message: `Aligned: Both in ${candidate.city}. Zero relocation friction.`,
    });
  }

  // 5. Diet Check
  if (client.dealBreakers.mustBeVegetarian) {
    if (candidate.habits.diet !== "VEGETARIAN" && candidate.habits.diet !== "VEGAN") {
      checks.push({
        id: "rule-diet",
        name: "Dietary Preference",
        ruleType: "HARD_DEAL_BREAKER",
        status: "HARD_FAIL",
        clientRequirement: "Strict Vegetarian / Vegan",
        candidateValue: candidate.habits.diet.replace("_", " "),
        message: "CRITICAL: Client has strict vegetarian requirement. Candidate is non-vegetarian.",
      });
    } else {
      checks.push({
        id: "rule-diet",
        name: "Dietary Preference",
        ruleType: "HARD_DEAL_BREAKER",
        status: "PASS",
        clientRequirement: "Vegetarian",
        candidateValue: candidate.habits.diet.replace("_", " "),
        message: "Aligned: Dietary practices compatible.",
      });
    }
  }

  // 6. Drinking Check (Soft or Hard depending on severity)
  const clientDrink = client.dealBreakers.drinking;
  const candDrink = candidate.habits.drinking;
  if (clientDrink === "NON_DRINKER" && candDrink !== "NON_DRINKER") {
    checks.push({
      id: "rule-drinking",
      name: "Alcohol Habit",
      ruleType: "HARD_DEAL_BREAKER",
      status: candDrink === "REGULAR" ? "HARD_FAIL" : "WARNING",
      clientRequirement: "Non-Drinker",
      candidateValue: candDrink === "OCCASIONAL" ? "Occasional Drinker" : "Regular Drinker",
      message: candDrink === "REGULAR" 
        ? "CRITICAL: Client strictly avoids alcohol; candidate drinks regularly."
        : "Notice: Client avoids alcohol, candidate drinks occasionally on social occasions. Worth mentioning in pitch.",
    });
  }

  // Compute overall status
  const hardFailsCount = checks.filter((c) => c.status === "HARD_FAIL").length;
  const warningsCount = checks.filter((c) => c.status === "WARNING").length;
  const overallStatus = hardFailsCount > 0 ? "BLOCKED" : "APPROVED";

  // Shared interests & compatibility score calculation
  const sharedInterests = client.softPreferences.interests.filter((i) =>
    candidate.interests.some((ci) => ci.toLowerCase().includes(i.toLowerCase()) || i.toLowerCase().includes(ci.toLowerCase()))
  );

  let compatibilityScore = 80;
  if (hardFailsCount > 0) {
    compatibilityScore = Math.max(15, 60 - hardFailsCount * 25);
  } else {
    compatibilityScore += Math.min(20, sharedInterests.length * 6);
    if (warningsCount > 0) compatibilityScore -= warningsCount * 8;
  }

  // Generate contextual AI Pitch note if approved, or explain block if failed
  let pitchBlurb = "";
  if (overallStatus === "BLOCKED") {
    const failedReasons = checks
      .filter((c) => c.status === "HARD_FAIL")
      .map((c) => c.name.split(" ")[0])
      .join(", ");
    pitchBlurb = `⚠️ DISPATCH BLOCKED: This profile cannot be shared with ${client.name} because it breaches explicit deal-breakers (${failedReasons}). Review candidate options or re-confirm preferences with client before proceeding.`;
  } else {
    pitchBlurb = `Hi ${client.name.split(" ")[0]}, I'm excited to share ${candidate.name}'s profile with you. He is a ${candidate.profession} at ${candidate.company} in ${candidate.city}. What stood out to me is how naturally your shared interests in ${sharedInterests.slice(0, 2).join(" and ") || "mindful living and career ambition"} complement each other. His friends describe him as grounded and deeply thoughtful—I think you two would have a genuinely engaging first conversation.`;
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
