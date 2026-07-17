import React from 'react';
import { ChevronDown, ChevronUp, Trash2, Plus, CalendarDays } from 'lucide-react';
import { Day, Stop } from '@/utils/storage';
import StopCard from './StopCard';

interface DayAccordionProps {
  day: Day;
  filteredStops: Stop[];
  isFiltered: boolean;
  expanded: boolean;
  onToggle: () => void;
  onUpdateStop: (stopId: string, fields: Partial<Stop>) => void;
  onRemoveStop: (stopId: string) => void;
  onMoveStop: (stopId: string, direction: 'up' | 'down') => void;
  onAddStop: () => void;
  onRemoveDay: () => void;
}

export default function DayAccordion({
  day,
  filteredStops,
  isFiltered,
  expanded,
  onToggle,
  onUpdateStop,
  onRemoveStop,
  onMoveStop,
  onAddStop,
  onRemoveDay
}: DayAccordionProps) {
  
  const handleDayDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent toggling collapse when deleting
    if (confirm(`Are you sure you want to remove Day ${day.dayNumber}? This will delete all stops inside it.`)) {
      onRemoveDay();
    }
  };

  return (
    <div className="glass dark:glass border border-slate-200/50 dark:border-slate-800/50 rounded-2xl overflow-hidden shadow-sm transition-all duration-300">
      
      {/* Accordion Trigger Header */}
      <div 
        onClick={onToggle}
        className="w-full flex items-center justify-between p-5 bg-white/40 dark:bg-slate-900/40 hover:bg-white/60 dark:hover:bg-slate-900/60 transition-colors cursor-pointer select-none group"
      >
        <div className="flex items-center gap-3">
          <CalendarDays className="h-5 w-5 text-violet-600 dark:text-violet-400" />
          <div className="text-left">
            <h3 className="font-extrabold text-base text-slate-900 dark:text-white group-hover:text-violet-600 dark:group-hover:text-violet-400 transition-colors">
              {day.title}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold uppercase tracking-wider mt-0.5">
              {isFiltered 
                ? `Showing ${filteredStops.length} of ${day.stops.length} stops` 
                : `${day.stops.length} stops`}
            </p>
          </div>
        </div>

        {/* Action icons */}
        <div className="flex items-center gap-3">
          {/* Delete Day Button */}
          <button
            onClick={handleDayDeleteClick}
            className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 rounded-lg opacity-80 sm:opacity-0 group-hover:opacity-100 transition-all"
            title={`Delete Day ${day.dayNumber}`}
          >
            <Trash2 className="h-4 w-4" />
          </button>
          
          <div className="text-slate-400">
            {expanded ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
          </div>
        </div>

      </div>

      {/* Accordion Content Body */}
      {expanded && (
        <div className="p-5 border-t border-slate-200/50 dark:border-slate-800/50 bg-slate-50/20 dark:bg-slate-950/10 space-y-6">
          {filteredStops.length > 0 ? (
            <div className="relative pl-6 sm:pl-8 space-y-6">
              
              {/* Vertical Timeline Thread Line */}
              <div className="absolute left-[13px] sm:left-[17px] top-3 bottom-3 w-[2px] bg-slate-200 dark:bg-slate-800 pointer-events-none" />

              {filteredStops.map((stop, idx) => (
                <StopCard
                  key={stop.id}
                  stop={stop}
                  isFirst={idx === 0}
                  isLast={idx === filteredStops.length - 1}
                  onUpdate={(fields) => onUpdateStop(stop.id, fields)}
                  onRemove={() => onRemoveStop(stop.id)}
                  onMoveUp={() => onMoveStop(stop.id, 'up')}
                  onMoveDown={() => onMoveStop(stop.id, 'down')}
                />
              ))}

            </div>
          ) : (
            <div className="text-center py-6 text-slate-400 text-xs font-semibold">
              {isFiltered 
                ? "No matching stops for the active filters."
                : "No stops added to this day yet."}
            </div>
          )}

          {/* Add Stop Trigger (Hide when filtered to keep view clean) */}
          {!isFiltered && (
            <button
              onClick={onAddStop}
              className="w-full flex items-center justify-center gap-1.5 py-3 border-2 border-dashed border-slate-200 hover:border-violet-500 dark:border-slate-800 dark:hover:border-violet-500/50 rounded-xl text-slate-500 hover:text-violet-600 dark:text-slate-400 dark:hover:text-violet-400 text-xs font-bold transition-all bg-white/20 dark:bg-slate-900/10 hover:bg-violet-50/20 dark:hover:bg-violet-950/10 cursor-pointer"
            >
              <Plus className="h-4 w-4" />
              <span>Add Stop</span>
            </button>
          )}

        </div>
      )}

    </div>
  );
}
