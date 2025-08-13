// import './App.css';
// import { useEffect, useState } from "react";

// function App() {
//   const [data, setData] = useState([]);

//   useEffect(() => {
//     const savedData = localStorage.getItem("sheetData");
//     if (savedData) {
//       setData(JSON.parse(savedData));
//       return;
//     }

//     const sheetId = "1qFikElOVShRErpoYFvGGdsir5a4WZH9E0jWKCYmvudg";
//     const sheetName = "Sheet1";
//     const url = `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?tqx=out:json&sheet=${sheetName}`;

//     fetch(url)
//       .then(res => res.text())
//       .then(text => {
//         const jsonStart = text.indexOf('{');
//         const jsonEnd = text.lastIndexOf('}');
//         const jsonStr = text.substring(jsonStart, jsonEnd + 1);
//         const json = JSON.parse(jsonStr);

//         const rows = json.table.rows.map(row =>
//           row.c.map(cell => cell ? (cell.f || cell.v) : "")
//         );

//         setData(rows);
//         localStorage.setItem("sheetData", JSON.stringify(rows));
//       })
//       .catch(err => console.error("Error fetching sheet:", err));
//   }, []);

//   return (
//     <div>
//       <h1>Google Sheet Data (Raw)</h1>
//       <pre>{JSON.stringify(data, null, 2)}</pre>
//     </div>
//   );
// }
// export default App;

import './App.css';
import { useEffect, useState } from "react";
import MainTable from './components/table/MainTable';

function App() {
  const [data, setData] = useState([]);
  

  useEffect(() => {
    const sheetId = "1qFikElOVShRErpoYFvGGdsir5a4WZH9E0jWKCYmvudg";
    const sheetName = "shedule";
    const url = import.meta.env.VITE_GOOGLE_SHEET_URL;

    fetch(url)
      .then(res => res.text())
      .then(text => {
        const jsonStart = text.indexOf('{');
        const jsonEnd = text.lastIndexOf('}');
        const jsonStr = text.substring(jsonStart, jsonEnd + 1);
        const json = JSON.parse(jsonStr);

        // Get labels from cols
        const labels = json.table.cols.map(col => col.label || "");

        // Get data rows
        const rows = json.table.rows.map(row =>
          row.c.map(cell => cell ? (cell.f || cell.v) : "")
        );

        // Prepend labels as first row
        setData([labels, ...rows]);
      })
      .catch(err => console.error("Error fetching sheet:", err));
  }, []);

  return (
    <div>
      <h1>IsoRoba Schedule</h1>
      <MainTable data={data}/>
    </div>
  );
}

export default App;