import { useState } from 'react';
import Modal from '../components/Modal'; // 아까 만든 모달 불러오기

function Home() {
  const [isModalOpen, setIsModalOpen] = useState(false); // 모달 열림/닫힘 상태

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-4xl font-bold mb-8">TinyTrip - Home</h1>

      {/* 여행 등록하기 버튼 */}
      <button
        className="px-6 py-3 bg-blue-500 text-white rounded hover:bg-blue-600 mb-6"
        onClick={openModal}
      >
        여행 등록하기
      </button>

      {/* 모달 표시 */}
      {isModalOpen && (
        <Modal onClose={closeModal}>
          {/* 나중에 AddTripForm 여기 들어갈거야 */}
          <div className="text-center">여기 폼 들어갈 자리!</div>
          <button
            className="mt-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
            onClick={closeModal}
          >
            닫기
          </button>
        </Modal>
      )}
    </div>
  );
}

export default Home;