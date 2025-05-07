import { useNavigate } from "react-router-dom";

function Home() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-4xl font-bold mb-6">
        TinyTrip에 오신 걸 환영합니다!
      </h1>
      <p className="mb-8 text-gray-700">여행 일정을 등록하고 관리해보세요.</p>
      <button
        onClick={() => navigate("/trips")}
        className="px-6 py-3 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        여행 일정 관리하러 가기
      </button>
    </div>
  );
}

export default Home;
