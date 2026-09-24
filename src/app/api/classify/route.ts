import { NextRequest, NextResponse } from "next/server";
import { analyzeRejectionFeedback } from "@/lib/rejectionClassifier";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { feedbackText, apiKey, provider } = body;

    if (!feedbackText || typeof feedbackText !== "string") {
      return NextResponse.json({ error: "Missing feedbackText" }, { status: 400 });
    }

    // If an external API key is provided for Gemini or OpenAI, attempt live call
    if (apiKey && provider === "gemini") {
      try {
        const response = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              contents: [
                {
                  parts: [
                    {
                      text: `Analyze this matrimonial client rejection email and return a JSON object with:
                      - category: one of ["DEAL_BREAKER_MISSED", "REVEALED_PREFERENCE", "LIFESTYLE_MISMATCH", "AESTHETIC_VIBE"]
                      - categoryLabel: string
                      - isOperationalError: boolean (true if matchmaker sent someone violating a stated dealbreaker)
                      - confidence: number (0.0 to 1.0)
                      - extractedReason: string
                      - clientStatedPreferenceVsReality: string
                      - recommendedAction: string
                      - impactOnClientProfile: string

                      Email text: "${feedbackText}"`,
                    },
                  ],
                },
              ],
              generationConfig: {
                responseMimeType: "application/json",
              },
            }),
          }
        );

        if (response.ok) {
          const data = await response.json();
          const parsed = JSON.parse(data.candidates[0].content.parts[0].text);
          return NextResponse.json({ ...parsed, provider: "gemini-live" });
        }
      } catch {
        // Fallback to local deterministic analyzer
      }
    }

    // Default fast, zero-latency deterministic analysis
    const result = analyzeRejectionFeedback(feedbackText);
    return NextResponse.json({ ...result, provider: "local-heuristic" });
  } catch (err) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
