import { useState, useRef } from "react";
import LocationAutocomplete from "./LocationAutocomplete";

interface TripData {
  title: string;
  startDate: string;
  endDate: string;
  comment: string;
  location?: string;
  center?: { lat: number; lng: number };
}

interface AddTripFormProps {
  initialData?: TripData;
  onSubmit: (trip: TripData) => void;
  onCancel?: () => void;
  submitLabel?: string;
}

function AddTripForm({
  initialData,
  onSubmit,
  onCancel,
  submitLabel,
}: AddTripFormProps) {
  const [title, setTitle] = useState(initialData?.title || "");
  const [startDate, setStartDate] = useState(initialData?.startDate || "");
  const [endDate, setEndDate] = useState(initialData?.endDate || "");
  const [comment, setComment] = useState(initialData?.comment || "");
  const [location, setLocation] = useState(initialData?.location || "");
  const centerRef = useRef<{ lat: number; lng: number } | null>(
    initialData?.center || null
  );

  const onSelect = ({
    lat,
    lng,
    name,
  }: {
    lat: number;
    lng: number;
    name: string;
  }) => {
    centerRef.current = { lat, lng };
    setLocation(name);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !startDate || !endDate) return;

    if (!centerRef.current) {
      alert("여행지는 자동완성 목록에서 선택해주세요!");
      return;
    }

    onSubmit({
      title,
      startDate,
      endDate,
      comment,
      location,
      center: centerRef.current,
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
      <LocationAutocomplete onSelect={onSelect} initialValue={location} />
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
          {submitLabel || "등록"}
        </button>
      </div>
    </form>
  );
}

export default AddTripForm;
