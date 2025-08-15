import './App.css';
import { useEffect, useState } from "react";
import MainTable from './components/table/MainTable';

function App() {
  const [data, setData] = useState([]);

  useEffect(() => {
    const sheetId = "1qFikElOVShRErpoYFvGGdsir5a4WZH9E0jWKCYmvudg";
    const sheetName = "shedule";
    const url = `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?tqx=out:json&sheet=${sheetName}`;

    // "test";
    const sheetId2 = "17uxTTBwLWdgZpKcJRVMtKMDOlR4UmNSE_P3ShfbaiuY";
    const sheetName2="week34_36"
    const url2 = `https://docs.google.com/spreadsheets/d/${sheetId2}/gviz/tq?tqx=out:json&sheet=${sheetName2}`;

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