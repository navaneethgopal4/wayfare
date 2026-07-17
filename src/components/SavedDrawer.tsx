import React, { useState } from 'react';
import { X, Trash2, Calendar, MapPin, Search } from 'lucide-react';
import { Trip } from '@/utils/storage';

interface SavedDrawerProps {
  open: boolean;
  trips: Trip[];
  onClose: () => void;
  onLoadTrip: (trip: Trip) => void;
  onDeleteTrip: (id: string) => void;
}

type DurationFilter = 'all' | 'short' | 'medium' | 'long';

export default function SavedDrawer({ open, trips, onClose, onLoadTrip, onDeleteTrip }: SavedDrawerProps) {
  const [filter, setFilter] = useState<DurationFilter>('all');
  const [searchTerm, setSearchTerm] = useState('');

  if (!open) return null;

  const countStops = (trip: Trip) => {
    return trip.days.reduce((acc, day) => acc + day.stops.length, 0);
  };

  const filteredTrips = trips.filter((trip) => {
    const matchesSearch = 
      trip.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
      trip.description.toLowerCase().includes(searchTerm.toLowerCase());

    if (!matchesSearch) return false;

    const days = trip.days.length;
    if (filter === 'short') return days <= 3;
    if (filter === 'medium') return days >= 4 && days <= 6;
    if (filter === 'long') return days >= 7;
    return true;
  });

  return (
    <div className="fixed inset-0 z-50 overflow-hidden animate-fade-in">
      {/* Overlay Backdrop */}
      <div 
        onClick={onClose}
        className="absolute inset-0 bg-slate-950/40 backdrop-blur-[2px]" 
      />

      {/* Slide-out Panel */}
      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white dark:bg-slate-900 shadow-2xl flex flex-col border-l border-border animate-slide-in-right">
          
          {/* Header */}
          <div className="p-6 border-b border-border flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <span>Saved itineraries</span>
              <span className="text-[10px] bg-secondary text-slate-500 dark:text-slate-400 font-extrabold px-2 py-0.5 rounded-full select-none">
                {trips.length}
              </span>
            </h2>
            <button 
              onClick={onClose}
              className="p-1.5 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-muted transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Search & Filter Controls */}
          <div className="p-4 border-b border-border/60 space-y-3">
            {/* Search Input */}
            <div className="relative">
              <Search className="h-4 w-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="text"
                placeholder="Search saved trips..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-4 py-2 text-xs font-semibold bg-slate-50 dark:bg-slate-950 border border-border rounded-full text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>

            {/* Filter Chips */}
            <div className="flex gap-1.5 overflow-x-auto pb-1">
              {[
                { key: 'all', label: 'All' },
                { key: 'short', label: '≤3 days' },
                { key: 'medium', label: '4-6 days' },
                { key: 'long', label: '7+ days' },
              ].map((chip) => (
                <button
                  key={chip.key}
                  onClick={() => setFilter(chip.key as DurationFilter)}
                  className={`px-3 py-1.5 text-xs font-bold rounded-full transition-colors border select-none ${
                    filter === chip.key
                      ? 'bg-primary border-primary text-white shadow-sm'
                      : 'bg-card border-border text-slate-600 dark:text-slate-400 hover:bg-muted'
                  }`}
                >
                  {chip.label}
                </button>
              ))}
            </div>
          </div>

          {/* Trips List Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {filteredTrips.length > 0 ? (
              filteredTrips.map((trip) => (
                <div 
                  key={trip.id}
                  className="group relative p-4 rounded-xl border border-border hover:border-primary bg-card hover:bg-slate-50/50 dark:hover:bg-slate-950/40 transition-all shadow-sm hover:shadow-md cursor-pointer"
                  onClick={() => onLoadTrip(trip)}
                >
                  <div className="pr-8 space-y-1">
                    <h4 className="font-extrabold text-sm text-slate-900 dark:text-white group-hover:text-primary transition-colors">
                      {trip.title}
                    </h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                      {trip.description}
                    </p>
                  </div>

                  <div className="mt-3 flex items-center gap-3 text-[9px] text-slate-400 font-extrabold uppercase tracking-wider">
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {trip.days.length} {trip.days.length === 1 ? 'Day' : 'Days'}
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      {countStops(trip)} stops
                    </span>
                  </div>

                  {/* Delete Button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteTrip(trip.id);
                    }}
                    className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-destructive hover:bg-destructive/10 rounded-full opacity-80 sm:opacity-0 group-hover:opacity-100 focus:opacity-100 transition-all"
                    title="Delete saved plan"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              ))
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-2">
                <Calendar className="h-8 w-8 text-slate-300 dark:text-slate-700" />
                <h5 className="font-bold text-slate-700 dark:text-slate-300 text-sm">No itineraries found</h5>
                <p className="text-xs text-slate-400 dark:text-slate-500 max-w-[200px]">
                  {trips.length === 0
                    ? "Go back and generate a trip plan to save it here."
                    : "Try adjusting your filters or search terms."}
                </p>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
