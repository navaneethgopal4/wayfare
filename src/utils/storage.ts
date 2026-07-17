export interface Stop {
  id: string;
  time: string;
  title: string;
  category: 'Food' | 'Sight' | 'Activity' | 'Transit' | 'Shopping';
  duration: string;
  description: string;
  location: string;
}

export interface Day {
  dayNumber: number;
  title: string;
  stops: Stop[];
}

export interface Trip {
  id: string;
  title: string;
  description: string;
  days: Day[];
  createdAt: string;
  originalPrompt: string;
}

export interface UserSettings {
  apiKey?: string;
  theme?: 'light' | 'dark';
}

const STORAGE_KEYS = {
  SAVED_TRIPS: 'wayfare_saved_trips',
  ACTIVE_TRIP: 'wayfare_active_trip',
  SETTINGS: 'wayfare_settings',
};

// Local storage safe wrapper check
const isClient = typeof window !== 'undefined';

export function getSavedTrips(): Trip[] {
  if (!isClient) return [];
  try {
    const data = localStorage.getItem(STORAGE_KEYS.SAVED_TRIPS);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error reading saved trips from local storage:', error);
    return [];
  }
}

export function saveTrip(trip: Trip): Trip[] {
  if (!isClient) return [];
  try {
    const trips = getSavedTrips();
    const existingIndex = trips.findIndex((t) => t.id === trip.id);
    if (existingIndex > -1) {
      trips[existingIndex] = trip;
    } else {
      trips.unshift(trip);
    }
    localStorage.setItem(STORAGE_KEYS.SAVED_TRIPS, JSON.stringify(trips));
    return trips;
  } catch (error) {
    console.error('Error saving trip to local storage:', error);
    return getSavedTrips();
  }
}

export function deleteSavedTrip(id: string): Trip[] {
  if (!isClient) return [];
  try {
    const trips = getSavedTrips();
    const filtered = trips.filter((t) => t.id !== id);
    localStorage.setItem(STORAGE_KEYS.SAVED_TRIPS, JSON.stringify(filtered));
    return filtered;
  } catch (error) {
    console.error('Error deleting saved trip from local storage:', error);
    return getSavedTrips();
  }
}

export function getActiveTrip(): Trip | null {
  if (!isClient) return null;
  try {
    const data = localStorage.getItem(STORAGE_KEYS.ACTIVE_TRIP);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error('Error reading active trip from local storage:', error);
    return null;
  }
}

export function setActiveTrip(trip: Trip | null): void {
  if (!isClient) return;
  try {
    if (trip) {
      localStorage.setItem(STORAGE_KEYS.ACTIVE_TRIP, JSON.stringify(trip));
    } else {
      localStorage.removeItem(STORAGE_KEYS.ACTIVE_TRIP);
    }
  } catch (error) {
    console.error('Error writing active trip to local storage:', error);
  }
}

export function getSettings(): UserSettings {
  if (!isClient) return {};
  try {
    const data = localStorage.getItem(STORAGE_KEYS.SETTINGS);
    return data ? JSON.parse(data) : {};
  } catch (error) {
    console.error('Error reading settings from local storage:', error);
    return {};
  }
}

export function updateSettings(settings: Partial<UserSettings>): UserSettings {
  if (!isClient) return {};
  try {
    const current = getSettings();
    const updated = { ...current, ...settings };
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(updated));
    return updated;
  } catch (error) {
    console.error('Error updating settings in local storage:', error);
    return getSettings();
  }
}
