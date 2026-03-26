import { NextRequest, NextResponse } from "next/server";
import { CohereClient } from "cohere-ai";
import type { Property } from "@/lib/data";

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

    const apiKey = process.env.COHERE_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "AI search is not configured. Please add your COHERE_API_KEY to .env.local" },
        { status: 503 }
      );
    }

    const catalog = (properties ?? [])
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

    if (catalog.length === 0) {
      return NextResponse.json({ properties: [], matchReasons: {}, explanation: "No properties available to search." });
    }

    const validIds = catalog.map((p) => p.id);

    const prompt = `You are a Sri Lanka travel property recommendation engine.

Given the traveler query, pick up to 8 best matching properties from the catalog below and return them as JSON.

IMPORTANT: You MUST use only these exact property IDs: ${JSON.stringify(validIds)}

Return ONLY this JSON structure, no markdown, no extra text:
{"rankedResults":[{"propertyId":"<exact id from list>","rank":1,"matchReason":"one sentence"}],"explanation":"one sentence summary"}

Traveler query: "${query}"

Property catalog:
${JSON.stringify(catalog)}`;

    const cohere = new CohereClient({ token: apiKey });
    const result = await cohere.chat({
      model: "command-r-08-2024",
      message: prompt,
    });
    const textContent = result.text;
    console.log("[ai-search] raw response:", textContent?.slice(0, 500));

    if (!textContent) {
      throw new Error("No response from AI");
    }

    let parsed: AISearchResponse;
    try {
      const raw = textContent.replace(/^```json\s*/i, "").replace(/```\s*$/, "").trim();
      parsed = JSON.parse(raw);
    } catch {
      throw new Error("AI returned invalid JSON: " + textContent.slice(0, 200));
    }

    console.log("[ai-search] parsed IDs:", (parsed.rankedResults ?? []).map((r) => r.propertyId));
    console.log("[ai-search] valid IDs:", validIds);

    const propertyMap = new Map(properties.map((p) => [p.id, p]));
    const rankedProperties = (parsed.rankedResults ?? [])
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
