import { useSelector } from 'react-redux';
import { getFullScheduleInfo, formatDateStr  } from '../../app/appSlice';
import { useState } from 'react';

//TODO: Rename this component to SingleDaySchedule.jsx

const TodaySchedule = () => {
  const data = useSelector(state => state.app.data);
  const { todaySchedule, } = getFullScheduleInfo(data); 
  const [displayDay, setDisplayDay] = useState("today");
  const tomorrowSchedule = useSelector(state => state.app.nextDaySchedule);

  const handleDisplayDay = (newDisplayDay) => {
    setDisplayDay(newDisplayDay);
  }

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

  const headerDate =
    displayDay === "today" ? formatDateStr(today) : formatDateStr(tomorrow);

  return (
    <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
        }}>
      <span><button onClick={()=>handleDisplayDay("today")}>Today</button> <button onClick={()=>handleDisplayDay("tomorrow")}>Tomorrow</button></span>

      <div style={{ display: 'flex', alignItems: 'center', marginTop: '20px' }}>
        <h2 style={{textTransform:"capitalize"}}>
          {displayDay === "today" ? "Today " : "Tomorrow "} {headerDate}
        </h2>
      </div>
      {todaySchedule ? (
        <table>
          <thead style={{ backgroundColor: '#e90a0aff', fontSize: '2.0em' }}>
            <tr>
              <th>Worker</th>
              <th>From</th>
              <th>To</th>
            </tr>
          </thead>
          <tbody style={{ fontSize: '1.5em' }}>
            {displayDay === "today" &&
              sortByFrom(todaySchedule.workers)
              .map(worker => (
                <tr key={worker.workerId}>
                  <td>{worker.name}</td>
                  <td>{worker.from}</td>
                  <td>{worker.to}</td>
                </tr>
              ))
            }
            {displayDay === "tomorrow" &&
              sortByFrom(tomorrowSchedule?.workers ?? [])
              .map(worker => (
                <tr key={worker.workerId}>
                  <td>{worker.name}</td>
                  <td>{worker.from}</td>
                  <td>{worker.to}</td>
                </tr>
              ))
            }
          </tbody>
        </table>
      ) : (
        <div>No schedule available for today.</div>
      )}
    </div>
  );
};

export default TodaySchedule;