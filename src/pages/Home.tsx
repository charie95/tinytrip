import { useState } from 'react';
import Modal from '../components/Modal'; 
import AddTripForm from '../components/AddTripForm';
import { useTripStore } from '../stores/tripStore';

function Home() {
  const [isModalOpen, setIsModalOpen] = useState(false); // 모달 열림/닫힘 상태
  const addTrip = useTripStore((state) => state.addTrip);
  const trips = useTripStore((state) => state.trips);
  const removeTrip = useTripStore((state) => state.removeTrip);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const handleTripSubmit = (trip: {
    title: string;
    startDate: string;
    endDate: string;
    comment: string;
  }) => {
    const newTrip = {
      id: Date.now().toString(),
      ...trip,
    };
    addTrip(newTrip);
    closeModal(); 
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <h1 className="text-4xl font-bold mb-8">TinyTrip</h1>

      <button
        className="px-6 py-3 bg-blue-500 text-white rounded hover:bg-blue-600 mb-6"
        onClick={openModal}
      >
        여행 등록하기
      </button>

      {/* 모달 */}
      {isModalOpen && (
        <Modal onClose={closeModal}>
          <AddTripForm onSubmit={handleTripSubmit} onCancel={closeModal} />
        </Modal>
      )}

      {/* 여행 리스트 */}
      <div className="flex flex-col gap-4 w-full max-w-md">
      {trips.map((trip) => (
  <div key={trip.id} className="relative bg-white p-4 rounded shadow">
    <button
      onClick={() => removeTrip(trip.id)}
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

export default Home;