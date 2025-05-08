import { useParams } from "react-router-dom";
import { useTripStore } from "../stores/tripStore";
import { GoogleMap, Marker, Polyline } from "@react-google-maps/api";

const mapContainerStyle = {
  width: "100%",
  height: "500px",
};

const TripDetail = () => {
  const { id } = useParams<{ id: string }>();
  const trip = useTripStore((state) => state.getTripById(id || ""));

  if (!trip) {
    return <div className="p-4">😢 해당 여행 일정을 찾을 수 없습니다.</div>;
  }

  const hasCenter = trip.center && trip.center.lat && trip.center.lng;

  return (
    <div className="p-4 space-y-4">
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

      {hasCenter ? (
        <GoogleMap
          mapContainerStyle={mapContainerStyle}
          center={{ lat: trip.center!.lat, lng: trip.center!.lng }}
          zoom={13}
        >
          {trip.pins?.map((pin, idx) => (
            <Marker key={idx} position={{ lat: pin.lat, lng: pin.lng }} />
          ))}

          {trip.pins && trip.pins.length > 1 && (
            <Polyline
              path={trip.pins.map((p) => ({ lat: p.lat, lng: p.lng }))}
              options={{
                strokeColor: "#007bff",
                strokeOpacity: 0.8,
                strokeWeight: 2,
              }}
            />
          )}
        </GoogleMap>
      ) : (
        <p className="text-sm text-gray-500">
          🌍 위치 정보가 없어 지도를 표시할 수 없습니다.
        </p>
      )}
    </div>
  );
};

export default TripDetail;
