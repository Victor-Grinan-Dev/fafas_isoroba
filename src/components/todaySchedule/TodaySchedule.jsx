import { useSelector } from 'react-redux';
import { useState } from 'react';
import { getFullScheduleInfo, formatDateStr } from '../../app/appSlice';
import { parseDate } from '../../app/appSlice';

const TodaySchedule = () => {
  const data = useSelector(state => state.app.data);
  const { todaySchedule } = getFullScheduleInfo(data);
  const tomorrowSchedule = useSelector(state => state.app.nextDaySchedule);

  const [displayDay, setDisplayDay] = useState("today");
  const [isSearch, setIsSearch] = useState(false);
  const [selectedDate, setSelectedDate] = useState("");

  const handleDisplayDay = (newDisplayDay) => {
    setDisplayDay(newDisplayDay);
    setSelectedDate("");
  };

  const handleIsSearch = () => {
    setIsSearch(!isSearch);
    setSelectedDate("");
  };

  const handleDateChange = (e) => {
    setSelectedDate(e.target.value);
  };

  const getWorkersByDate = (data, date) => {
    const header = data[0]; // staff names row
    const dayRow = data.find(row => row[1] === date);

    if (!dayRow) return [];

    const results = [];
    // every worker has 3 columns: from, to, hours
    for (let i = 2; i < dayRow.length; i += 3) {
      const from = dayRow[i];
      const to = dayRow[i + 1];
      if (from && to) {
        // find the corresponding name in header by scanning backwards
        let nameIndex = i;
        while (nameIndex >= 0 && (!header[nameIndex] || header[nameIndex].trim() === "")) {
          nameIndex--;
        }
        const name = header[nameIndex] ? header[nameIndex].trim() : `Worker ${i}`;
        results.push({ worker: name, from: from.trim(), to: to.trim() });
      }
    }

    return results;
  };

  const timeToMinutes = (t) => {
    if (!t) return Number.POSITIVE_INFINITY;
    const [h, m = "0"] = String(t).trim().split(":");
    const hh = parseInt(h, 10);
    const mm = parseInt(m.padEnd(2, "0"), 10);
    return (isNaN(hh) || isNaN(mm)) ? Number.POSITIVE_INFINITY : hh * 60 + mm;
  };

  const sortByFrom = (workers = []) =>
    [...workers].sort((a, b) => timeToMinutes(a.from) - timeToMinutes(b.from));

  const today = new Date();
  const tomorrow = new Date();
  tomorrow.setDate(today.getDate() + 1);

  const headerDate = displayDay === "today" ? formatDateStr(today) : formatDateStr(tomorrow);

  // workers for selected search date
  const searchedWorkers = selectedDate ? getWorkersByDate(data, selectedDate) : [];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <span style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
        {isSearch ? (
          <select value={selectedDate} onChange={handleDateChange}>
            <option value="" disabled>Select a future date</option>
            {data
              .filter((row, i) => i > 0 && row[1]) // skip header
              .filter(row => {
                const rowDate = parseDate(row[1]);
                if (!rowDate) return false;
                const today = new Date();
                today.setHours(0,0,0,0);
                return rowDate > today; // only tomorrow onwards
              })
              .map((row, i) => (
                <option key={i} value={row[1]}>
                  {row[0]} - {row[1]}
                </option>
              ))}
          </select>
        ) : (
          <>
            <button onClick={() => handleDisplayDay("today")}>Today</button>
            <button onClick={() => handleDisplayDay("tomorrow")}>Tomorrow</button>
          </>
        )}

        <button onClick={handleIsSearch}>
          <span className="material-symbols-outlined" style={{ fontSize: '0.9em' }}>
            {isSearch ? "close" : "search"}
          </span>
        </button>
      </span>

      <div style={{ display: 'flex', alignItems: 'center', marginTop: '20px' }}>
        <h2 style={{ textTransform: "capitalize" }}>
          {isSearch && selectedDate
            ? `Schedule for ${selectedDate}`
            : displayDay === "today"
              ? `Today ${headerDate}`
              : `Tomorrow ${headerDate}`}
        </h2>
      </div>

      <table>
        <thead style={{ backgroundColor: '#e90a0aff', fontSize: '2.0em' }}>
          <tr>
            <th>Worker</th>
            <th>From</th>
            <th>To</th>
          </tr>
        </thead>
        <tbody style={{ fontSize: '1.5em' }}>
          {isSearch && selectedDate &&
            sortByFrom(searchedWorkers).map(worker => (
              <tr key={worker.worker}>
                <td>{worker.worker}</td>
                <td>{worker.from}</td>
                <td>{worker.to}</td>
              </tr>
            ))
          }

          {!isSearch && displayDay === "today" &&
            sortByFrom(todaySchedule?.workers ?? []).map(worker => (
              <tr key={worker.workerId}>
                <td>{worker.name}</td>
                <td>{worker.from}</td>
                <td>{worker.to}</td>
              </tr>
            ))
          }

          {!isSearch && displayDay === "tomorrow" &&
            sortByFrom(tomorrowSchedule?.workers ?? []).map(worker => (
              <tr key={worker.workerId}>
                <td>{worker.name}</td>
                <td>{worker.from}</td>
                <td>{worker.to}</td>
              </tr>
            ))
          }
        </tbody>
      </table>
    </div>
  );
};

export default TodaySchedule;

