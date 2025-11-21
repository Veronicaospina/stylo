import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const { occasion, style } = await request.json()

    if (!occasion || !style) {
      return NextResponse.json({ error: "Missing required fields: occasion and style" }, { status: 400 })
    }

    const prompt = `You are a professional fashion stylist. Provide a single, readable recommendation for an outfit based ONLY on the following information. Do NOT refer to any specific wardrobe items — give a general outfit recommendation that someone can follow.

Occasion: ${occasion}
Preferred style: ${style}

Include: 1) a short description of the outfit to wear (pieces and colors), 2) a brief explanation why it works, and 3) 2 concise styling tips. Keep the response as plain text; do not return JSON.`

    const API_KEY = process.env.GEMINI_API_KEY
    const MODEL = process.env.GEMINI_MODEL || "gemini-2.5-flash"

    if (!API_KEY) {
      console.error("Missing GEMINI_API_KEY environment variable")
      return NextResponse.json({ error: "Server misconfiguration: missing API key" }, { status: 500 })
    }

    const url = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent`

    const payload = {
      contents: [
        {
          parts: [
            {
              text: prompt,
            },
          ],
        },
      ],
      generationConfig: {
        temperature: 1.0,
        // Increase token budget to reduce truncation; adjust as needed
        maxOutputTokens: 1024,
        // Disable 'thinking' for 2.5 models to reduce extra hidden token usage
        thinkingConfig: {
          thinkingBudget: 0,
        },
        // Request plain text response
        responseMimeType: "text/plain",
      },
    }

    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-goog-api-key": API_KEY,
      },
      body: JSON.stringify(payload),
    })

    if (!res.ok) {
      const text = await res.text()
      console.error("Gemini API error:", res.status, text)
      return NextResponse.json({ error: "Failed to generate recommendation" }, { status: 502 })
    }

    const data = await res.json()

    const candidate = data?.candidates?.[0]

    // Try several extraction strategies for the text returned by Gemini
    let recommendationText = ""

    try {
      // common shape: candidate.content.parts[0].text
      recommendationText =
        String(candidate?.content?.parts?.map((p: any) => p.text).join("\n") || "").trim()

      // alternative: content is an array of content objects
      if (!recommendationText && Array.isArray(candidate?.content)) {
        recommendationText = candidate.content
          .map((c: any) => (Array.isArray(c.parts) ? c.parts.map((p: any) => p.text).join("\n") : ""))
          .join("\n")
        recommendationText = String(recommendationText || "").trim()
      }

      // fallback: candidate.text (some SDKs expose it)
      if (!recommendationText && candidate?.text) {
        recommendationText = String(candidate.text).trim()
      }

      // deep search: walk nested objects to find any 'text' properties inside parts
      if (!recommendationText && candidate?.content && typeof candidate.content === "object") {
        const partsTexts: string[] = []
        const visit = (obj: any) => {
          if (!obj || typeof obj !== "object") return
          if (Array.isArray(obj)) {
            obj.forEach(visit)
            return
          }
          if (Array.isArray(obj.parts)) {
            obj.parts.forEach((p: any) => p?.text && partsTexts.push(p.text))
          }
          Object.values(obj).forEach(visit)
        }
        visit(candidate.content)
        recommendationText = partsTexts.join("\n").trim()
      }
    } catch (e) {
      console.error("Error extracting text from Gemini response", e)
    }

    // If still empty, compose a helpful message (include finishReason if model truncated)
    if (!recommendationText) {
      const finishReason = candidate?.finishReason || data?.finishReason || data?.candidates?.[0]?.finishReason
      let msg = "The model returned no text in the expected fields."
      if (finishReason) {
        msg += ` Finish reason: ${finishReason}.`
        if (finishReason === "MAX_TOKENS") {
          msg += " The response was truncated (MAX_TOKENS). Try increasing maxOutputTokens or shorten the prompt."
        }
      }

      // expose debug info in development to help troubleshooting
      if (process.env.NODE_ENV !== "production") {
        return NextResponse.json({ recommendation: msg, debug: data })
      }

      return NextResponse.json({ recommendation: msg })
    }

    return NextResponse.json({ recommendation: String(recommendationText) })
  } catch (error) {
    console.error("Error generating outfit recommendation:", error)
    return NextResponse.json({ error: "Failed to generate recommendation" }, { status: 500 })
  }
}
