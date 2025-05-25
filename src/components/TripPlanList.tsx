import { FC } from "react";
import { Trip } from "../types/trip";
import { useRecoilState } from "recoil";
import { selectedDateState } from "../states/tripUi";

type TripPlanListProps = {
  trip: Trip;
  dateRange: string[];
  updateTrip: (trip: Trip) => void;
};

const TripPlanList: FC<TripPlanListProps> = ({ trip, dateRange, updateTrip }) => {
  const [selectedDate, setSelectedDate] = useRecoilState(selectedDateState);

  return (
    <div className="mt-6 space-y-4">
      <h2 className="text-xl font-semibold">📅 날짜별 계획</h2>
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
  );
};

export default TripPlanList;