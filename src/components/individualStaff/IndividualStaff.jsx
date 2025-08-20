import { useSelector } from 'react-redux';
import { useState } from 'react';
import { parseDate } from '../../app/appSlice';

const IndividualStaff = () => {
  const staff = useSelector((state) => state.app.staff);
  const staffWithShift = useSelector((state) => state.app.staffWithShift);

  const today0 = new Date();
  today0.setHours(0, 0, 0, 0);

  const [selectedWorker, setSelectedWorker] = useState("");

  return (
    <div>
      <select
        value={selectedWorker}
        onChange={(e) => setSelectedWorker(e.target.value)}
      >
        <option value="" disabled>
          Select Worker
        </option>
        {staff.map((w) => (
          <option key={w.workerId} value={w.name}>
            {w.name}
          </option>
        ))}
      </select>

      <div>
        {staffWithShift
          .filter(
            (worker) =>
              !selectedWorker ||
              worker.name.trim().toLowerCase() ===
                selectedWorker.trim().toLowerCase()
          )
          .map((worker) => (
            <div key={worker.workerId} className="mb-4">
              <h3
                className="font-bold text-lg"
                style={{
                  backgroundColor: '#e90a0aff',
                  fontSize: '2.0em',
                  textAlign: 'center',
                }}
              >
                {worker.name}
              </h3>
              <div className="pl-4">
                {Object.entries(worker.scheduled)
                  .sort(([da], [db]) => parseDate(da) - parseDate(db))
                  .map(([date, shift]) => {
                    const d = parseDate(date);
                    if (!d || d < today0) return null; // skip past shifts
                    return (
                      <div
                        key={date}
                        className="text-sm"
                        style={{
                          width: '180px',
                          display: 'flex',
                          justifyContent: 'space-between',
                        }}
                      >
                        <span>
                          <span>{date}</span>
                          <span>:</span>
                        </span>
                        <span>
                          {shift.from} - {shift.to}
                        </span>
                      </div>
                    );
                  })}
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};

export default IndividualStaff;

