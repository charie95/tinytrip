import { useState } from 'react';

interface AddTripFormProps {
  onSubmit: (trip: {
    title: string;
    startDate: string;
    endDate: string;
    comment: string;
  }) => void;
  onCancel: () => void;
}

function AddTripForm({ onSubmit, onCancel }: AddTripFormProps) {
  const [title, setTitle] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [comment, setComment] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !startDate || !endDate) return;
    onSubmit({ title, startDate, endDate, comment });
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
          등록
        </button>
      </div>
    </form>
  );
}

export default AddTripForm;