import { useState } from "react";
import { useTripStore } from "../stores/tripStore";
import Modal from "../components/Modal";
import AddTripForm from "../components/AddTripForm";
import { useNavigate } from "react-router-dom";

function TripList() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();
  const trips = useTripStore((state) => state.trips);
  const addTrip = useTripStore((state) => state.addTrip);
  const removeTrip = useTripStore((state) => state.removeTrip);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const handleTripSubmit = async (trip: {
    title: string;
    startDate: string;
    endDate: string;
    comment: string;
    location?: string;
  }) => {
    if (!trip.location) {
      alert("위치는 자동완성 목록에서 선택해주세요!");
      return;
    }

    const coords = await geocodeLocation(trip.location);
    if (!coords) {
      alert("좌표를 찾을 수 없습니다.");
      return;
    }

    const newTrip = {
      id: Date.now().toString(),
      ...trip,
      center: coords,
    };

    addTrip(newTrip);
    closeModal();
  };

  const geocodeLocation = async (location: string) => {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
        location
      )}`
    );
    const data = await res.json();
    if (data && data.length > 0) {
      return {
        lat: parseFloat(data[0].lat),
        lng: parseFloat(data[0].lon),
      };
    }
    return null;
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <h1 className="text-4xl font-bold mb-8">TinyTrip - 여행 일정 관리</h1>

      <button
        className="px-6 py-3 bg-blue-500 text-white rounded hover:bg-blue-600 mb-6"
        onClick={openModal}
      >
        여행 등록하기
      </button>

      {isModalOpen && (
        <Modal onClose={closeModal}>
          <AddTripForm onSubmit={handleTripSubmit} onCancel={closeModal} />
        </Modal>
      )}

      <div className="flex flex-col gap-4 w-full max-w-md">
        {trips.map((trip) => (
          <div
            key={trip.id}
            onClick={() => navigate(`/trip/${trip.id}`)}
            className="relative bg-white p-4 rounded shadow cursor-pointer hover:bg-gray-50 transition"
          >
            <button
              onClick={(e) => {
                e.stopPropagation();
                removeTrip(trip.id);
              }}
              className="absolute top-2 right-2 text-red-500 hover:text-red-700"
            >
              ✕
            </button>
            <h2 className="text-xl font-semibold">{trip.title}</h2>
            <p className="text-gray-600 text-sm mb-2">
              {trip.startDate} ~ {trip.endDate}
            </p>
            <p className="text-gray-700">{trip.comment}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default TripList;
