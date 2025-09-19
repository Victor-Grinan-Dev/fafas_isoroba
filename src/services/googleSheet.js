export async function fetchGoogleSheet(url) {
  const res = await fetch(url);
  const text = await res.text();
  const jsonStart = text.indexOf('{');
  const jsonEnd = text.lastIndexOf('}');
  const jsonStr = text.substring(jsonStart, jsonEnd + 1);
  const json = JSON.parse(jsonStr);

  const labels = json.table.cols.map(col => col.label || "");
  const rows = json.table.rows.map(row =>
    row.c.map(cell => cell ? (cell.f || cell.v) : "")
  );
  return [labels, ...rows];
}