'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Compass, AlertTriangle, Settings, RefreshCw, X } from 'lucide-react';
import Header from '@/components/Header';
import SavedDrawer from '@/components/SavedDrawer';
import PopularDestinations from '@/components/PopularDestinations';
import ItineraryView from '@/components/ItineraryView';
import { 
  Trip, 
  Stop,
  getSavedTrips, 
  saveTrip as saveTripToStorage, 
  deleteSavedTrip as deleteSavedFromStorage,
  getActiveTrip,
  setActiveTrip,
  getSettings,
  updateSettings,
  UserSettings
} from '@/utils/storage';
import { simulateTripGeneration, simulateTripRefinement } from '@/utils/simulator';
import { 
  SYSTEM_PROMPT, 
  getPromptForNewTrip, 
  getPromptForRefinement, 
  extractJSON, 
  validateTripJSON 
} from '@/utils/gemini';

export default function Home() {
  // Orchestration states
  const [activeTrip, setActiveTripState] = useState<Trip | null>(null);
  const [savedTrips, setSavedTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [savedDrawerOpen, setSavedDrawerOpen] = useState(false);
  const [settings, setSettingsState] = useState<UserSettings>({});
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [isDemoMode, setIsDemoMode] = useState(false);
  const [toastMessage, setToastMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Ref to track the current active generation to discard stale async responses
  const activeGenerationId = useRef<number>(0);

  // Initialize values on client mount
  useEffect(() => {
    const initData = () => {
      setSavedTrips(getSavedTrips());
      setActiveTripState(getActiveTrip());
      setSettingsState(getSettings());
    };
    // Schedule next tick to avoid synchronous cascading renders warning
    const timer = setTimeout(initData, 0);
    return () => clearTimeout(timer);
  }, []);

  // Show a toast message helper
  const showToast = (text: string, type: 'success' | 'error' = 'success') => {
    setToastMessage({ text, type });
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  // Safe wrapper for changing active trip (updates state + storage)
  const handleSetActiveTrip = (trip: Trip | null) => {
    setActiveTripState(trip);
    setActiveTrip(trip);
    if (!trip) {
      setIsDemoMode(false);
    }
  };

  // Toggle Dark Theme
  const handleToggleTheme = () => {
    const isDark = document.documentElement.classList.contains('dark');
    if (isDark) {
      document.documentElement.classList.remove('dark');
      updateSettings({ theme: 'light' });
      setSettingsState(prev => ({ ...prev, theme: 'light' }));
    } else {
      document.documentElement.classList.add('dark');
      updateSettings({ theme: 'dark' });
      setSettingsState(prev => ({ ...prev, theme: 'dark' }));
    }
  };

  // Delete a saved trip
  const handleDeleteSavedTrip = (id: string) => {
    const updated = deleteSavedFromStorage(id);
    setSavedTrips(updated);
    showToast('Trip deleted successfully', 'success');

    // If active trip is deleted, go back home
    if (activeTrip && activeTrip.id === id) {
      handleSetActiveTrip(null);
    }
  };

  // Generation flow
  const handlePlanTrip = async (promptText: string) => {
    if (!promptText.trim()) return;

    // 1. Establish unique ID for this execution thread
    const generationId = Date.now();
    activeGenerationId.current = generationId;

    setLoading(true);
    setError(null);
    setIsDemoMode(false);
    
    // Simulate loading steps in UI
    const steps = [
      'Scouting flight routes...',
      'Mapping out high-quality local cafes...',
      'Selecting coordinates for cultural sights...',
      'Aligning routes for optimal walking paths...',
      'Polishing recommendations...'
    ];
    let stepIndex = 0;
    setLoadingStep(steps[0]);
    const stepInterval = setInterval(() => {
      if (stepIndex < steps.length - 1) {
        stepIndex++;
        setLoadingStep(steps[stepIndex]);
      }
    }, 800);

    try {
      let resultItinerary = null;
      let useStaticFallback = false;

      try {
        // 2. Call local backend route with prompt and key
        const response = await fetch('/api/generate', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            prompt: promptText,
            userApiKey: settings.apiKey,
          }),
        });

        clearInterval(stepInterval);

        // Check if this async callback is stale (overwritten by a newer click)
        if (activeGenerationId.current !== generationId) {
          console.warn('Discarded stale itinerary generation');
          return;
        }

        if (response.status === 401) {
          // API key missing on server & client
          console.log('No API key detected, triggering simulated fallback...');
          setLoadingStep('Running in simulated Demo Mode...');
          const simulated = await simulateTripGeneration(promptText);
          
          if (activeGenerationId.current === generationId) {
            handleSetActiveTrip(simulated);
            const updated = saveTripToStorage(simulated);
            setSavedTrips(updated);
            setIsDemoMode(true);
            showToast('Trip generated in Simulated Demo Mode', 'success');
          }
          return;
        }

        if (response.status === 404) {
          useStaticFallback = true;
        } else if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || `Server responded with status ${response.status}`);
        } else {
          const result = await response.json();
          resultItinerary = result.itinerary;
        }
      } catch (err) {
        if (settings.apiKey) {
          useStaticFallback = true;
        } else {
          throw err;
        }
      }

      if (useStaticFallback) {
        if (!settings.apiKey) {
          throw new Error('API key missing. Configure a Gemini key in settings for static hosting.');
        }

        setLoadingStep('Directly planning trip from browser...');
        const apiEndpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${settings.apiKey}`;
        const userPrompt = getPromptForNewTrip(promptText);

        const response = await fetch(apiEndpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
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
              temperature: 0.2,
            },
          }),
        });

        clearInterval(stepInterval);
        if (activeGenerationId.current !== generationId) return;

        if (!response.ok) {
          throw new Error(`Direct Gemini API failed with status ${response.status}`);
        }

        const data = await response.json();
        const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text;
        if (!rawText) {
          throw new Error('Direct Gemini API returned an empty response.');
        }

        const parsedJSON = extractJSON(rawText);
        resultItinerary = validateTripJSON(parsedJSON);
      }

      if (!resultItinerary) {
        throw new Error('Could not generate trip itinerary.');
      }
      
      // Save result and update view
      const newTrip: Trip = {
        ...resultItinerary,
        id: `trip-${Math.random().toString(36).substring(2, 11)}`,
        createdAt: new Date().toISOString(),
        originalPrompt: promptText,
      };

      handleSetActiveTrip(newTrip);
      const updated = saveTripToStorage(newTrip);
      setSavedTrips(updated);
      showToast('AI Trip Plan generated successfully!', 'success');

    } catch (err: unknown) {
      clearInterval(stepInterval);
      if (activeGenerationId.current === generationId) {
        console.error('Itinerary generation error:', err);
        const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred during trip planning.';
        // Show user-friendly error state with option to fallback/retry
        setError(errorMessage);
        showToast('Generation failed', 'error');
      }
    } finally {
      if (activeGenerationId.current === generationId) {
        setLoading(false);
      }
    }
  };

  // Refinement loop flow
  const handleRefineTrip = async (refinementPrompt: string) => {
    if (!activeTrip || !refinementPrompt.trim()) return;

    const generationId = Date.now();
    activeGenerationId.current = generationId;

    setLoading(true);
    setError(null);
    setLoadingStep('Analyzing changes...');

    // Simulate loader steps
    const steps = [
      'Consulting map coordinates...',
      'Modifying stops schedule...',
      'Validating new locations...',
      'Polishing refined details...'
    ];
    let stepIndex = 0;
    const stepInterval = setInterval(() => {
      if (stepIndex < steps.length - 1) {
        stepIndex++;
        setLoadingStep(steps[stepIndex]);
      }
    }, 600);

    try {
      let refinedItinerary = null;
      let useStaticFallback = false;

      // If we are in demo mode (no API key configured), refine using local simulator
      if (isDemoMode) {
        await new Promise((resolve) => setTimeout(resolve, 1500));
        clearInterval(stepInterval);

        if (activeGenerationId.current !== generationId) return;

        const refined = await simulateTripRefinement(activeTrip, refinementPrompt);
        handleSetActiveTrip(refined);
        const updated = saveTripToStorage(refined);
        setSavedTrips(updated);
        showToast('Trip refined in Simulated Demo Mode', 'success');
        return;
      }

      try {
        const response = await fetch('/api/generate', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            prompt: refinementPrompt,
            refine: true,
            currentTrip: activeTrip,
            userApiKey: settings.apiKey,
          }),
        });

        clearInterval(stepInterval);

        if (activeGenerationId.current !== generationId) return;

        if (response.status === 404) {
          useStaticFallback = true;
        } else if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Failed to refine trip.');
        } else {
          const result = await response.json();
          refinedItinerary = result.itinerary;
        }
      } catch (err) {
        if (settings.apiKey) {
          useStaticFallback = true;
        } else {
          throw err;
        }
      }

      if (useStaticFallback) {
        if (!settings.apiKey) {
          throw new Error('API key missing. Configure a Gemini key in settings for static hosting.');
        }

        setLoadingStep('Directly refining trip from browser...');
        const apiEndpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${settings.apiKey}`;
        const userPrompt = getPromptForRefinement(activeTrip, refinementPrompt);

        const response = await fetch(apiEndpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
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
              temperature: 0.2,
            },
          }),
        });

        clearInterval(stepInterval);
        if (activeGenerationId.current !== generationId) return;

        if (!response.ok) {
          throw new Error(`Direct Gemini API failed with status ${response.status}`);
        }

        const data = await response.json();
        const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text;
        if (!rawText) {
          throw new Error('Direct Gemini API returned an empty response.');
        }

        const parsedJSON = extractJSON(rawText);
        refinedItinerary = validateTripJSON(parsedJSON);
      }

      if (!refinedItinerary) {
        throw new Error('Could not refine trip itinerary.');
      }
      
      const refinedTrip: Trip = {
        ...refinedItinerary,
        id: activeTrip.id, // Preserve same ID to update same session
        createdAt: activeTrip.createdAt,
        originalPrompt: activeTrip.originalPrompt,
      };

      handleSetActiveTrip(refinedTrip);
      const updated = saveTripToStorage(refinedTrip);
      setSavedTrips(updated);
      showToast('Trip refined successfully!', 'success');

    } catch (err: unknown) {
      clearInterval(stepInterval);
      if (activeGenerationId.current === generationId) {
        console.error('Itinerary refinement error:', err);
        const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred';
        setError(`Refinement failed: ${errorMessage}`);
        showToast('Refinement failed', 'error');
      }
    } finally {
      if (activeGenerationId.current === generationId) {
        setLoading(false);
      }
    }
  };

  // Custom filter version save (saves subset of current trip as new trip)
  const handleSaveFilteredVersion = (filteredStopsByDay: { [dayNum: number]: Stop[] }, titleSuffix = '(Filtered)') => {
    if (!activeTrip) return;

    const validatedDays = activeTrip.days
      .map(day => ({
        ...day,
        stops: filteredStopsByDay[day.dayNumber] || []
      }))
      .filter(day => day.stops.length > 0); // Keep days with stops

    if (validatedDays.length === 0) {
      showToast('No stops to save!', 'error');
      return;
    }

    const filteredTrip: Trip = {
      id: `trip-filter-${Math.random().toString(36).substring(2, 11)}`,
      title: `${activeTrip.title} ${titleSuffix}`,
      description: `A filtered version of your itinerary. Original: ${activeTrip.title}`,
      days: validatedDays,
      createdAt: new Date().toISOString(),
      originalPrompt: activeTrip.originalPrompt
    };

    handleSetActiveTrip(filteredTrip);
    const updated = saveTripToStorage(filteredTrip);
    setSavedTrips(updated);
    showToast('Filtered itinerary saved as a new trip!', 'success');
  };

  // Settings API Key update
  const handleSaveApiKey = (key: string) => {
    const updated = updateSettings({ apiKey: key.trim() });
    setSettingsState(updated);
    setShowSettingsModal(false);
    showToast('API Key saved to browser', 'success');
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-[100] animate-fade-in">
          <div className={`flex items-center gap-2 px-4 py-3 rounded-xl shadow-lg border text-sm font-medium ${
            toastMessage.type === 'error' 
              ? 'bg-red-50 border-red-200 text-red-800 dark:bg-red-950/80 dark:border-red-900 dark:text-red-300' 
              : 'bg-emerald-50 border-emerald-200 text-emerald-800 dark:bg-emerald-950/80 dark:border-emerald-900 dark:text-emerald-300'
          }`}>
            <div className={`h-2 w-2 rounded-full ${toastMessage.type === 'error' ? 'bg-red-500' : 'bg-emerald-500'}`} />
            <span>{toastMessage.text}</span>
          </div>
        </div>
      )}

      {/* Navigation Header */}
      <Header 
        savedCount={savedTrips.length}
        onOpenSaved={() => setSavedDrawerOpen(true)}
        onToggleTheme={handleToggleTheme}
        onOpenSettings={() => setShowSettingsModal(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col relative w-full max-w-6xl mx-auto px-4 py-8">
        
        {/* API Key warning banner if not set and trip active */}
        {!settings.apiKey && !isDemoMode && activeTrip && (
          <div className="mb-6 flex items-center justify-between gap-4 px-4 py-3 rounded-xl border border-amber-200 bg-amber-50/55 dark:border-amber-900/40 dark:bg-amber-950/20 text-amber-800 dark:text-amber-300 text-sm">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-amber-500" />
              <span>You are viewing a trip. Configure a <strong>Gemini API Key</strong> in settings for personal live AI planning.</span>
            </div>
            <button 
              onClick={() => setShowSettingsModal(true)}
              className="px-3 py-1 bg-amber-500/10 hover:bg-amber-500/20 text-amber-800 dark:text-amber-200 rounded-lg text-xs font-semibold border border-amber-500/20 transition-colors"
            >
              Set Key
            </button>
          </div>
        )}

        {/* Demo Mode alert banner */}
        {isDemoMode && activeTrip && (
          <div className="mb-6 flex items-center justify-between gap-4 px-4 py-3 rounded-xl border border-indigo-200 bg-indigo-50/50 dark:border-indigo-950/40 dark:bg-indigo-950/20 text-indigo-800 dark:text-indigo-300 text-sm">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-indigo-500" />
              <span><strong>Demo Mode Active:</strong> Server API Key missing. Currently using high-fidelity simulated itineraries.</span>
            </div>
            <button 
              onClick={() => setShowSettingsModal(true)}
              className="px-3 py-1 bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-800 dark:text-indigo-200 rounded-lg text-xs font-semibold border border-indigo-500/20 transition-colors"
            >
              Use Custom Key
            </button>
          </div>
        )}

        {/* Full Screen Loading Overlay */}
        {loading && (
          <div className="fixed inset-0 bg-slate-950/40 backdrop-blur-[2px] z-[90] flex flex-col items-center justify-center animate-fade-in">
            <div className="glass p-8 rounded-2xl border border-slate-200/50 dark:border-slate-800/50 shadow-2xl flex flex-col items-center max-w-xs text-center space-y-4">
              <div className="relative">
                <div className="h-12 w-12 rounded-full border-4 border-slate-200 dark:border-slate-800 border-t-primary animate-spin" />
                <Compass className="h-6 w-6 text-primary absolute inset-0 m-auto animate-pulse" />
              </div>
              <div className="space-y-1">
                <h4 className="font-bold text-slate-900 dark:text-white">Mapping your itinerary...</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium animate-pulse-subtle">{loadingStep}</p>
              </div>
              <button
                onClick={() => {
                  activeGenerationId.current = 0; // Invalidate current async flow
                  setLoading(false);
                  showToast('Generation cancelled', 'error');
                }}
                className="mt-2 text-xs font-semibold text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 underline"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Error Block */}
        {error && (
          <div className="mb-8 p-5 rounded-2xl border border-red-200 bg-red-50/50 dark:border-red-950/40 dark:bg-red-950/20 flex flex-col items-start gap-4">
            <div className="flex gap-3">
              <AlertTriangle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-bold text-red-900 dark:text-red-200">Trip Planning Failed</h4>
                <p className="text-sm text-red-700 dark:text-red-400 mt-1">{error}</p>
              </div>
            </div>
            <div className="flex gap-2">
              <button 
                onClick={() => handlePlanTrip(searchQuery)}
                className="flex items-center gap-1.5 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-semibold shadow-md shadow-red-500/10 transition-colors"
              >
                <RefreshCw className="h-3 w-3" />
                Retry
              </button>
              <button 
                onClick={() => setError(null)}
                className="px-4 py-2 bg-slate-200 hover:bg-slate-300 dark:bg-slate-900 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-semibold transition-colors"
              >
                Dismiss
              </button>
            </div>
          </div>
        )}

        {/* Dynamic Display based on activeTrip */}
        {activeTrip ? (
          <ItineraryView 
            trip={activeTrip}
            onUpdateTrip={(updated) => handleSetActiveTrip(updated)}
            onClose={() => handleSetActiveTrip(null)}
            onSaveFiltered={handleSaveFilteredVersion}
            onRefine={handleRefineTrip}
          />
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center max-w-2xl mx-auto w-full py-12 md:py-20 space-y-12">
            
            {/* Landing Intro */}
            <div className="text-center space-y-4">
              <h1 className="text-4xl md:text-5xl font-black tracking-tight leading-none bg-gradient-to-r from-slate-900 via-primary to-slate-900 dark:from-white dark:via-primary dark:to-white bg-clip-text text-transparent">
                A trip in a sentence
              </h1>
              <p className="text-lg text-slate-500 dark:text-slate-400 font-medium">
                Describe your trip. Get a plan you can shape.
              </p>
            </div>

            {/* Prompt Search Panel */}
            <div className="w-full glass dark:glass border border-slate-200/50 dark:border-slate-800/50 p-6 rounded-2xl shadow-xl flex flex-col space-y-4">
              <div className="relative">
                <textarea
                  rows={3}
                  maxLength={2000}
                  placeholder='e.g., "5 relaxed days in Lisbon with family exploring tiles and sweet bakeries"'
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full p-4 pr-12 bg-white/50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-base resize-none font-medium"
                />
                <div className="absolute bottom-3 right-3 text-xs font-semibold text-slate-400">
                  {searchQuery.length}/2000
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row justify-between items-center gap-3">
                {/* Suggestions Quick Buttons */}
                <div className="flex flex-wrap gap-2 w-full sm:w-auto">
                  <button
                    onClick={() => {
                      setSearchQuery('5 relaxed days in Lisbon, slow travel viewpoints and bakeries');
                      handlePlanTrip('5 relaxed days in Lisbon, slow travel viewpoints and bakeries');
                    }}
                    className="px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-900 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-full text-xs font-semibold border border-slate-200/50 dark:border-slate-800/50 transition-colors"
                  >
                    Lisbon 🇵🇹
                  </button>
                  <button
                    onClick={() => {
                      setSearchQuery('3-day solo food trip to Tokyo, ramen and standing sushi bar crawls');
                      handlePlanTrip('3-day solo food trip to Tokyo, ramen and standing sushi bar crawls');
                    }}
                    className="px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-900 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-full text-xs font-semibold border border-slate-200/50 dark:border-slate-800/50 transition-colors"
                  >
                    Tokyo 🇯🇵
                  </button>
                  <button
                    onClick={() => {
                      setSearchQuery('Weekend in Barcelona for two, Gaudí architecture and waterfront seafood');
                      handlePlanTrip('Weekend in Barcelona for two, Gaudí architecture and waterfront seafood');
                    }}
                    className="px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-900 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-full text-xs font-semibold border border-slate-200/50 dark:border-slate-800/50 transition-colors"
                  >
                    Barcelona 🇪🇸
                  </button>
                </div>

                <button
                  disabled={loading || !searchQuery.trim()}
                  onClick={() => handlePlanTrip(searchQuery)}
                  className="w-full sm:w-auto flex items-center justify-center gap-1.5 px-6 py-3 border border-transparent rounded-full text-sm font-semibold text-white bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md shadow-orange-500/15 hover:shadow-orange-600/25 active:scale-98 cursor-pointer"
                >
                  <Compass className="h-4 w-4 animate-spin-slow" />
                  <span>Plan my trip</span>
                </button>
              </div>
            </div>

            {/* Popular Destinations Cards */}
            <PopularDestinations 
              onSelect={(prompt) => {
                setSearchQuery(prompt);
                handlePlanTrip(prompt);
              }}
            />

          </div>
        )}
      </main>

      {/* Saved Trips Drawer */}
      <SavedDrawer 
        open={savedDrawerOpen}
        trips={savedTrips}
        onClose={() => setSavedDrawerOpen(false)}
        onLoadTrip={(trip) => {
          handleSetActiveTrip(trip);
          setSavedDrawerOpen(false);
          showToast('Loaded trip successfully', 'success');
        }}
        onDeleteTrip={handleDeleteSavedTrip}
      />

      {/* API Key Settings Modal */}
      {showSettingsModal && (
        <div className="fixed inset-0 bg-slate-950/40 backdrop-blur-[2px] z-[95] flex items-center justify-center p-4 animate-fade-in">
          <div className="glass w-full max-w-md p-6 rounded-2xl border border-slate-200/50 dark:border-slate-800/50 shadow-2xl flex flex-col space-y-4 relative">
            <button 
              onClick={() => setShowSettingsModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            >
              <X className="h-5 w-5" />
            </button>
            <div className="flex items-center gap-2 text-primary">
              <Settings className="h-5 w-5" />
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Travel Planner Settings</h3>
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-500 dark:text-slate-400">Gemini API Key</label>
              <input
                type="password"
                placeholder={settings.apiKey ? "••••••••••••••••••••" : "Paste your GEMINI_API_KEY..."}
                defaultValue=""
                id="apiKeyInput"
                className="w-full px-4 py-3 bg-white/50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm"
              />
              <p className="text-[10px] text-slate-400 dark:text-slate-500 font-medium">
                Your key is stored locally in your browser and is only sent to the serverless proxy function. It is never logged or exposed.
              </p>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              {settings.apiKey && (
                <button
                  onClick={() => {
                    const updated = updateSettings({ apiKey: undefined });
                    setSettingsState(updated);
                    setShowSettingsModal(false);
                    showToast('Custom API Key cleared', 'success');
                  }}
                  className="px-4 py-2 border border-slate-200 dark:border-slate-800 text-red-500 rounded-full text-xs font-semibold hover:bg-red-50 dark:hover:bg-red-950/20 transition-colors"
                >
                  Clear Key
                </button>
              )}
              <button
                onClick={() => {
                  const input = document.getElementById('apiKeyInput') as HTMLInputElement;
                  if (input && input.value) {
                    handleSaveApiKey(input.value);
                  } else {
                    setShowSettingsModal(false);
                  }
                }}
                className="px-4 py-2 bg-primary hover:opacity-90 text-white rounded-full text-xs font-semibold shadow-sm transition-colors"
              >
                Save Settings
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
