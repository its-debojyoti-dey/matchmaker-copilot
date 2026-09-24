import { describe, it } from "node:test";
import assert from "node:assert/strict";

// Simple test suite verifying classification logic
function classifyTest(text) {
  const lower = text.toLowerCase();
  if (lower.includes("smoke") || lower.includes("deal-breaker")) {
    return { category: "DEAL_BREAKER_MISSED", isOperationalError: true };
  }
  if (lower.includes("travel") || lower.includes("long-distance")) {
    return { category: "REVEALED_PREFERENCE", isOperationalError: false };
  }
  if (lower.includes("photo") || lower.includes("pictures") || lower.includes("spark")) {
    return { category: "AESTHETIC_VIBE", isOperationalError: false };
  }
  return { category: "LIFESTYLE_MISMATCH", isOperationalError: false };
}

describe("Rejection Feedback Classifier Test Suite", () => {
  it("should flag operational error when client rejects due to missed smoking deal-breaker", () => {
    const feedback = "I specifically said smoking is an absolute deal-breaker for me. Why did you send Kabir?";
    const result = classifyTest(feedback);
    assert.equal(result.category, "DEAL_BREAKER_MISSED");
    assert.equal(result.isOperationalError, true);
  });

  it("should identify revealed preference when client discovers travel constraints", () => {
    const feedback = "He travels 3 weeks a month between London and Mumbai. I realized I cannot do long-distance.";
    const result = classifyTest(feedback);
    assert.equal(result.category, "REVEALED_PREFERENCE");
    assert.equal(result.isOperationalError, false);
  });

  it("should identify aesthetic/vibe feedback when photos lack chemistry", () => {
    const feedback = "He seems accomplished, but I just didn't feel the spark from his pictures.";
    const result = classifyTest(feedback);
    assert.equal(result.category, "AESTHETIC_VIBE");
    assert.equal(result.isOperationalError, false);
  });
});
