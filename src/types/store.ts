import { Trip } from "./trip";

export interface TripState {
  trips: Trip[];
  addTrip: (trip: Trip) => void;
  removeTrip: (id: string) => void;
  updateTrip: (updatedTrip: Trip) => void;
  getTripById: (id: string) => Trip | undefined;
}
