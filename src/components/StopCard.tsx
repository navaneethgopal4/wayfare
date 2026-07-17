import React, { useState } from 'react';
import { 
  Utensils, Camera, Compass, Car, ShoppingBag, 
  Trash2, ChevronUp, ChevronDown, Pencil, Check, X, MapPin, Clock 
} from 'lucide-react';
import { Stop } from '@/utils/storage';

interface StopCardProps {
  stop: Stop;
  isFirst: boolean;
  isLast: boolean;
  onUpdate: (fields: Partial<Stop>) => void;
  onRemove: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
}

export default function StopCard({
  stop,
  isFirst,
  isLast,
  onUpdate,
  onRemove,
  onMoveUp,
  onMoveDown
}: StopCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(stop.title);
  const [editTime, setEditTime] = useState(stop.time);
  const [editCategory, setEditCategory] = useState(stop.category);
  const [editDuration, setEditDuration] = useState(stop.duration);
  const [editDesc, setEditDesc] = useState(stop.description);
  const [editLocation, setEditLocation] = useState(stop.location);

  // Category visual styles helper
  const getCategoryConfig = (cat: Stop['category']) => {
    switch (cat) {
      case 'Food':
        return {
          icon: <Utensils className="h-4 w-4 text-orange-600 dark:text-orange-400" />,
          colorClass: 'bg-orange-50 border-orange-200 dark:bg-orange-950/30 dark:border-orange-900/40',
          dotClass: 'bg-orange-500 ring-orange-200 dark:ring-orange-900/50',
        };
      case 'Sight':
        return {
          icon: <Camera className="h-4 w-4 text-sky-600 dark:text-sky-400" />,
          colorClass: 'bg-sky-50 border-sky-200 dark:bg-sky-950/30 dark:border-sky-900/40',
          dotClass: 'bg-sky-500 ring-sky-200 dark:ring-sky-900/50',
        };
      case 'Activity':
        return {
          icon: <Compass className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />,
          colorClass: 'bg-emerald-50 border-emerald-200 dark:bg-emerald-950/30 dark:border-emerald-900/40',
          dotClass: 'bg-emerald-500 ring-emerald-200 dark:ring-emerald-900/50',
        };
      case 'Transit':
        return {
          icon: <Car className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />,
          colorClass: 'bg-indigo-50 border-indigo-200 dark:bg-indigo-950/30 dark:border-indigo-900/40',
          dotClass: 'bg-indigo-500 ring-indigo-200 dark:ring-indigo-900/50',
        };
      case 'Shopping':
        return {
          icon: <ShoppingBag className="h-4 w-4 text-pink-600 dark:text-pink-400" />,
          colorClass: 'bg-pink-50 border-pink-200 dark:bg-pink-950/30 dark:border-pink-900/40',
          dotClass: 'bg-pink-500 ring-pink-200 dark:ring-pink-900/50',
        };
      default:
        return {
          icon: <Compass className="h-4 w-4 text-slate-600 dark:text-slate-400" />,
          colorClass: 'bg-slate-50 border-slate-200 dark:bg-slate-900 dark:border-slate-800',
          dotClass: 'bg-slate-500 ring-slate-200 dark:ring-slate-800',
        };
    }
  };

  const catConfig = getCategoryConfig(stop.category);

  const handleSave = () => {
    if (!editTitle.trim()) return;
    
    onUpdate({
      title: editTitle.trim(),
      time: editTime.trim(),
      category: editCategory,
      duration: editDuration.trim(),
      description: editDesc.trim(),
      location: editLocation.trim(),
    });
    
    setIsEditing(false);
  };

  const handleCancel = () => {
    // Reset values to original stop fields
    setEditTitle(stop.title);
    setEditTime(stop.time);
    setEditCategory(stop.category);
    setEditDuration(stop.duration);
    setEditDesc(stop.description);
    setEditLocation(stop.location);
    setIsEditing(false);
  };

  return (
    <div className="relative group/card w-full">
      
      {/* Timeline Circle Bullet Point */}
      <div className={`absolute left-[-21px] sm:left-[-27px] top-[14px] h-[12px] w-[12px] rounded-full ring-4 ${catConfig.dotClass} bg-white dark:bg-slate-950 z-10 transition-colors`} />

      {/* Main Card Container */}
      <div className={`p-4 rounded-xl border border-slate-200/60 dark:border-slate-800/60 bg-white dark:bg-slate-950 shadow-sm transition-all duration-300 hover:shadow ${
        isEditing ? 'ring-2 ring-violet-500/25 border-violet-500 dark:border-violet-500' : ''
      }`}>
        
        {isEditing ? (
          /* Editing Mode Inputs Form */
          <div className="space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="space-y-1">
                <label className="font-bold text-slate-400">Time</label>
                <input
                  type="text"
                  value={editTime}
                  onChange={(e) => setEditTime(e.target.value)}
                  className="w-full px-2 py-1.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-900 dark:text-white"
                />
              </div>
              <div className="space-y-1">
                <label className="font-bold text-slate-400">Category</label>
                <select
                  value={editCategory}
                  onChange={(e) => setEditCategory(e.target.value as Stop['category'])}
                  className="w-full px-2 py-1.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-900 dark:text-white font-medium"
                >
                  <option value="Food">Food 🍔</option>
                  <option value="Sight">Sight 📸</option>
                  <option value="Activity">Activity 🧭</option>
                  <option value="Transit">Transit 🚗</option>
                  <option value="Shopping">Shopping 🛍️</option>
                </select>
              </div>
              <div className="space-y-1">
                <label className="font-bold text-slate-400">Duration</label>
                <input
                  type="text"
                  value={editDuration}
                  onChange={(e) => setEditDuration(e.target.value)}
                  className="w-full px-2 py-1.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-900 dark:text-white"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="font-bold text-slate-400">Stop Title</label>
              <input
                type="text"
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                placeholder="Name of location..."
                className="w-full px-2.5 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-sm font-bold text-slate-900 dark:text-white"
              />
            </div>

            <div className="space-y-1">
              <label className="font-bold text-slate-400">Description</label>
              <textarea
                rows={2}
                value={editDesc}
                onChange={(e) => setEditDesc(e.target.value)}
                placeholder="Add details, advice, or what to order..."
                className="w-full px-2.5 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-900 dark:text-white resize-none"
              />
            </div>

            <div className="space-y-1">
              <label className="font-bold text-slate-400">Location Address</label>
              <input
                type="text"
                value={editLocation}
                onChange={(e) => setEditLocation(e.target.value)}
                placeholder="Physical address / landmark..."
                className="w-full px-2.5 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-900 dark:text-white"
              />
            </div>

            {/* Save / Cancel actions */}
            <div className="flex justify-end gap-2 pt-1">
              <button
                onClick={handleCancel}
                className="flex items-center gap-1 px-3 py-1.5 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900 rounded-lg text-slate-500 font-bold transition-colors cursor-pointer"
              >
                <X className="h-3.5 w-3.5" />
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="flex items-center gap-1 px-3 py-1.5 bg-violet-600 hover:bg-violet-700 text-white rounded-lg font-bold transition-colors cursor-pointer"
              >
                <Check className="h-3.5 w-3.5" />
                Save Stop
              </button>
            </div>
          </div>
        ) : (
          /* View Mode Card Content */
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
            
            {/* Left stop details side */}
            <div className="space-y-2.5 flex-1">
              
              {/* Timing, Category badge & Duration */}
              <div className="flex flex-wrap items-center gap-2 text-xs font-semibold">
                <span className="text-slate-900 dark:text-white font-extrabold uppercase bg-slate-100 dark:bg-slate-900 px-2 py-0.5 rounded-lg select-none">
                  {stop.time}
                </span>
                
                {/* Category Pill Tag */}
                <span className={`flex items-center gap-1.5 px-2.5 py-0.5 border rounded-full select-none ${catConfig.colorClass}`}>
                  {catConfig.icon}
                  <span className="text-[10px] uppercase font-bold tracking-wider">{stop.category}</span>
                </span>

                {stop.duration && (
                  <span className="flex items-center gap-1 text-[10px] text-slate-400 font-semibold uppercase tracking-wider pl-1 select-none">
                    <Clock className="h-3 w-3" />
                    {stop.duration}
                  </span>
                )}
              </div>

              {/* Title & Description */}
              <div className="space-y-0.5">
                <h4 className="font-extrabold text-sm text-slate-900 dark:text-white">
                  {stop.title}
                </h4>
                {stop.description && (
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed max-w-xl">
                    {stop.description}
                  </p>
                )}
              </div>

              {/* Location Detail */}
              {stop.location && (
                <div className="flex items-center gap-1 text-[10px] text-slate-400 dark:text-slate-500 font-semibold truncate select-none">
                  <MapPin className="h-3 w-3 text-slate-400 flex-shrink-0" />
                  <span>{stop.location}</span>
                </div>
              )}

            </div>

            {/* Right Card Actions Controls (Move, Edit, Delete) */}
            <div className="flex sm:flex-col items-center justify-end sm:justify-start gap-1 sm:self-stretch border-t sm:border-t-0 pt-2 sm:pt-0 border-slate-100 dark:border-slate-800/40">
              
              {/* Move buttons group */}
              <div className="flex items-center gap-1 bg-slate-50 dark:bg-slate-900/50 p-0.5 rounded-lg">
                <button
                  disabled={isFirst}
                  onClick={onMoveUp}
                  className="p-1 rounded text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-white dark:hover:bg-slate-800 transition-all"
                  title="Move stop up"
                >
                  <ChevronUp className="h-3.5 w-3.5" />
                </button>
                <button
                  disabled={isLast}
                  onClick={onMoveDown}
                  className="p-1 rounded text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-white dark:hover:bg-slate-800 transition-all"
                  title="Move stop down"
                >
                  <ChevronDown className="h-3.5 w-3.5" />
                </button>
              </div>

              {/* Edit / Remove actions */}
              <div className="flex sm:flex-row items-center gap-1 sm:mt-1">
                <button
                  onClick={() => setIsEditing(true)}
                  className="p-1.5 text-slate-400 hover:text-violet-600 dark:hover:text-violet-400 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors"
                  title="Edit stop"
                >
                  <Pencil className="h-3.5 w-3.5" />
                </button>
                <button
                  onClick={() => {
                    if (confirm(`Remove stop: "${stop.title}"?`)) {
                      onRemove();
                    }
                  }}
                  className="p-1.5 text-slate-400 hover:text-red-500 rounded-lg hover:bg-red-50 dark:hover:bg-red-950/20 transition-colors"
                  title="Delete stop"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>

            </div>

          </div>
        )}

      </div>
    </div>
  );
}
