import { create } from "zustand";
import { Trip } from "../types/trip";
import { TripState } from "../types/store";

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

    updateTrip: (updatedTrip) => {
      const updated = get().trips.map((trip) =>
        trip.id === updatedTrip.id ? updatedTrip : trip
      );
      set({ trips: updated });
      syncToLocalStorage(updated);
    },

    getTripById: (id) => {
      return get().trips.find((trip) => trip.id === id);
    },
  };
});
