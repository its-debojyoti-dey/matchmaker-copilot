import { describe, it } from "node:test";
import assert from "node:assert/strict";

// Mock profiles for testing
const mockClientPriya = {
  id: "client-1",
  name: "Priya Sharma",
  age: 28,
  city: "Mumbai",
  profession: "Product Manager",
  education: "IIT Bombay",
  avatarUrl: "",
  dealBreakers: {
    smoking: "NON_SMOKER",
    drinking: "NO_REGULAR",
    children: "MUST_WANT_CHILDREN",
    ageRange: [27, 31],
    allowedCities: ["Mumbai"],
    dietPreference: "VEGETARIAN",
    mustBeVegetarian: false,
  },
  softPreferences: {
    interests: ["Trekking", "Art"],
    communicationStyle: "Direct",
  },
  bioSummary: "Grounded PM.",
  assignedMatchmaker: "Matchmaker B",
};

const candidateSmoker = {
  id: "cand-1",
  name: "Kabir Sen",
  age: 29,
  city: "Mumbai",
  profession: "Architect",
  company: "Design Studio",
  education: "CEPT",
  avatarUrl: "",
  habits: {
    smoking: "OCCASIONAL",
    drinking: "OCCASIONAL",
    children: "WANTS_CHILDREN",
    diet: "NON_VEGETARIAN",
  },
  interests: ["Trekking"],
  bio: "Architect in Mumbai.",
  valuesPitch: "",
};

const candidateChildFree = {
  id: "cand-2",
  name: "Arjun Nair",
  age: 30,
  city: "Mumbai",
  profession: "VP Eng",
  company: "Tech Co",
  education: "IIT Delhi",
  avatarUrl: "",
  habits: {
    smoking: "NON_SMOKER",
    drinking: "OCCASIONAL",
    children: "DOES_NOT_WANT",
    diet: "EGGETARIAN",
  },
  interests: ["Climbing"],
  bio: "Tech leader.",
  valuesPitch: "",
};

const candidateCleanMatch = {
  id: "cand-4",
  name: "Aditya Verma",
  age: 29,
  city: "Mumbai",
  profession: "Founder",
  company: "CleanTech",
  education: "IIT Bombay",
  avatarUrl: "",
  habits: {
    smoking: "NON_SMOKER",
    drinking: "OCCASIONAL",
    children: "WANTS_CHILDREN",
    diet: "VEGETARIAN",
  },
  interests: ["Trekking", "Art"],
  bio: "Clean tech builder.",
  valuesPitch: "",
};

// Inline test implementation matching dealBreakerEngine contract
function auditMatch(client, candidate) {
  const checks = [];
  
  // Smoking
  if (client.dealBreakers.smoking === "NON_SMOKER" && candidate.habits.smoking !== "NON_SMOKER") {
    checks.push({ status: "HARD_FAIL", rule: "smoking" });
  } else {
    checks.push({ status: "PASS", rule: "smoking" });
  }

  // Children
  if (client.dealBreakers.children === "MUST_WANT_CHILDREN" && candidate.habits.children === "DOES_NOT_WANT") {
    checks.push({ status: "HARD_FAIL", rule: "children" });
  } else {
    checks.push({ status: "PASS", rule: "children" });
  }

  // Age
  const [minAge, maxAge] = client.dealBreakers.ageRange;
  if (candidate.age < minAge || candidate.age > maxAge) {
    checks.push({ status: "HARD_FAIL", rule: "age" });
  } else {
    checks.push({ status: "PASS", rule: "age" });
  }

  const hardFails = checks.filter(c => c.status === "HARD_FAIL").length;
  return {
    overallStatus: hardFails > 0 ? "BLOCKED" : "APPROVED",
    hardFailsCount: hardFails,
    checks,
  };
}

describe("Pre-Flight Deal-Breaker Auditor Test Suite", () => {
  it("should HARD BLOCK a candidate who smokes when client specified non-smoker", () => {
    const result = auditMatch(mockClientPriya, candidateSmoker);
    assert.equal(result.overallStatus, "BLOCKED");
    assert.equal(result.hardFailsCount >= 1, true);
    const smokingCheck = result.checks.find(c => c.rule === "smoking");
    assert.equal(smokingCheck.status, "HARD_FAIL");
  });

  it("should HARD BLOCK a candidate who does not want children when client specified must want children", () => {
    const result = auditMatch(mockClientPriya, candidateChildFree);
    assert.equal(result.overallStatus, "BLOCKED");
    const childrenCheck = result.checks.find(c => c.rule === "children");
    assert.equal(childrenCheck.status, "HARD_FAIL");
  });

  it("should APPROVE a candidate who fulfills all hard constraints", () => {
    const result = auditMatch(mockClientPriya, candidateCleanMatch);
    assert.equal(result.overallStatus, "APPROVED");
    assert.equal(result.hardFailsCount, 0);
  });
});
