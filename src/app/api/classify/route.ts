import { NextRequest, NextResponse } from "next/server";
import { analyzeRejectionFeedback } from "@/lib/rejectionClassifier";

export async function POST(req: NextRequest) {
  try {
    let body;
    try {
      body = await req.json();
    } catch (parseErr) {
      return NextResponse.json({ error: "Invalid JSON in request body", details: String(parseErr) }, { status: 400 });
    }

    const { feedbackText, apiKey, provider } = body || {};

    if (!feedbackText || typeof feedbackText !== "string") {
      return NextResponse.json({ error: "Missing or invalid feedbackText" }, { status: 400 });
    }

    // Live LLM Mode: Uses latest Gemini 3.8 Flash (with 3.7 Flash fallback)
    if (apiKey && provider === "gemini") {
      const models = ["gemini-3.8-flash", "gemini-3.7-flash"];
      for (const model of models) {
        try {
          const response = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                contents: [
                  {
                    role: "user",
                    parts: [
                      {
                        text: `You are an expert product engineer at The Date Crew, a curated matrimonial platform. Analyze this client rejection email and return a valid JSON object.

Client Rejection Email: "${feedbackText}"

Extract:
- category: one of ["DEAL_BREAKER_MISSED", "REVEALED_PREFERENCE", "LIFESTYLE_MISMATCH", "AESTHETIC_VIBE"]
- categoryLabel: descriptive title
- isOperationalError: boolean (true if matchmaker dispatched someone violating a stated dealbreaker)
- confidence: number (0.0 to 1.0)
- extractedReason: 1-2 sentence core reason
- clientStatedPreferenceVsReality: what client requested vs what was sent
- recommendedAction: clear guidance for the matchmaker
- impactOnClientProfile: automated tag or update to client record`,
                      },
                    ],
                  },
                ],
                generationConfig: {
                  responseMimeType: "application/json",
                  temperature: 0.1,
                },
              }),
            }
          );

          if (response.ok) {
            const data = await response.json();
            const textResponse = data.candidates?.[0]?.content?.parts?.[0]?.text;
            if (textResponse) {
              const parsed = JSON.parse(textResponse);
              return NextResponse.json({ ...parsed, provider: `${model}-live` });
            }
          }
        } catch {
          // Attempt next model or fall back to local heuristic
        }
      }
    }

    // Default fast, zero-latency deterministic analysis
    const result = analyzeRejectionFeedback(feedbackText);
    return NextResponse.json({ ...result, provider: "local-heuristic" });
  } catch (err) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
