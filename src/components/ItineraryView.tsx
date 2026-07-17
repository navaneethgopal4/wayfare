import React, { useState, useMemo } from 'react';
import { ArrowLeft, Search, BookmarkCheck, RotateCcw, Send, Sparkles } from 'lucide-react';
import { Trip, Day, Stop } from '@/utils/storage';
import DayAccordion from './DayAccordion';

interface ItineraryViewProps {
  trip: Trip;
  onUpdateTrip: (trip: Trip) => void;
  onClose: () => void;
  onSaveFiltered: (filteredStopsByDay: { [dayNum: number]: Stop[] }) => void;
  onRefine: (refinementPrompt: string) => void;
}

type DurationFilter = 'all' | 'under30' | 'mid' | 'over90';

// Helper to parse duration string (e.g., "45 min", "2 hours") to minutes
function parseDuration(durationStr: string): number {
  try {
    const clean = durationStr.toLowerCase().trim();
    const numbers = clean.match(/\d+(\.\d+)?/);
    if (!numbers) return 60; // Default fallback

    const val = parseFloat(numbers[0]);
    if (clean.includes('hour') || clean.includes('hr') || (clean.includes('h') && !clean.includes('min'))) {
      return val * 60;
    }
    return val;
  } catch (_) {
    return 60;
  }
}

export default function ItineraryView({ trip, onUpdateTrip, onClose, onSaveFiltered, onRefine }: ItineraryViewProps) {
  const [searchText, setSearchText] = useState('');
  const [durationFilter, setDurationFilter] = useState<DurationFilter>('all');
  const [refineInput, setRefineInput] = useState('');
  const [expandedDays, setExpandedDays] = useState<{ [dayNum: number]: boolean }>({ 1: true });

  // Toggle expansion of specific day accordion
  const toggleDayExpansion = (dayNum: number) => {
    setExpandedDays(prev => ({
      ...prev,
      [dayNum]: !prev[dayNum]
    }));
  };

  // 1. Filter stops based on search text and duration tabs
  const filteredStopsByDay = useMemo(() => {
    const result: { [dayNum: number]: Stop[] } = {};

    trip.days.forEach((day) => {
      const filtered = day.stops.filter((stop) => {
        // Search filter matching name, description, location, and category
        const matchesSearch = 
          stop.title.toLowerCase().includes(searchText.toLowerCase()) ||
          stop.description.toLowerCase().includes(searchText.toLowerCase()) ||
          stop.location.toLowerCase().includes(searchText.toLowerCase()) ||
          stop.category.toLowerCase().includes(searchText.toLowerCase());

        if (!matchesSearch) return false;

        // Duration filter matching tabs
        if (durationFilter === 'all') return true;
        const mins = parseDuration(stop.duration);
        if (durationFilter === 'under30') return mins <= 30;
        if (durationFilter === 'mid') return mins > 30 && mins <= 90;
        if (durationFilter === 'over90') return mins > 90;

        return true;
      });

      result[day.dayNumber] = filtered;
    });

    return result;
  }, [trip, searchText, durationFilter]);

  // Statistics counters
  const totalStopsCount = useMemo(() => {
    return trip.days.reduce((acc, day) => acc + day.stops.length, 0);
  }, [trip]);

  const filteredStopsCount = useMemo(() => {
    return Object.values(filteredStopsByDay).reduce((acc, stops) => acc + stops.length, 0);
  }, [filteredStopsByDay]);

  const isFiltered = searchText.trim() !== '' || durationFilter !== 'all';

  // Clear all filters
  const handleClearFilters = () => {
    setSearchText('');
    setDurationFilter('all');
  };

  // 2. Day-level / Stop-level State Modifiers
  const handleUpdateStop = (dayNum: number, stopId: string, updatedFields: Partial<Stop>) => {
    const updatedDays = trip.days.map((day) => {
      if (day.dayNumber !== dayNum) return day;
      return {
        ...day,
        stops: day.stops.map((stop) => {
          if (stop.id !== stopId) return stop;
          return { ...stop, ...updatedFields };
        }),
      };
    });

    onUpdateTrip({ ...trip, days: updatedDays });
  };

  const handleRemoveStop = (dayNum: number, stopId: string) => {
    const updatedDays = trip.days.map((day) => {
      if (day.dayNumber !== dayNum) return day;
      return {
        ...day,
        stops: day.stops.filter((stop) => stop.id !== stopId),
      };
    });

    onUpdateTrip({ ...trip, days: updatedDays });
  };

  const handleMoveStop = (dayNum: number, stopId: string, direction: 'up' | 'down') => {
    const updatedDays = trip.days.map((day) => {
      if (day.dayNumber !== dayNum) return day;
      
      const idx = day.stops.findIndex((s) => s.id === stopId);
      if (idx === -1) return day;
      if (direction === 'up' && idx === 0) return day;
      if (direction === 'down' && idx === day.stops.length - 1) return day;

      const targetIdx = direction === 'up' ? idx - 1 : idx + 1;
      const stopsCopy = [...day.stops];
      const temp = stopsCopy[idx];
      stopsCopy[idx] = stopsCopy[targetIdx];
      stopsCopy[targetIdx] = temp;

      return {
        ...day,
        stops: stopsCopy,
      };
    });

    onUpdateTrip({ ...trip, days: updatedDays });
  };

  const handleAddStop = (dayNum: number) => {
    const updatedDays = trip.days.map((day) => {
      if (day.dayNumber !== dayNum) return day;

      const newStop: Stop = {
        id: `stop-add-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
        time: '12:00 PM',
        title: 'New Stop Landmark',
        category: 'Sight',
        duration: '60 min',
        description: 'Double click to edit details of this stop.',
        location: 'Location address',
      };

      return {
        ...day,
        stops: [...day.stops, newStop],
      };
    });

    onUpdateTrip({ ...trip, days: updatedDays });
    
    // Automatically make sure the day accordion is expanded when adding
    setExpandedDays(prev => ({ ...prev, [dayNum]: true }));
  };

  const handleRemoveDay = (dayNum: number) => {
    const filteredDays = trip.days.filter((d) => d.dayNumber !== dayNum);
    // Re-index remaining days to maintain chronological sequential numbers
    const reindexedDays = filteredDays.map((day, idx) => ({
      ...day,
      dayNumber: idx + 1,
    }));

    onUpdateTrip({ ...trip, days: reindexedDays });
  };

  // Submit refinement prompt
  const handleRefineSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!refineInput.trim()) return;
    onRefine(refineInput);
    setRefineInput('');
  };

  return (
    <div className="w-full space-y-6 pb-24 animate-fade-in">
      
      {/* 1. Header Navigation & Details Card */}
      <div className="glass dark:glass border border-slate-200/50 dark:border-slate-800/50 p-6 rounded-2xl shadow-sm flex flex-col space-y-4">
        <div className="flex items-center gap-3">
          <button 
            onClick={onClose}
            className="p-2 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900 rounded-xl text-slate-500 dark:text-slate-400 transition-colors"
            title="Go back"
          >
            <ArrowLeft className="h-4 w-4" />
          </button>
          <div>
            <h1 className="text-2xl font-black text-slate-900 dark:text-white leading-tight">
              {trip.title}
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 font-medium mt-1 leading-relaxed">
              {trip.description}
            </p>
          </div>
        </div>
      </div>

      {/* 2. Search & Filter Bar */}
      <div className="glass dark:glass border border-slate-200/50 dark:border-slate-800/50 p-4 rounded-xl shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        
        {/* Search & Duration Tabs Group */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 flex-1">
          {/* Keyword Search Input */}
          <div className="relative flex-1">
            <Search className="h-4 w-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              placeholder="Search stops, categories..."
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-semibold text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-violet-500 transition-all"
            />
          </div>

          {/* Duration tabs */}
          <div className="flex gap-1 bg-slate-100 dark:bg-slate-950 p-1 rounded-xl self-start sm:self-auto border border-slate-200/40 dark:border-slate-800/40">
            {[
              { key: 'all', label: 'All' },
              { key: 'under30', label: '≤30 min' },
              { key: 'mid', label: '31–90 min' },
              { key: 'over90', label: '90+ min' },
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setFilter(tab.key as DurationFilter)}
                className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors border border-transparent select-none ${
                  durationFilter === tab.key
                    ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm border-slate-200/40 dark:border-slate-800/40'
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Action / Statistics Group */}
        <div className="flex items-center justify-between md:justify-end gap-4 border-t md:border-t-0 pt-3 md:pt-0 border-slate-200/40 dark:border-slate-800/40">
          <div className="text-xs font-semibold text-slate-400 dark:text-slate-500">
            Showing <strong className="text-slate-700 dark:text-slate-300">{filteredStopsCount}</strong> of {totalStopsCount} stops
          </div>

          {isFiltered && (
            <div className="flex items-center gap-2">
              <button
                onClick={handleClearFilters}
                className="flex items-center gap-1 px-3 py-2 text-xs font-bold text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 border border-slate-200 dark:border-slate-800 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                Clear
              </button>
              <button
                onClick={() => onSaveFiltered(filteredStopsByDay)}
                className="flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-white bg-violet-600 hover:bg-violet-700 rounded-xl transition-colors shadow-sm"
              >
                <BookmarkCheck className="h-3.5 w-3.5" />
                Save Filtered
              </button>
            </div>
          )}
        </div>

      </div>

      {/* 3. Day Accordion List */}
      <div className="space-y-4">
        {trip.days.map((day) => {
          const stops = filteredStopsByDay[day.dayNumber] || [];
          
          return (
            <DayAccordion
              key={day.dayNumber}
              day={day}
              filteredStops={stops}
              isFiltered={isFiltered}
              expanded={!!expandedDays[day.dayNumber]}
              onToggle={() => toggleDayExpansion(day.dayNumber)}
              onUpdateStop={(stopId, fields) => handleUpdateStop(day.dayNumber, stopId, fields)}
              onRemoveStop={(stopId) => handleRemoveStop(day.dayNumber, stopId)}
              onMoveStop={(stopId, dir) => handleMoveStop(day.dayNumber, stopId, dir)}
              onAddStop={() => handleAddStop(day.dayNumber)}
              onRemoveDay={() => handleRemoveDay(day.dayNumber)}
            />
          );
        })}
      </div>

      {/* 4. Refinement Loop Chat Panel */}
      <div className="glass dark:glass border border-slate-200/50 dark:border-slate-800/50 p-6 rounded-2xl shadow-sm flex flex-col space-y-4 mt-8">
        <div className="flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-violet-600 dark:text-violet-400" />
          <h3 className="font-extrabold text-sm text-slate-800 dark:text-slate-200">Refine this itinerary</h3>
        </div>
        <form onSubmit={handleRefineSubmit} className="relative flex items-center gap-3">
          <textarea
            rows={1}
            value={refineInput}
            onChange={(e) => setRefineInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleRefineSubmit(e);
              }
            }}
            placeholder='e.g., "Add more food stops to Day 2" or "Make it more budget friendly"'
            className="w-full pl-4 pr-14 py-3.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 transition-all text-xs font-semibold resize-none h-[48px] overflow-hidden"
          />
          <button
            type="submit"
            disabled={!refineInput.trim()}
            className="absolute right-2 top-2 p-2 bg-violet-600 hover:bg-violet-700 text-white rounded-lg disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            title="Send refinement"
          >
            <Send className="h-4 w-4" />
          </button>
        </form>
      </div>

    </div>
  );
}
