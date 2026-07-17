/* eslint-disable @typescript-eslint/no-explicit-any */
import { Trip, Day, Stop } from './storage';

// Helper to validate and clean the parsed object to match our Trip schema
export function validateTripJSON(data: any): Omit<Trip, 'id' | 'createdAt' | 'originalPrompt'> {
  if (!data || typeof data !== 'object') {
    throw new Error('Trip data must be an object');
  }

  if (typeof data.title !== 'string' || !data.title.trim()) {
    throw new Error('Trip title is missing or invalid');
  }

  if (typeof data.description !== 'string') {
    data.description = '';
  }

  if (!Array.isArray(data.days)) {
    throw new Error('Trip must contain a list of days');
  }

  const validatedDays: Day[] = data.days.map((day: any, dIdx: number) => {
    const dayNum = Number(day.dayNumber) || (dIdx + 1);
    
    if (typeof day.title !== 'string' || !day.title.trim()) {
      day.title = `Day ${dayNum}`;
    }

    if (!Array.isArray(day.stops)) {
      throw new Error(`Day ${dayNum} must contain a list of stops`);
    }

    const validatedStops: Stop[] = day.stops.map((stop: any, sIdx: number) => {
      if (typeof stop.title !== 'string' || !stop.title.trim()) {
        throw new Error(`Stop ${sIdx + 1} on Day ${dayNum} is missing a title`);
      }

      // Validate category, default to 'Sight'
      const validCategories = ['Food', 'Sight', 'Activity', 'Transit', 'Shopping'];
      let category = stop.category;
      if (!validCategories.includes(category)) {
        category = 'Sight';
      }

      return {
        id: stop.id || `stop-${dayNum}-${sIdx}-${Math.random().toString(36).substring(2, 9)}`,
        time: stop.time || '12:00 PM',
        title: stop.title.trim(),
        category: category as Stop['category'],
        duration: stop.duration || '60 min',
        description: stop.description || '',
        location: stop.location || ''
      };
    });

    return {
      dayNumber: dayNum,
      title: day.title.trim(),
      stops: validatedStops
    };
  });

  return {
    title: data.title.trim(),
    description: data.description.trim(),
    days: validatedDays
  };
}

// Robust JSON extraction helper
export function extractJSON(text: string): any {
  let cleaned = text.trim();
  
  // Strip Markdown code blocks if present
  if (cleaned.startsWith('```')) {
    const match = cleaned.match(/^```(?:json)?\s*([\s\S]*?)\s*```$/i);
    if (match && match[1]) {
      cleaned = match[1].trim();
    }
  }

  // Attempt direct parse
  try {
    return JSON.parse(cleaned);
  } catch {
    // If it fails, search for the first '{' and last '}'
    const startIdx = cleaned.indexOf('{');
    const endIdx = cleaned.lastIndexOf('}');
    
    if (startIdx !== -1 && endIdx !== -1 && endIdx > startIdx) {
      const candidates = cleaned.substring(startIdx, endIdx + 1);
      try {
        return JSON.parse(candidates);
      } catch (subErr) {
        console.error('Nested parse failed:', subErr);
      }
    }
    
    throw new Error('AI response could not be parsed as valid JSON');
  }
}

export const SYSTEM_PROMPT = `You are a professional travel planner API that returns high-quality, highly organized itineraries in structured JSON format.
Your output must conform to the following typescript schema, with no additional text or Markdown wrapping outside the JSON structure:

interface Stop {
  id: string; // unique short string
  time: string; // e.g. "09:00 AM"
  title: string; // name of the spot / restaurant / activity
  category: "Food" | "Sight" | "Activity" | "Transit" | "Shopping";
  duration: string; // e.g. "60 min", "90 min"
  description: string; // a short, high-value tip or reason to visit (1-2 sentences)
  location: string; // physical address / station / landmark name
}

interface Day {
  dayNumber: number; // starts at 1
  title: string; // main focus of this day, e.g. "Day 1: Historic Old Town"
  stops: Stop[];
}

interface TripItinerary {
  title: string; // e.g. "5 Relaxed Days in Lisbon"
  description: string; // short summary of the vibe of the trip
  days: Day[];
}

Include realistic times, durations, and highly accurate location strings. Plan for a logical geographical progression so the traveler doesn't hop back and forth across town. Choose highly rated spots, cafes, views, and historic items. Ensure categories are exactly one of: "Food", "Sight", "Activity", "Transit", "Shopping".`;

export function getPromptForNewTrip(tripPrompt: string): string {
  return `Generate a detailed trip itinerary based on the user's description: "${tripPrompt}". Keep it practical, structured, and beautiful. Ensure you output ONLY the raw JSON adhering to the specified schema, without any backticks, markup, or surrounding conversational text.`;
}

export function getPromptForRefinement(currentTrip: Trip, refinementPrompt: string): string {
  return `You are refining an existing trip itinerary. 
Here is the current itinerary in JSON format:
${JSON.stringify(currentTrip, null, 2)}

User request for changes: "${refinementPrompt}"

Instructions:
1. Modify the itinerary as requested (e.g. swap stops, add a day, edit durations, focus on certain foods or museums).
2. Keep unchanged parts of the itinerary intact to maintain structure.
3. If new stops are added, ensure they have valid fields (time, title, category, duration, description, location).
4. Update the trip description to mention the refinement if helpful.
5. Return the updated itinerary in the exact same JSON schema.
6. Output ONLY the raw JSON. Do not write explanations or wrap in Markdown formatting.`;
}
