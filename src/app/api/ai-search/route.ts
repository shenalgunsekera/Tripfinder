import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import type { Property } from "@/lib/data";

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

interface AISearchRequest {
  query: string;
  properties: Property[];
}

interface AISearchResult {
  propertyId: string;
  rank: number;
  matchReason: string;
}

interface AISearchResponse {
  rankedResults: AISearchResult[];
  explanation: string;
}

export async function POST(request: NextRequest) {
  try {
    const { query, properties }: AISearchRequest = await request.json();

    if (!query?.trim()) {
      return NextResponse.json({ error: "Query is required" }, { status: 400 });
    }

    if (!process.env.ANTHROPIC_API_KEY || process.env.ANTHROPIC_API_KEY === "your_api_key_here") {
      return NextResponse.json(
        { error: "AI search is not configured. Please add your ANTHROPIC_API_KEY to .env.local" },
        { status: 503 }
      );
    }

    // Build a compact property catalog for the prompt
    const catalog = properties
      .filter((p) => p.isActive)
      .map((p) => ({
        id: p.id,
        title: p.title,
        description: p.description,
        type: p.type,
        city: p.city,
        location: p.location,
        price: p.price,
        guests: p.guests,
        bedrooms: p.bedrooms,
        bathrooms: p.bathrooms,
        rating: p.rating,
        reviewCount: p.reviewCount,
        instantBook: p.instantBook,
        amenities: p.amenities,
        isSuperhost: p.isSuperhost,
      }));

    const systemPrompt = `You are an expert Sri Lanka travel property recommendation engine for TripFinder, a vacation rental platform.

Your job is to analyze a traveler's natural-language search query and match it against a catalog of Sri Lankan properties.

You deeply understand:
- Sri Lanka's geography (coastal areas: Bentota, Galle, Arugam Bay, Mirissa, Trincomalee; hill country: Ella, Nuwara Eliya, Kandy; cultural: Sigiriya, Dambulla, Polonnaruwa; city: Colombo)
- Travel vibes: romantic, family, adventure, luxury, budget, surfing, cultural, nature
- Property types: Villa, Apartment, Room, Homestay, Cottage, Cabin
- What amenities matter for different traveler types (pool for luxury, beach access for coastal stays, etc.)

Ranking criteria (in priority order):
1. Location match — city/area explicitly mentioned or implied by vibe
2. Property type match — villa for luxury, room/homestay for budget
3. Capacity match — enough guests
4. Amenity match — pool, beach, mountain view, etc.
5. Price match — budget vs luxury signals
6. Rating and quality

Return ONLY valid JSON, no markdown, no explanation text outside the JSON. Format:
{
  "rankedResults": [
    { "propertyId": "prop-001", "rank": 1, "matchReason": "Brief reason why this property matches" },
    ...
  ],
  "explanation": "One sentence summary of what you found and why"
}

Return up to 8 best matching properties. If fewer than 3 match well, still return the best available. Order from best to worst match.`;

    const userPrompt = `Traveler query: "${query}"

Property catalog (${catalog.length} active properties):
${JSON.stringify(catalog, null, 2)}`;

    const response = await client.messages.create({
      model: "claude-opus-4-6",
      max_tokens: 2048,
      system: systemPrompt,
      messages: [{ role: "user", content: userPrompt }],
    });

    const textContent = response.content.find((b) => b.type === "text");
    if (!textContent || textContent.type !== "text") {
      throw new Error("No text response from AI");
    }

    // Parse Claude's JSON response
    let parsed: AISearchResponse;
    try {
      // Strip any accidental markdown code fences
      const raw = textContent.text.replace(/^```json\s*/i, "").replace(/```\s*$/, "").trim();
      parsed = JSON.parse(raw);
    } catch {
      throw new Error("AI returned invalid JSON: " + textContent.text.slice(0, 200));
    }

    // Map ranked IDs back to full property objects
    const propertyMap = new Map(properties.map((p) => [p.id, p]));
    const rankedProperties = parsed.rankedResults
      .filter((r) => propertyMap.has(r.propertyId))
      .sort((a, b) => a.rank - b.rank)
      .map((r) => ({
        property: propertyMap.get(r.propertyId)!,
        matchReason: r.matchReason,
        rank: r.rank,
      }));

    return NextResponse.json({
      properties: rankedProperties.map((r) => r.property),
      matchReasons: Object.fromEntries(
        rankedProperties.map((r) => [r.property.id, r.matchReason])
      ),
      explanation: parsed.explanation,
    });
  } catch (error) {
    console.error("AI search error:", error);
    const message = error instanceof Error ? error.message : "AI search failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
