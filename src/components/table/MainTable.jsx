const MainTable = ({data}) => {
  if (!data || data.length === 0) {
    return <div>No data</div>;
  }

  return (
    <table border="1" cellPadding="5" style={{ borderCollapse: "collapse" }}>
      <tbody>
        {data.map((row, i) => (
          <tr key={i}>
            {row.map((cell, j) => (
              <td key={j}>{cell}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
};


export default MainTable;