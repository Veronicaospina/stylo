import { generateText } from "ai"
import { NextResponse } from "next/server"
import type { ClothingItem } from "@/lib/types"

export async function POST(request: Request) {
  try {
    const { items, occasion, style } = await request.json()

    if (!items || items.length === 0) {
      return NextResponse.json({ error: "No clothing items provided" }, { status: 400 })
    }

    // Create a description of available items
    const itemsDescription = items
      .map((item: ClothingItem) => `${item.category}: ${item.name} (${item.color}, ${item.style})`)
      .join("\n")

    const prompt = `You are a professional fashion stylist. Based on the following wardrobe items, recommend a complete outfit${occasion ? ` for ${occasion}` : ""}${style ? ` in a ${style} style` : ""}.

Available items:
${itemsDescription}

Please recommend:
1. Which specific items to combine (use the exact names from the list)
2. Why these items work well together
3. Styling tips for this outfit

Format your response as JSON with this structure:
{
  "recommendedItems": ["item name 1", "item name 2", ...],
  "reasoning": "explanation of why these items work together",
  "stylingTips": "tips for wearing this outfit"
}`

    const { text } = await generateText({
      model: "openai/gpt-4o-mini",
      prompt,
    })

    // Parse the AI response
    let recommendation
    try {
      // Try to extract JSON from the response
      const jsonMatch = text.match(/\{[\s\S]*\}/)
      if (jsonMatch) {
        recommendation = JSON.parse(jsonMatch[0])
      } else {
        // Fallback if no JSON found
        recommendation = {
          recommendedItems: [],
          reasoning: text,
          stylingTips: "Mix and match items to create your perfect look!",
        }
      }
    } catch (parseError) {
      recommendation = {
        recommendedItems: [],
        reasoning: text,
        stylingTips: "Experiment with different combinations!",
      }
    }

    return NextResponse.json(recommendation)
  } catch (error) {
    console.error("Error generating outfit recommendation:", error)
    return NextResponse.json({ error: "Failed to generate recommendation" }, { status: 500 })
  }
}
