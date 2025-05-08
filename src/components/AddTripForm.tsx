import { useState } from "react";
import LocationAutocomplete from "./LocationAutocomplete";

interface AddTripFormProps {
  onSubmit: (trip: {
    title: string;
    startDate: string;
    endDate: string;
    comment: string;
    location: string;
    center?: { lat: number; lng: number };
  }) => void;
  onCancel?: () => void;
}

function AddTripForm({ onSubmit, onCancel }: AddTripFormProps) {
  const [title, setTitle] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [comment, setComment] = useState("");
  const [location, setLocation] = useState("");
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(
    null
  );
  const [isPlaceSelected, setIsPlaceSelected] = useState(false);

  const [center, setCenter] = useState<{ lat: number; lng: number } | null>(
    null
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !startDate || !endDate) return;

    if (!isPlaceSelected) {
      alert("여행지는 자동완성 목록에서 선택해주세요!");
      return;
    }

    onSubmit({
      title,
      startDate,
      endDate,
      comment,
      location,
      center: center || undefined,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <input
        type="text"
        placeholder="여행 제목"
        className="border px-3 py-2 rounded"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <input
        type="date"
        className="border px-3 py-2 rounded"
        value={startDate}
        onChange={(e) => setStartDate(e.target.value)}
      />
      <input
        type="date"
        className="border px-3 py-2 rounded"
        value={endDate}
        onChange={(e) => setEndDate(e.target.value)}
      />
      <LocationAutocomplete
        onSelect={({ name, lat, lng }) => {
          setLocation(name);
          setCenter({ lat, lng });
          setIsPlaceSelected(true);
        }}
      />
      <textarea
        placeholder="여행 내용, 메모 등"
        className="border px-3 py-2 rounded resize-none h-24"
        value={comment}
        onChange={(e) => setComment(e.target.value)}
      />
      <div className="flex justify-end gap-2">
        <button
          type="button"
          className="px-4 py-2 bg-gray-300 rounded"
          onClick={onCancel}
        >
          취소
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          등록
        </button>
      </div>
    </form>
  );
}

export default AddTripForm;
