import { useRef } from "react";
import { Autocomplete } from "@react-google-maps/api";

interface Props {
  onSelect: (location: { name: string; lat: number; lng: number }) => void;
}

function LocationAutocomplete({ onSelect }: Props) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);

  const handlePlaceChanged = () => {
    if (autocompleteRef.current) {
      const place = autocompleteRef.current.getPlace();
      if (place.geometry && place.geometry.location) {
        onSelect({
          name: place.name || place.formatted_address || "",
          lat: place.geometry.location.lat(),
          lng: place.geometry.location.lng(),
        });
      }
    }
  };

  if (typeof window.google === "undefined") {
    return <p>지도 로딩 중...</p>;
  }

  return (
    <Autocomplete
      onLoad={(autocomplete) => (autocompleteRef.current = autocomplete)}
      onPlaceChanged={handlePlaceChanged}
    >
      <input
        ref={inputRef}
        type="text"
        placeholder="도시명을 입력하세요"
        className="border px-3 py-2 rounded w-full"
      />
    </Autocomplete>
  );
}

export default LocationAutocomplete;
