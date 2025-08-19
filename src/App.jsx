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

  useEffect(() => {
    const url = "https://docs.google.com/spreadsheets/d/17uxTTBwLWdgZpKcJRVMtKMDOlR4UmNSE_P3ShfbaiuY/gviz/tq?tqx=out:json&sheet=week34_36";
    dispatch(fetchSheetData(url));
  }, [dispatch]);

  const handleOptions = (e) => {
    setDisplayed(e.target.value); 
  }

  return (
    <div>
      <span style={{textAlign: 'center'}}>
        <p>Schedule</p>
        <h1>IsoRoba</h1>
      </span>
      <div  style={{display:"flex", flexDirection: 'column', alignItems: 'center'}}>
        <select onChange={(e) => handleOptions(e)} >
          <option value="day">1 Day</option>
          <option value="staff">By Staff</option>
          <option value="full">fulltable</option>
        </select>
      </div>
      
      <br />
      {/* <MainTable data={data}/> */}
      { displayed == "day" &&<TodaySchedule />}
      { displayed == "staff" &&<IndividualStaff />}
      { displayed == "full" && <MainTable data={data}/> }
    </div>
  );
}

export default App;