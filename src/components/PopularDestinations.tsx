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
  imageUrl: string;
}

const DESTINATIONS: DestinationCard[] = [
  {
    city: 'Lisbon',
    country: 'Portugal',
    tagline: 'Scenic hills, historic yellow trams, and fresh custard tarts.',
    gradient: 'hover:border-orange-500/50',
    prompt: '5 relaxed days in Lisbon, slow travel viewpoints and bakeries',
    emoji: '🇵🇹',
    imageUrl: '/images/lisbon.png',
  },
  {
    city: 'Tokyo',
    country: 'Japan',
    tagline: 'Neon alleyways, fresh standing sushi, and historic shrines.',
    gradient: 'hover:border-rose-500/50',
    prompt: '3-day solo food trip to Tokyo, ramen and standing sushi bar crawls',
    emoji: '🇯🇵',
    imageUrl: '/images/tokyo.png',
  },
  {
    city: 'Barcelona',
    country: 'Spain',
    tagline: 'Whimsical Gaudí architecture, beachside vermouth, and tapas.',
    gradient: 'hover:border-teal-500/50',
    prompt: 'Weekend in Barcelona for two, Gaudí architecture and beachfront tapas',
    emoji: '🇪🇸',
    imageUrl: '/images/barcelona.png',
  },
  {
    city: 'Paris',
    country: 'France',
    tagline: 'Charming cafes, world-class art, and walking the Seine.',
    gradient: 'hover:border-sky-500/50',
    prompt: '4 days in Paris exploring art museums, cozy bakeries and walking along the Seine',
    emoji: '🇫🇷',
    imageUrl: '/images/paris.png',
  },
];

export default function PopularDestinations({ onSelect }: PopularDestinationsProps) {
  return (
    <div className="w-full space-y-6 animate-fade-in">
      <div className="flex items-center gap-2">
        <Sparkles className="h-4 w-4 text-primary" />
        <h3 className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
          Or try a popular destination
        </h3>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {DESTINATIONS.map((dest) => (
          <button
            key={dest.city}
            onClick={() => onSelect(dest.prompt)}
            className={`group flex flex-col items-start rounded-2xl border border-border/60 bg-card overflow-hidden text-left transition-all duration-300 shadow-sm hover:shadow-md hover:-translate-y-0.5 active:translate-y-0 active:shadow-sm cursor-pointer ${dest.gradient}`}
          >
            {/* Top image wrapper */}
            <div className="w-full h-36 relative overflow-hidden bg-slate-100 dark:bg-slate-900">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img 
                src={dest.imageUrl} 
                alt={dest.city}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              {/* Country Emoji Badge */}
              <span className="absolute top-3 right-3 bg-white/90 dark:bg-slate-950/90 backdrop-blur-sm px-2.5 py-1 rounded-full text-xs font-bold shadow-sm select-none">
                {dest.emoji}
              </span>
            </div>

            {/* Bottom Card Content */}
            <div className="p-5 flex-1 flex flex-col w-full">
              <div className="space-y-0.5">
                <h4 className="font-extrabold text-slate-900 dark:text-white text-base group-hover:text-primary transition-colors">
                  {dest.city}
                </h4>
                <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                  {dest.country}
                </p>
              </div>
              <p className="mt-2 text-xs text-slate-500 dark:text-slate-400 font-medium leading-relaxed flex-1">
                {dest.tagline}
              </p>
              <div className="mt-4 flex items-center gap-1.5 text-[10px] font-bold text-primary uppercase tracking-widest pt-4 border-t border-slate-100 dark:border-slate-800/40 w-full">
                <Map className="h-3.5 w-3.5" />
                <span>Generate Plan</span>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
