import { useParams } from "react-router-dom";
import { useTripStore } from "../stores/tripStore";
import { MapContainer, TileLayer, Marker, Polyline } from "react-leaflet";

const TripDetail = () => {
  const { id } = useParams<{ id: string }>();
  const trip = useTripStore((state) => state.getTripById(id || ""));

  if (!trip) {
    return <div className="p-4">😢 해당 여행 일정을 찾을 수 없습니다.</div>;
  }

  return (
    <div className="flex gap-4 h-screen p-4 box-border">
      {/* 왼쪽: 플랜 정보 영역 */}
      <div className="w-1/2 overflow-y-auto space-y-4">
        <h1 className="text-3xl font-bold">{trip.title}</h1>
        <p>
          📅 {trip.startDate} ~ {trip.endDate}
        </p>
        <p>📝 {trip.comment}</p>
        {trip.location && <p>📍 위치: {trip.location}</p>}

        {trip.plan && (
          <div>
            <h2 className="text-xl font-semibold mt-4">🧭 여행 계획</h2>
            <pre className="bg-gray-100 p-2 rounded whitespace-pre-wrap">
              {trip.plan}
            </pre>
          </div>
        )}
      </div>

      {/* 오른쪽: 지도 영역 */}
      <div className="w-1/2">
        {trip.center ? (
          <MapContainer
            center={[trip.center.lat, trip.center.lng]}
            zoom={13}
            style={{ height: "100%", width: "100%" }}
          >
            <TileLayer
              url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
              attribution='&copy; <a href="https://carto.com/">CARTO</a>'
            />
            {trip.pins &&
              trip.pins.map((pin, idx) => (
                <Marker key={idx} position={[pin.lat, pin.lng]} />
              ))}
            {trip.pins && trip.pins.length > 1 && (
              <Polyline positions={trip.pins.map((p) => [p.lat, p.lng])} />
            )}
          </MapContainer>
        ) : (
          <p className="text-sm text-gray-500">
            🌍 위치 정보가 없어 지도를 표시할 수 없습니다.
          </p>
        )}
      </div>
    </div>
  );
};

export default TripDetail;
