import { useState, useEffect, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import { useTripStore } from "../stores/tripStore";
import { GoogleMap, Marker } from "@react-google-maps/api";
import { getDateRange } from "../utils/Date";
import AddTripForm from "../components/AddTripForm";
import { useRecoilState } from "recoil";
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

const TripDetail = () => {
  const { id } = useParams<{ id: string }>();
  const trip = useTripStore((state) => state.trips.find((t) => t.id === id));
  const updateTrip = useTripStore((state) => state.updateTrip);
  const [selectedDate, setSelectedDate] = useRecoilState(selectedDateState);
  const [isEditMode, setIsEditMode] = useRecoilState(isEditModeState);
  const [isTripEditMode, setIsTripEditMode] = useState<boolean>(false);
  const [polylineRenderKey, setPolylineRenderKey] = useState(0);

  const mapRef = useRef<google.maps.Map | null>(null);
  const polylineRef = useRef<Record<string, google.maps.Polyline>>({});

  useEffect(() => {
    if (trip?.startDate && trip?.endDate && !selectedDate) {
      const range = getDateRange(trip.startDate, trip.endDate);
      setSelectedDate(range[0]);
    }
  }, [trip, selectedDate, setSelectedDate]);

  if (!trip) {
    return <div className="p-4">😢 해당 여행 일정을 찾을 수 없습니다.</div>;
  }

  const dateRange = getDateRange(trip.startDate, trip.endDate);

  useEffect(() => {
    const map = mapRef.current;
    if (!map || !trip.pins) return;

    Object.values(polylineRef.current).forEach((poly) => poly.setMap(null));
    polylineRef.current = {};

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

  if (isTripEditMode) {
    return (
      <div className="p-6 max-w-xl mx-auto">
        <AddTripForm
          initialData={trip}
          submitLabel="저장"
          onSubmit={(updated) => {
            const oldRange = getDateRange(trip.startDate, trip.endDate);
            const newRange = getDateRange(updated.startDate, updated.endDate);

            const isDateChanged =
              trip.startDate !== updated.startDate ||
              trip.endDate !== updated.endDate;

            const isLocationChanged = trip.location !== updated.location;

            const noChange =
              !isDateChanged &&
              !isLocationChanged &&
              trip.title === updated.title &&
              trip.comment === updated.comment;

            if (noChange) {
              setIsTripEditMode(false);
              return;
            }

            let updatedPins = trip.pins;
            let updatedPlan = trip.plan;

            if (isDateChanged || isLocationChanged) {
              updatedPins = {};
              updatedPlan = {};

              for (let i = 0; i < newRange.length; i++) {
                const oldDate = oldRange[i];
                const newDate = newRange[i];

                updatedPins[newDate] = isLocationChanged
                  ? []
                  : (oldDate && trip.pins?.[oldDate]) || [];

                updatedPlan[newDate] = (oldDate && trip.plan?.[oldDate]) || "";
              }
            }

            updateTrip({
              ...trip,
              ...updated,
              pins: updatedPins,
              plan: updatedPlan,
            });

            setTimeout(() => setPolylineRenderKey((prev) => prev + 1), 0);
            setIsTripEditMode(false);
          }}
          onCancel={() => setIsTripEditMode(false)}
        />
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden">
      <div className="w-full max-w-md p-6 overflow-y-auto bg-white shadow-lg">
        <Link
          to="/trips"
          className="text-sm text-blue-500 hover:underline inline-block mb-2"
        >
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
        <p className="text-sm text-gray-500">
          📅 {trip.startDate} ~ {trip.endDate}
        </p>
        <p>📝 {trip.comment}</p>
        {trip.location && <p>📍 위치: {trip.location}</p>}

        <div className="mt-6 space-y-4">
          <h2 className="text-xl font-semibold">📅 날짜별 계획</h2>
          <button
            className="mt-4 text-sm px-3 py-1 border rounded bg-gray-100 hover:bg-gray-200"
            onClick={() => setIsEditMode(!isEditMode)}
          >
            {isEditMode ? "🛑 마커 찍기 끄기" : "📍 마커 찍기 켜기"}
          </button>
          {dateRange.map((date, index) => (
            <div key={date}>
              <p
                className={`text-sm font-semibold cursor-pointer ${
                  selectedDate === date ? "text-blue-600" : ""
                }`}
                onClick={() => setSelectedDate(date)}
              >
                DAY {index + 1}
                <span className="text-gray-500 ml-2">{date}</span>
              </p>
              <textarea
                className="w-full p-2 border rounded"
                rows={2}
                value={trip.plan?.[date] || ""}
                placeholder="여행 계획을 입력하세요..."
                onChange={(e) => {
                  const updatedPlan = {
                    ...trip.plan,
                    [date]: e.target.value,
                  };
                  updateTrip({ ...trip, plan: updatedPlan });
                }}
              />
            </div>
          ))}
        </div>
      </div>

      <div className="flex-1 relative">
        {trip.center?.lat && trip.center?.lng ? (
          <GoogleMap
            mapContainerStyle={{ width: "100%", height: "100%" }}
            center={{ lat: trip.center.lat, lng: trip.center.lng }}
            zoom={13}
            onLoad={(map) => {
              mapRef.current = map;
            }}
            onClick={(e) => {
              if (!isEditMode || !selectedDate) return;
              const lat = e.latLng?.lat();
              const lng = e.latLng?.lng();
              if (!lat || !lng) return;

              const newPin = { lat, lng };
              const updatedPins = {
                ...(trip.pins || {}),
                [selectedDate]: [...(trip.pins?.[selectedDate] || []), newPin],
              };

              updateTrip({ ...trip, pins: updatedPins });
            }}
          >
            {Object.entries(trip.pins || {}).map(([date, pins]) => {
              const dayIndex = dateRange.findIndex((d) => d === date);
              return pins.map((pin, idx) => (
                <Marker
                  key={`marker-${date}-${idx}`}
                  position={pin}
                  label={{
                    text: `D${dayIndex + 1}`,
                    fontSize: "12px",
                    fontWeight: "bold",
                  }}
                  icon={{
                    url: `http://maps.google.com/mapfiles/ms/icons/${
                      markerColors[dayIndex % markerColors.length]
                    }-dot.png`,
                  }}
                  onClick={() => {
                    if (!confirm("이 마커를 삭제할까요?")) return;

                    const updatedPins = {
                      ...trip.pins,
                      [date]: (trip.pins?.[date] || []).filter(
                        (_, i) => i !== idx
                      ),
                    };

                    updateTrip({ ...trip, pins: updatedPins });
                  }}
                />
              ));
            })}
          </GoogleMap>
        ) : (
          <div className="p-4 text-sm text-gray-500">
            📭 장소 정보를 선택하지 않아 지도를 표시할 수 없습니다.
          </div>
        )}
      </div>
    </div>
  );
};

export default TripDetail;
