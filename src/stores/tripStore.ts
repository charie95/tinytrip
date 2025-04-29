import { create } from 'zustand';

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

export const useTripStore = create<TripState>((set) => ({
  trips: [],
  addTrip: (trip) =>
    set((state) => ({
      trips: [...state.trips, trip],
    })),
  removeTrip: (id) =>
    set((state) => ({
      trips: state.trips.filter((trip) => trip.id !== id),
    })),
}));