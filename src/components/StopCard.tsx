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

  // Category bubble configuration helper
  const getCategoryConfig = (cat: Stop['category']) => {
    switch (cat) {
      case 'Food':
        return {
          icon: <Utensils className="h-3.5 w-3.5 text-white" />,
          colorClass: 'bg-orange-500 dark:bg-orange-600',
        };
      case 'Sight':
        return {
          icon: <Camera className="h-3.5 w-3.5 text-white" />,
          colorClass: 'bg-sky-500 dark:bg-sky-600',
        };
      case 'Activity':
        return {
          icon: <Compass className="h-3.5 w-3.5 text-white" />,
          colorClass: 'bg-emerald-500 dark:bg-emerald-600',
        };
      case 'Transit':
        return {
          icon: <Car className="h-3.5 w-3.5 text-white" />,
          colorClass: 'bg-slate-500 dark:bg-slate-600',
        };
      case 'Shopping':
        return {
          icon: <ShoppingBag className="h-3.5 w-3.5 text-white" />,
          colorClass: 'bg-pink-500 dark:bg-pink-600',
        };
      default:
        return {
          icon: <Compass className="h-3.5 w-3.5 text-white" />,
          colorClass: 'bg-slate-400 dark:bg-slate-500',
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
      
      {/* Timeline Solid Icon Bubble (exactly centered on the vertical line) */}
      <div className={`absolute left-[-37px] sm:left-[-41px] top-[10px] h-8 w-8 rounded-full border-4 border-slate-50 dark:border-slate-950 ${catConfig.colorClass} z-10 flex items-center justify-center shadow-sm select-none`}>
        {catConfig.icon}
      </div>

      {/* Main Stop Card */}
      <div className={`p-4 rounded-xl border border-border bg-card shadow-sm transition-all duration-300 ${
        isEditing ? 'ring-2 ring-primary/25 border-primary' : ''
      }`}>
        
        {isEditing ? (
          /* Editing Form state */
          <div className="space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="space-y-1">
                <label className="font-bold text-slate-400 uppercase tracking-wider text-[9px]">Time</label>
                <input
                  type="text"
                  value={editTime}
                  onChange={(e) => setEditTime(e.target.value)}
                  className="w-full px-2.5 py-1.5 bg-slate-50 dark:bg-slate-900 border border-border rounded-lg text-slate-900 dark:text-white focus:outline-none focus:border-primary"
                />
              </div>
              <div className="space-y-1">
                <label className="font-bold text-slate-400 uppercase tracking-wider text-[9px]">Category</label>
                <select
                  value={editCategory}
                  onChange={(e) => setEditCategory(e.target.value as Stop['category'])}
                  className="w-full px-2 py-1.5 bg-slate-50 dark:bg-slate-900 border border-border rounded-lg text-slate-900 dark:text-white font-semibold focus:outline-none focus:border-primary"
                >
                  <option value="Food">Food 🍔</option>
                  <option value="Sight">Sight 📸</option>
                  <option value="Activity">Activity 🧭</option>
                  <option value="Transit">Transit 🚗</option>
                  <option value="Shopping">Shopping 🛍️</option>
                </select>
              </div>
              <div className="space-y-1">
                <label className="font-bold text-slate-400 uppercase tracking-wider text-[9px]">Duration</label>
                <input
                  type="text"
                  value={editDuration}
                  onChange={(e) => setEditDuration(e.target.value)}
                  className="w-full px-2.5 py-1.5 bg-slate-50 dark:bg-slate-900 border border-border rounded-lg text-slate-900 dark:text-white focus:outline-none focus:border-primary"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="font-bold text-slate-400 uppercase tracking-wider text-[9px]">Stop Title</label>
              <input
                type="text"
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                placeholder="Name of location..."
                className="w-full px-2.5 py-2 bg-slate-50 dark:bg-slate-900 border border-border rounded-lg text-sm font-bold text-slate-900 dark:text-white focus:outline-none focus:border-primary"
              />
            </div>

            <div className="space-y-1">
              <label className="font-bold text-slate-400 uppercase tracking-wider text-[9px]">Description</label>
              <textarea
                rows={2}
                value={editDesc}
                onChange={(e) => setEditDesc(e.target.value)}
                placeholder="Add details or advice..."
                className="w-full px-2.5 py-2 bg-slate-50 dark:bg-slate-900 border border-border rounded-lg text-slate-900 dark:text-white resize-none focus:outline-none focus:border-primary"
              />
            </div>

            <div className="space-y-1">
              <label className="font-bold text-slate-400 uppercase tracking-wider text-[9px]">Location Address</label>
              <input
                type="text"
                value={editLocation}
                onChange={(e) => setEditLocation(e.target.value)}
                placeholder="Physical address / landmark..."
                className="w-full px-2.5 py-2 bg-slate-50 dark:bg-slate-900 border border-border rounded-lg text-slate-900 dark:text-white focus:outline-none focus:border-primary"
              />
            </div>

            <div className="flex justify-end gap-2 pt-1">
              <button
                onClick={handleCancel}
                className="flex items-center gap-1 px-3 py-1.5 border border-border hover:bg-muted rounded-full text-slate-500 font-bold transition-all cursor-pointer"
              >
                <X className="h-3.5 w-3.5" />
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="flex items-center gap-1 px-3 py-1.5 bg-primary hover:opacity-90 text-white rounded-full font-bold transition-all cursor-pointer"
              >
                <Check className="h-3.5 w-3.5" />
                Save Stop
              </button>
            </div>
          </div>
        ) : (
          /* View Mode state */
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
            
            {/* Left stop details */}
            <div className="space-y-2.5 flex-1">
              
              {/* Timing & Duration (No duplicate category tags) */}
              <div className="flex items-center gap-3 text-xs font-semibold">
                <span className="text-slate-900 dark:text-white font-extrabold uppercase bg-slate-100 dark:bg-slate-900 px-2 py-0.5 rounded-lg select-none">
                  {stop.time}
                </span>
                
                {stop.duration && (
                  <span className="flex items-center gap-1 text-[10px] text-slate-400 font-bold uppercase tracking-wider select-none">
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

            {/* Right Card Actions Controls (Move, Edit, Delete) - Fades in on hover */}
            <div className="flex sm:flex-col items-center justify-end sm:justify-start gap-1 sm:self-stretch border-t sm:border-t-0 pt-2 sm:pt-0 border-slate-100 dark:border-slate-800/40 opacity-100 sm:opacity-0 group-hover/card:opacity-100 transition-opacity duration-200">
              
              {/* Move buttons group */}
              <div className="flex items-center gap-1 bg-slate-50 dark:bg-slate-900/50 p-0.5 rounded-full">
                <button
                  disabled={isFirst}
                  onClick={onMoveUp}
                  className="p-1 rounded-full text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-white dark:hover:bg-slate-800 transition-all"
                  title="Move stop up"
                >
                  <ChevronUp className="h-3.5 w-3.5" />
                </button>
                <button
                  disabled={isLast}
                  onClick={onMoveDown}
                  className="p-1 rounded-full text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-white dark:hover:bg-slate-800 transition-all"
                  title="Move stop down"
                >
                  <ChevronDown className="h-3.5 w-3.5" />
                </button>
              </div>

              {/* Edit / Remove actions */}
              <div className="flex sm:flex-row items-center gap-1 sm:mt-1">
                <button
                  onClick={() => setIsEditing(true)}
                  className="p-1.5 text-slate-400 hover:text-primary rounded-full hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors"
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
                  className="p-1.5 text-slate-400 hover:text-destructive rounded-full hover:bg-destructive/10 transition-colors"
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
