import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchSheetData } from "./app/appSlice";
import MainTable from './components/table/MainTable';
import TodaySchedule from "./components/todaySchedule/TodaySchedule";

function App() {
  const dispatch = useDispatch();
  const data = useSelector(state => state.app.data);

  useEffect(() => {
    const url = "https://docs.google.com/spreadsheets/d/17uxTTBwLWdgZpKcJRVMtKMDOlR4UmNSE_P3ShfbaiuY/gviz/tq?tqx=out:json&sheet=week34_36";
    dispatch(fetchSheetData(url));
  }, [dispatch]);

  return (
    <div>
      <h1>IsoRoba Schedule</h1>
      {/* <MainTable data={data}/> */}
      <TodaySchedule />
    </div>
  );
}

export default App;