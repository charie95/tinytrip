import { useParams, Link } from "react-router-dom";
import { useTripStore } from "../stores/tripStore";
import { getDateRange } from "../utils/Date";
import TripDetailMap from "../components/TripDetailMap";
import TripPlanList from "../components/TripPlanList";
import AddTripForm from "../components/AddTripForm";
import { useState } from "react";

const TripDetail = () => {
  const { id } = useParams<{ id: string }>();
  const trip = useTripStore((state) => state.trips.find((t) => t.id === id));
  const updateTrip = useTripStore((state) => state.updateTrip);
  const [isTripEditMode, setIsTripEditMode] = useState(false);
  const [polylineRenderKey, setPolylineRenderKey] = useState(0);

  if (!trip) return <div className="p-4">😢 해당 여행을 찾을 수 없습니다.</div>;

  const dateRange = getDateRange(trip.startDate, trip.endDate);

  const handleAddPin = (lat: number, lng: number) => {
    const updatedPins = {
      ...trip.pins,
      [dateRange[0]]: [...(trip.pins?.[dateRange[0]] || []), { lat, lng }],
    };
    updateTrip({ ...trip, pins: updatedPins });
  };

  const handleRemovePin = (date: string, idx: number) => {
    const updatedPins = {
      ...trip.pins,
      [date]: (trip.pins?.[date] || []).filter((_, i) => i !== idx),
    };
    updateTrip({ ...trip, pins: updatedPins });
  };

  return (
    <div className="flex h-screen overflow-hidden">
      <div className="w-full max-w-md p-6 overflow-y-auto bg-white shadow-lg">
        <Link to="/trips" className="text-sm text-blue-500 hover:underline inline-block mb-2">
          ← 여행 목록으로 돌아가기
        </Link>
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">{trip.title}</h1>
          <button
            className="text-sm text-blue-500 hover:underline"
            onClick={() => setIsTripEditMode(true)}
          >
            ✏️ 수정하기
          </button>
        </div>
        <p className="text-sm text-gray-500">📅 {trip.startDate} ~ {trip.endDate}</p>
        <p>📝 {trip.comment}</p>
        {trip.location && <p>📍 위치: {trip.location}</p>}
        <TripPlanList trip={trip} dateRange={dateRange} updateTrip={updateTrip} />
      </div>
      <div className="flex-1 relative">
        {trip.center?.lat && trip.center?.lng ? (
          <TripDetailMap
            trip={trip}
            dateRange={dateRange}
            onAddPin={handleAddPin}
            onRemovePin={handleRemovePin}
            polylineRenderKey={polylineRenderKey}
          />
        ) : (
          <div className="p-4 text-sm text-gray-500">
            📭 장소 정보를 선택하지 않아 지도를 표시할 수 없습니다.
          </div>
        )}
      </div>
      {isTripEditMode && (
        <AddTripForm
          initialData={trip}
          submitLabel="저장"
        onSubmit={(updated) => {
        updateTrip({
          ...trip,  
          ...updated, 
        });
        setPolylineRenderKey((prev) => prev + 1);
        setIsTripEditMode(false);
      }}
        />
      )}
    </div>
  );
};

export default TripDetail;
