import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchSheetData } from "./app/appSlice";
import MainTable from './components/table/MainTable';
import TodaySchedule from "./components/todaySchedule/TodaySchedule";
import IndividualStaff from "./components/individualStaff/IndividualStaff";

function App() {

  const dispatch = useDispatch();
  const data = useSelector(state => state.app.data);
  const [displayed, setDisplayed] = useState("day");

  const Key = import.meta.env.VITE_GOOGLE_SHEET_key;
  useEffect(() => {
    const url = `https://docs.google.com/spreadsheets/d/${Key}/gviz/tq?tqx=out:json&sheet=live_schedule`
    dispatch(fetchSheetData(url));
  }, [dispatch]);

  const handleOptions = (e) => {
    setDisplayed(e.target.value); 
  }

  return (
    <div style={{minHeight: '93dvh',
      display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '20px', justifyContent: 'space-between'}}>
      <span>
        <span style={{textAlign: 'center'}}>
          <p>Schedule</p>
          <h1>IsoRoba</h1>
        </span>
        <div  style={{display:"flex", flexDirection: 'column', alignItems: 'center'}}>
          <select onChange={(e) => handleOptions(e)} >
            <option value="day">By Day</option>
            <option value="staff">By Staff</option>
          </select>
        </div>
        <br />
   
        { displayed == "day" &&<TodaySchedule />}
        { displayed == "staff" &&<IndividualStaff />}
        { displayed == "full" && <MainTable data={data}/> }
      </span>

      <div className="footer" style={{textAlign: 'center', marginTop: '20px'}}>
        <p>Made with ❤️ by <a href="https://victor-grinan-dev.github.io/Portfolio/" target="_blank" rel="noopener noreferrer">Victor Griñán</a></p>
      </div>
    </div>
  );
}

export default App;