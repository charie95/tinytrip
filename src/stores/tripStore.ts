import { create } from "zustand";

interface Trip {
  id: string;
  title: string;
  startDate: string;
  endDate: string;
  comment: string;
}

interface TripState {
  trips: Trip[];
  addTrip: (trip: Trip) => void;
  removeTrip: (id: string) => void;
}

const LOCAL_KEY = "tinytrip-trips";

export const useTripStore = create<TripState>((set, get) => {
  const saved = localStorage.getItem(LOCAL_KEY);
  const initialTrips = saved ? JSON.parse(saved) : [];

  const syncToLocalStorage = (trips: Trip[]) => {
    localStorage.setItem(LOCAL_KEY, JSON.stringify(trips));
  };

  return {
    trips: initialTrips,
    addTrip: (trip) => {
      const updated = [...get().trips, trip];
      set({ trips: updated });
      syncToLocalStorage(updated);
    },
    removeTrip: (id) => {
      const updated = get().trips.filter((trip) => trip.id !== id);
      set({ trips: updated });
      syncToLocalStorage(updated);
    },
  };
});
