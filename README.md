# Wayfare — AI Trip Planner

Wayfare is a high-fidelity, interactive, stateful AI travel planning application built using **React (hooks, functional components)**, **Next.js**, **Tailwind CSS**, and the **Google Gemini API**. 

The application takes a free-form trip description (e.g., *"5 relaxed days in Lisbon with family exploring tiles and sweet bakeries"*) and turns it into a structured, interactive day-by-day travel itinerary with editable stops, duration filters, real-time search, and a conversational refinement loop.

---

## 🚀 Getting Started

Follow these steps to run the project locally on your machine.

### Prerequisites

- **Node.js**: v18.0.0 or higher (v24.x recommended)
- **npm**: v9.0.0 or higher

### Installation

1. Clone or download the repository to your local folder.
2. In your terminal, run the installation command:
   ```bash
   npm install
   ```

### API Key Configuration

To use live AI generation, you need a **Gemini API Key**.
1. Get a free key from Google AI Studio.
2. Create a file named `.env.local` in the root of the project:
   ```env
   GEMINI_API_KEY=your_gemini_api_key_here
   ```
> **No API Key? No problem!** 
> If the API key is not configured, the app will automatically detect this and run in a high-fidelity **Simulated Demo Mode** with pre-defined travel templates, or allow you to enter a key directly in the web UI (saved locally in your browser's `localStorage` for privacy).


## 🎨 Features & Implementation

### 1. Interactive Stateful UI
- **Collapsible Day Accordions**: Expand and collapse individual days to focus on specific plans.
- **Stop Reordering**: Move stops up and down dynamically to change the chronological sequence.
- **Interactive Stop Creation & Deletion**: Delete stops, delete entire days, or add new blank stops.
- **Full Inline Editing**: Click on any field of a stop (title, duration, time, description, location) to edit details immediately.
- **Search & Duration Filters**: Filter stops by keyword, category, or duration tabs (≤30 min, 31–90 min, 90+ min).
- **Save Filtered Subsets**: Save a custom filtered view of your plan as a separate saved trip.

### 2. Stretch Features
- **Refinement Loop**: Edit and update the active itinerary using follow-up text prompts (e.g., *"Make day 2 more museum focused"*). The app sends the current JSON and the prompt back to the AI for partial updates.
- **Trip Persistence**: Saves the active plan and all saved plans in browser `localStorage`. Access them via the sliding **Saved Drawer** (with days duration filters and text search).
- **Theme Customization**: Beautiful dark/light mode toggle with native HSL variable mapping to prevent flash-on-load.
- **Glassmorphism Auth Page**: Fully designed mock login/signup layout.

---

## 🛡️ Robust AI Data Handling (Failure Prevention)

A major focus of this project is ensuring a smooth user experience even when the AI fails:
* **JSON Schema Enforcement**: Leverages Gemini's native `responseMimeType: "application/json"` to ensure structured JSON output.
* **Self-Healing & Cleaning**: Uses custom parser regex patterns in `src/utils/gemini.ts` to locate and extract JSON data from markdown enclosures.
* **Integrity Validation**: The app validates all parsed properties against a strict typescript schema on the server. Missing or broken fields are corrected with default values instead of crashing.
* **Stale Response Protection**: Uses generation token timestamps (`activeGenerationId.current`) to ensure slow-resolving background requests do not overwrite a newer click.

---

## 📝 AI-Usage Note

This project was built in collaboration with **Antigravity** and **lovable**.
* **How it was used**: Antigravity helped bootstrap the Next.js directories, write clean utility scripts, design the CSS theme system in Tailwind CSS, write React components (StopCard, SavedDrawer, DayAccordion), and configure local storage integrations.
* **Original Work**: The styling, prompt architecture, API proxy routing, and local fallback logic were tailored, verified, and audited step-by-step for correctness.

---

## ⚙️ Known Limitations

- **Browser Storage limits**: Saved sessions are limited to browser `localStorage` (approximately 5MB limit).
- **Rate Limits**: Free tier Gemini API keys are subject to rate limiting of 15 Requests Per Minute (RPM).

---

## ⏱️ Time Spent

- **Total actual work**: ~3 hours
  - *Project setup and npm dependency resolution:* ~30 minutes
  - *State layout and proxy route setup:* ~45 minutes
  - *Utility scripts (storage, validator, simulation):* ~45 minutes
  - *UI Component construction & animations:* ~60 minutes
