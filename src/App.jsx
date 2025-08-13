import './App.css';
import { parseDateString } from './functions/parseDate';

import { useEffect, useState } from "react";

function App() {
  const [data, setData] = useState([]);

  useEffect(() => {
    const savedData = localStorage.getItem("sheetData");
    if (savedData) {
      setData(JSON.parse(savedData));
      return;
    }

    const sheetId = "1qFikElOVShRErpoYFvGGdsir5a4WZH9E0jWKCYmvudg";
    const sheetName = "Sheet1";
    const url = `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?tqx=out:json&sheet=${sheetName}`;

    fetch(url)
      .then(res => res.text())
      .then(text => {
        const json = JSON.parse(text.substr(47).slice(0, -2));

        const rows = json.table.rows.map(row =>
          row.c.map(cell => {
            if (!cell) return "";
            if (cell.v instanceof Date) {
              return cell.v.toISOString();
            }
            if (cell.v?.toString().startsWith("Date(")) {
              const m = cell.v.toString().match(/Date\((\d+),(\d+),(\d+),(\d+),(\d+),(\d+)\)/);
              if (m) {
                const [_, y, mo, d, h, mi, s] = m.map(Number);
                return new Date(y, mo, d, h, mi, s).toISOString();
              }
            }
            return cell.f || cell.v;
          })
        );

        setData(rows);
        localStorage.setItem("sheetData", JSON.stringify(rows));
      })
      .catch(err => console.error("Error fetching sheet:", err));
  }, []);

  return (
    <div>
      <h1>Google Sheet Data</h1>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
}

export default App;
