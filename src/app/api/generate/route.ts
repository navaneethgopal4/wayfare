import { NextResponse } from 'next/server';
import { SYSTEM_PROMPT, getPromptForNewTrip, getPromptForRefinement, extractJSON, validateTripJSON } from '../../../utils/gemini';

export async function POST(request: Request) {
  try {
    const { prompt, refine, currentTrip, userApiKey } = await request.json();

    // Use environment variable first, then fallback to client-provided key
    const apiKey = process.env.GEMINI_API_KEY || userApiKey;

    if (!apiKey) {
      return NextResponse.json(
        { error: 'API_KEY_MISSING', message: 'No Gemini API key configured.' },
        { status: 401 }
      );
    }

    if (!prompt) {
      return NextResponse.json(
        { error: 'INVALID_INPUT', message: 'Prompt is required.' },
        { status: 400 }
      );
    }

    // Determine target prompt based on action type
    const userPrompt = refine && currentTrip
      ? getPromptForRefinement(currentTrip, prompt)
      : getPromptForNewTrip(prompt);

    const apiEndpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

    const requestBody = {
      contents: [
        {
          role: 'user',
          parts: [{ text: userPrompt }],
        },
      ],
      systemInstruction: {
        parts: [{ text: SYSTEM_PROMPT }],
      },
      generationConfig: {
        responseMimeType: 'application/json',
        temperature: 0.2, // Lower temperature makes JSON shapes more consistent
      },
    };

    const response = await fetch(apiEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('Gemini API request failed:', errorData);
      return NextResponse.json(
        { 
          error: 'API_ERROR', 
          message: errorData.error?.message || `Gemini API returned status ${response.status}` 
        },
        { status: response.status }
      );
    }

    const data = await response.json();
    const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!rawText) {
      throw new Error('Gemini API returned an empty response candidate');
    }

    // Parse and validate the response
    const parsedJSON = extractJSON(rawText);
    const validatedItinerary = validateTripJSON(parsedJSON);

    return NextResponse.json({
      success: true,
      itinerary: validatedItinerary
    });

  } catch (error: unknown) {
    console.error('Error generating itinerary in serverless route:', error);
    const errorMessage = error instanceof Error ? error.message : 'An error occurred during itinerary generation.';
    return NextResponse.json(
      { 
        error: 'GENERATION_FAILED', 
        message: errorMessage
      },
      { status: 500 }
    );
  }
}
