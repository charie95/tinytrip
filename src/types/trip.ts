export interface Trip {
  id: string;
  title: string;
  startDate: string;
  endDate: string;
  comment: string;
  location?: string;
  plan?: { [date: string]: string };
  pins?: { lat: number; lng: number }[];
  center?: { lat: number; lng: number };
}
