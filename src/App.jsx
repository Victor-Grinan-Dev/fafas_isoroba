// import './App.css';
// import { useEffect, useState } from "react";
// import MainTable from './components/table/MainTable';

// // Tabletop.js-like fetch for React
// function fetchGoogleSheet(url, callback) {
//   fetch(url)
//     .then(res => res.text())
//     .then(text => {
//       const jsonStart = text.indexOf('{');
//       const jsonEnd = text.lastIndexOf('}');
//       const jsonStr = text.substring(jsonStart, jsonEnd + 1);
//       const json = JSON.parse(jsonStr);

//       // Tabletop.js returns an object keyed by sheet name
//       // Here, we mimic that structure for a single sheet
//       const sheetName = json.table ? json.table.cols[0]?.label || "Sheet1" : "Sheet1";
//       const labels = json.table.cols.map(col => col.label || "");
//       const rows = json.table.rows.map(row =>
//         row.c.map(cell => cell ? (cell.f || cell.v) : "")
//       );
//       const data = { [sheetName]: [labels, ...rows] };

//       callback(data);
//     })
//     .catch(err => console.error("Error fetching sheet:", err));
// }

// function App() {
//   const [data, setData] = useState([]);

//   useEffect(() => {
//     const url = "https://docs.google.com/spreadsheets/d/17uxTTBwLWdgZpKcJRVMtKMDOlR4UmNSE_P3ShfbaiuY/gviz/tq?tqx=out:json&sheet=week34_36";
//     fetchGoogleSheet(url, (sheetData) => {
//       // sheetData is an object keyed by sheet name
//       // You can select the sheet you want, here we just use the first key
//       const firstSheet = Object.keys(sheetData)[0];
//       setData(sheetData[firstSheet]);
//       console.log("Fetched Tabletop-like data:", sheetData);
//     });
//   }, []);

//   return (
//     <div>
//       <h1>IsoRoba Schedule</h1>
//       <MainTable data={data}/>
//     </div>
//   );
// }

// export default App;

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchSheetData } from "./app/appSlice";
import MainTable from './components/table/MainTable';

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
      <MainTable data={data}/>
    </div>
  );
}

export default App;