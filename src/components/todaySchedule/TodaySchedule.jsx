import { useSelector } from 'react-redux';
import { getFullScheduleInfo } from '../fx/tableFunctions';

const TodaySchedule = () => {
  const data = useSelector(state => state.app.data);

  const today = new Date();
  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const todayStr = `${monthNames[today.getMonth()]}-${today.getDate()}`;
  const { todaySchedule } = getFullScheduleInfo(data); 

  return (
    <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
        }}>
      <div style={{ display: 'flex', alignItems: 'center', marginTop: '20px' }}>
        <h2>Today {todayStr}</h2>
      </div>
      {todaySchedule ? (
        <table>
          <thead style={{ backgroundColor: '#e90a0aff', fontSize: '2.2em' }}>
            <tr>
              <th>Worker</th>
              <th>From</th>
              <th>To</th>
            </tr>
          </thead>
          <tbody >
            {todaySchedule.workers.map(worker => (
              <tr key={worker.workerId}>
                <td>{worker.name}</td>
                <td>{worker.from}</td>
                <td>{worker.to}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <div>No schedule available for today.</div>
      )}
    </div>
  );
};

export default TodaySchedule;