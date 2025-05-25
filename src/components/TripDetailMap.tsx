import { useEffect, useRef, useCallback } from "react";
import { GoogleMap, Marker } from "@react-google-maps/api";
import { cleanupPolylines } from "../utils/cleanupPolylines";
import {Trip} from "../types/trip";
import { useRecoilValue } from "recoil";
import { selectedDateState, isEditModeState } from "../states/tripUi";

const markerColors = [
  "red",
  "blue",
  "green",
  "orange",
  "purple",
  "yellow",
  "pink",
  "cyan",
  "brown",
  "gray",
];

type TripDetailMapProps = {
  trip: Trip;
  dateRange: string[];
  onAddPin: (lat: number, lng: number) => void;
  onRemovePin: (date: string, idx: number) => void;
  polylineRenderKey: number;
};

const TripDetailMap = ({
  trip,
  dateRange,
  onAddPin,
  onRemovePin,
  polylineRenderKey,
}: TripDetailMapProps) => {
  const mapRef = useRef<google.maps.Map | null>(null);
  const polylineRef = useRef<Record<string, google.maps.Polyline>>({});

  const selectedDate = useRecoilValue(selectedDateState);
  const isEditMode = useRecoilValue(isEditModeState);

 useEffect(() => {
    const map = mapRef.current;
    if (!map || !trip.pins) return;
    cleanupPolylines(polylineRef.current);

    Object.entries(trip.pins).forEach(([date, pins]) => {
      if (pins.length < 2) return;
      const dayIndex = dateRange.findIndex((d) => d === date);
      const polyline = new google.maps.Polyline({
        path: pins,
        map,
        strokeColor: markerColors[dayIndex % markerColors.length],
        strokeOpacity: 0.5,
        strokeWeight: 2,
      });
      polylineRef.current[date] = polyline;
    });
  }, [trip.pins, dateRange, polylineRenderKey]);

    const handleMapLoad = useCallback((map: google.maps.Map) => {
    mapRef.current = map;
  }, []);

  return (
    <GoogleMap
      mapContainerStyle={{ width: "100%", height: "100%" }}
      center={trip.center!}
      zoom={13}
      onLoad={handleMapLoad}
      onClick={(e) => {
        if (!isEditMode || !selectedDate) return;
        const lat = e.latLng?.lat();
        const lng = e.latLng?.lng();
        if (lat && lng) onAddPin(lat, lng);
      }}
    >
      {Object.entries(trip.pins || {}).map(([date, pins]) =>
        pins.map((pin, idx) => (
          <Marker
            key={`marker-${date}-${idx}`}
            position={pin}
            label={{
              text: `D${dateRange.findIndex((d) => d === date) + 1}`,
              fontSize: "12px",
              fontWeight: "bold",
            }}
            icon={{
              url: `http://maps.google.com/mapfiles/ms/icons/${markerColors[dateRange.findIndex((d) => d === date) % markerColors.length]}-dot.png`,
            }}
            onClick={() => {
              if (confirm("이 마커를 삭제할까요?")) onRemovePin(date, idx);
            }}
          />
        ))
      )}
    </GoogleMap>
  );
};

export default TripDetailMap;