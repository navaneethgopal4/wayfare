import React from 'react';
import { Sparkles, Map } from 'lucide-react';

interface PopularDestinationsProps {
  onSelect: (prompt: string) => void;
}

interface DestinationCard {
  city: string;
  country: string;
  tagline: string;
  gradient: string;
  prompt: string;
  emoji: string;
}

const DESTINATIONS: DestinationCard[] = [
  {
    city: 'Lisbon',
    country: 'Portugal',
    tagline: 'Scenic hills, historic yellow trams, and fresh custard tarts.',
    gradient: 'from-amber-500/10 to-orange-600/10 dark:from-amber-900/10 dark:to-orange-950/10 border-orange-200/50 dark:border-orange-900/30 hover:border-orange-500',
    prompt: '5 relaxed days in Lisbon, slow travel viewpoints and bakeries',
    emoji: '🇵🇹',
  },
  {
    city: 'Tokyo',
    country: 'Japan',
    tagline: 'Neon alleyways, fresh standing sushi, and historic shrines.',
    gradient: 'from-rose-500/10 to-violet-600/10 dark:from-rose-900/10 dark:to-violet-950/10 border-rose-200/50 dark:border-rose-900/30 hover:border-rose-500',
    prompt: '3-day solo food trip to Tokyo, ramen and standing sushi bar crawls',
    emoji: '🇯🇵',
  },
  {
    city: 'Barcelona',
    country: 'Spain',
    tagline: 'Whimsical Gaudí architecture, beachside vermouth, and tapas.',
    gradient: 'from-teal-500/10 to-blue-600/10 dark:from-teal-900/10 dark:to-blue-950/10 border-teal-200/50 dark:border-teal-900/30 hover:border-teal-500',
    prompt: 'Weekend in Barcelona for two, Gaudí architecture and beachfront tapas',
    emoji: '🇪🇸',
  },
  {
    city: 'Paris',
    country: 'France',
    tagline: 'Charming cafes, world-class art, and walking the Seine.',
    gradient: 'from-sky-500/10 to-indigo-600/10 dark:from-sky-900/10 dark:to-indigo-950/10 border-sky-200/50 dark:border-sky-900/30 hover:border-sky-500',
    prompt: '4 days in Paris exploring art museums, cozy bakeries and walking along the Seine',
    emoji: '🇫🇷',
  },
];

export default function PopularDestinations({ onSelect }: PopularDestinationsProps) {
  return (
    <div className="w-full space-y-6 animate-fade-in">
      <div className="flex items-center gap-2">
        <Sparkles className="h-4 w-4 text-violet-600 dark:text-violet-400" />
        <h3 className="text-sm font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
          Or try a popular destination
        </h3>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {DESTINATIONS.map((dest) => (
          <button
            key={dest.city}
            onClick={() => onSelect(dest.prompt)}
            className={`flex flex-col items-start p-5 rounded-2xl border bg-gradient-to-br ${dest.gradient} text-left transition-all duration-300 hover:shadow-md hover:-translate-y-0.5 active:translate-y-0 active:shadow-sm cursor-pointer`}
          >
            <span className="text-3xl mb-3 select-none">{dest.emoji}</span>
            <div className="space-y-0.5">
              <h4 className="font-extrabold text-slate-900 dark:text-white text-base">
                {dest.city}
              </h4>
              <p className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                {dest.country}
              </p>
            </div>
            <p className="mt-2 text-xs text-slate-500 dark:text-slate-400 font-medium leading-relaxed">
              {dest.tagline}
            </p>
            <div className="mt-4 flex items-center gap-1 text-[10px] font-bold text-violet-600 dark:text-violet-400 uppercase tracking-widest">
              <Map className="h-3.5 w-3.5" />
              <span>Generate Plan</span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
