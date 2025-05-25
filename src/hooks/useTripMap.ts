import { useEffect, useRef } from "react";
import { Trip } from "../types/trip";

export const useTripMap = (
  trip: Trip,
  dateRange: string[],
  polylineRenderKey: number,
  polylineColors: string[]
) => {
  const mapRef = useRef<google.maps.Map | null>(null);
  const polylineRef = useRef<Record<string, google.maps.Polyline>>({});

  useEffect(() => {
    const map = mapRef.current;
    if (!map || !trip.pins) return;

    // 기존 Polyline 제거
    Object.values(polylineRef.current).forEach((poly) => poly.setMap(null));
    polylineRef.current = {};

    // 새로운 Polyline 생성
    Object.entries(trip.pins).forEach(([date, pins]) => {
      if (pins.length < 2) return;
      const dayIndex = dateRange.findIndex((d) => d === date);
      const polyline = new google.maps.Polyline({
        path: pins,
        map,
        strokeColor: polylineColors[dayIndex % polylineColors.length],
        strokeOpacity: 0.5,
        strokeWeight: 2,
      });
      polylineRef.current[date] = polyline;
    });
  }, [trip.pins, dateRange, polylineRenderKey, polylineColors]);

  return {
    mapRef,
    polylineRef,
  };
};