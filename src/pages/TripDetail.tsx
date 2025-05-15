import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useTripStore } from "../stores/tripStore";
import { GoogleMap, Marker, Polyline } from "@react-google-maps/api";
import { getDateRange } from "../utils/Date";

const TripDetail = () => {
  const { id } = useParams<{ id: string }>();
  const trip = useTripStore((state) => state.getTripById(id || ""));

  if (!trip) {
    return <div className="p-4">😢 해당 여행 일정을 찾을 수 없습니다.</div>;
  }

  const dateRange = getDateRange(trip.startDate, trip.endDate);
  const [selectedDate, setSelectedDate] = useState<string>(dateRange[0]);
  const [isEditMode, setIsEditMode] = useState<boolean>(false);
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
  console.log(trip.center);

  return (
    <div className="flex h-screen overflow-hidden">
      {/* 왼쪽 - 일정 / 장소 리스트 */}
      <div className="w-full max-w-md p-6 overflow-y-auto bg-white shadow-lg">
        <Link
          to="/trips"
          className="text-sm text-blue-500 hover:underline inline-block mb-2"
        >
          ← 여행 목록으로 돌아가기
        </Link>
        <h1 className="text-3xl font-bold">{trip.title}</h1>
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
                  useTripStore.getState().updateTrip({
                    ...trip,
                    plan: updatedPlan,
                  });
                }}
              />
            </div>
          ))}
        </div>
      </div>

      {/* 오른쪽 - 지도 */}
      <div className="flex-1 relative">
        {trip.center?.lat && trip.center?.lng ? (
          <GoogleMap
            mapContainerStyle={{ width: "100%", height: "100%" }}
            center={{ lat: trip.center!.lat, lng: trip.center!.lng }}
            zoom={13}
            onClick={(e) => {
              if (!isEditMode) return;
              const lat = e.latLng?.lat();
              const lng = e.latLng?.lng();
              if (!lat || !lng || !selectedDate) return;

              const newPin = { lat, lng };
              const updatedPins = {
                ...(trip.pins || {}),
                [selectedDate]: [...(trip.pins?.[selectedDate] || []), newPin],
              };

              useTripStore.getState().updateTrip({
                ...trip,
                pins: updatedPins,
              });
            }}
          >
            {Object.entries(trip.pins || {}).map(([date, pins]) => {
              const dayIndex = dateRange.findIndex((d) => d === date);
              if (dayIndex === -1) return null;
              return pins.map((pin, idx) => (
                <Marker
                  key={`${date}-${idx}`}
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
                />
              ));
            })}

            {Object.entries(trip.pins || {}).map(([date, pins]) => {
              const dayIndex = dateRange.findIndex((d) => d === date);
              if (dayIndex === -1) return null;
              return pins.length > 1 ? (
                <Polyline
                  key={`poly-${date}`}
                  path={pins}
                  options={{
                    strokeColor: markerColors[dayIndex % markerColors.length],
                    strokeOpacity: 0.8,
                    strokeWeight: 2,
                  }}
                />
              ) : null;
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
